/**
 * In-memory MongoDB bootstrap for integration property-based tests.
 *
 * Each integration spec file should:
 *   - call `setupInMemoryMongo()` once in `beforeAll`
 *   - call `clearCollections()` in `beforeEach` to amortize startup cost
 *   - call `teardownInMemoryMongo()` once in `afterAll`
 *
 * The helpers manage a single `MongoMemoryServer` + `mongoose` connection per
 * Jest worker and are idempotent so accidental re-calls do not throw.
 */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection, ConnectionStates } from 'mongoose';

let mongod: MongoMemoryServer | null = null;

export interface InMemoryMongoHandle {
  mongod: MongoMemoryServer;
  connection: Connection;
}

/**
 * Starts a `MongoMemoryServer`, connects Mongoose to it, and returns both
 * handles. Subsequent calls without a teardown reuse the existing instance
 * rather than starting a second server.
 */
export const setupInMemoryMongo = async (): Promise<InMemoryMongoHandle> => {
  if (!mongod) {
    mongod = await MongoMemoryServer.create();
  }

  const uri = mongod.getUri();

  // Mirror the production AppModule env contract so any code path that reads
  // MONGO_URI directly during tests sees the in-memory URI too.
  process.env.MONGO_URI = uri;

  if (mongoose.connection.readyState === ConnectionStates.disconnected) {
    await mongoose.connect(uri);
  }

  return { mongod, connection: mongoose.connection };
};

/**
 * Disconnects Mongoose and stops the in-memory server. Safe to call even if
 * setup was never invoked or has already been torn down.
 */
export const teardownInMemoryMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== ConnectionStates.disconnected) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }

  if (mongod) {
    await mongod.stop();
    mongod = null;
  }
};

/**
 * Empties every collection on the active Mongoose connection without dropping
 * indexes (so partial-unique constraints remain enforced across tests).
 * Intended to be invoked from `beforeEach`.
 */
export const clearCollections = async (): Promise<void> => {
  if (mongoose.connection.readyState === ConnectionStates.disconnected) {
    return;
  }

  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};
