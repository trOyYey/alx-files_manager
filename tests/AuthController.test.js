import chai from 'chai';
import chaiHttp from 'chai-http';
import sha1 from 'sha1';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import { promisify } from 'util';
import { v4 } from 'uuid';
import app from '../server';

chai.use(chaiHttp);
const { expect } = chai;

describe('authController.js tests', () => {
  let dbClient;
  let db;
  let rdClient;
  let asyncSet;
  let asyncGet;
  let asyncDel;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.BD_PORT || 27017;
  const database = process.env.DB_DATABASE || 'files_manager';
  const password = 'test';
  const hashedPassword = sha1(password);
  const user = {
    email: 'test',
    password: hashedPassword,
  };
  const token = v4();

  before(
    () => new Promise((resolve) => {
      dbClient = new MongoClient(`mongodb://${host}:${port}`, {
        useUnifiedTopology: true,
      });
      dbClient.connect(async (error, client) => {
        if (error) throw error;
        db = await client.db(database);
        await db.collection('users').deleteMany({});

        const commandResults = await db.collection('users').insertOne(user);

        rdClient = createClient();
        asyncSet = promisify(rdClient.set).bind(rdClient);
        asyncGet = promisify(rdClient.keys).bind(rdClient);
        asyncDel = promisify(rdClient.del).bind(rdClient);
        rdClient.on('connect', async () => {
          await asyncSet(
            `auth_${token}`,
            commandResults.insertedId.toString(),
          );
          resolve();
