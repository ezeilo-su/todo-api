import { Mongoose } from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

import { connectDB } from '../src/setup/db';

let db: MongoMemoryReplSet;
let client: Mongoose;

jest.setTimeout(30_000);

beforeAll(async () => {
  db = await MongoMemoryReplSet.create({ replSet: { count: 4 } });
  const connString = db.getUri();

  client = await connectDB({ url: connString });
});

beforeEach(async () => {
  const collections = await client.connection.db.collections();

  for (let collection of collections) {
    collection.deleteMany({});
  }
});

afterAll(async () => {
  await client?.connection?.close();
  await db?.stop();
});
