import request from 'supertest';
import httpStatus from 'http-status';

import { app } from '../../app';

describe('Test Server Endpoints', () => {
  test('GET /ping endpoint returns status code 200', async () => {
    const response = await request(app).get('/api/v1/ping');
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(
      expect.objectContaining({
        data: {
          version: expect.stringMatching(/^[a-zA-Z0-9]+$/)
        }
      })
    );
  });
});
