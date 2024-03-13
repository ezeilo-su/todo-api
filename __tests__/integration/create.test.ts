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
      startTime: DateTime.utc().minus({ days: 1 }).toISO(),
      completionTime: DateTime.utc().minus({ days: 3 }).toISO()
    };
    const response = await request.post('/api/v1/task').send(body);

    expect(response.status).toEqual(httpStatus.BAD_REQUEST);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        success: false,
        message: expect.any(String),
        errors: expect.arrayContaining([expect.any(Object)])
      })
    );
  });

  it('Should create task and return correct response', async () => {
    const body = {
      title: 'Sample Task',
      description: 'Test if task is created',
      startTime: DateTime.utc().plus({ days: 2 }).toISO(),
      completionTime: DateTime.utc().plus({ days: 3 }).toISO(),
      notificationSubscription: { reminder: true },
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
          completionTime: expect.stringMatching(ISO_DATE_REGEX),
        }
      })
    );
  });
});
