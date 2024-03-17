import supertest from 'supertest';

import { app } from '../../src/app';
import httpStatus from 'http-status';
import { DateTime } from 'luxon';

const request = supertest(app);
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

describe('POST /v1/task', () => {
  it('Should return a 400 for empty request body', async () => {
    const response = await request.post('/api/v1/task').send();

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([expect.any(Object)])
      })
    );
  });

  it('Should return a 400 for bad payload', async () => {
    const body = {
      title: 2,
      description: 345,
      notificationSubscription: {},
      startTime: {},
      completionTime: {}
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([
          expect.objectContaining({
            path: 'body',
            field: expect.any(String),
            message: expect.any(String)
          })
        ])
      })
    );
  });

  it('Should return a 409  when startTime is a past date', async () => {
    const body = {
      title: 'Valid title',
      description: 'Valid description',
      notificationSubscription: { reminder: true, taskStarted: true, taskCompleted: true },
      startTime: DateTime.utc().minus({ days: 2 }).toISO() //  date in the past
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([expect.any(String)])
      })
    );
    expect(response.body.errors[0].includes('startTime')).toBe(true);
  });

  it('Should return a 409 when completionTime is a past date', async () => {
    const body = {
      title: 'Valid title',
      description: 'Valid description',
      notificationSubscription: { reminder: true, taskStarted: true, taskCompleted: true },
      completionTime: DateTime.utc().minus({ days: 1 }).toISO()
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([expect.any(String)])
      })
    );
    expect(response.body.errors[0].includes('completionTime')).toBe(true);
  });

  it('Should return a 409 for wrong timeline', async () => {
    const body = {
      title: 'Valid title',
      description: 'Valid description',
      notificationSubscription: { reminder: true, taskStarted: true, taskCompleted: true },
      startTime: DateTime.utc().plus({ days: 3 }).toISO(),
      completionTime: DateTime.utc().plus({ days: 1 }).toISO()
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.CONFLICT);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([expect.any(String)])
      })
    );
  });

  it('Should create task and return correct response', async () => {
    const body = {
      title: 'Sample Task',
      description: 'Test if task is created',
      startTime: DateTime.utc().plus({ days: 2 }).toISO(),
      completionTime: DateTime.utc().plus({ days: 3 }).toISO(),
      notificationSubscription: { reminder: true }
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.CREATED);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: true,
        message: expect.any(String),
        data: {
          title: body.title,
          id: expect.any(String),
          startTime: body.startTime,
          description: expect.any(String),
          notificationSubscription: { reminder: true },
          dateCreated: expect.stringMatching(ISO_DATE_REGEX),
          dateUpdated: expect.stringMatching(ISO_DATE_REGEX),
          completionTime: body.completionTime
        }
      })
    );
  });
});
