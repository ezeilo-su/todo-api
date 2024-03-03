import request from 'supertest';
import httpStatus from 'http-status';

import { app } from '../../src/app';

describe('Test Server Endpoints', () => {
  test('GET /ping endpoint returns status code 200', async () => {
    const response = await request(app).get('/api/ping');
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: {
          meta: {
            version: expect.stringMatching(/^[a-zA-Z0-9]+$/)
          }
        }
      })
    );
  });
});
