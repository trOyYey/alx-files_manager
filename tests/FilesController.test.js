import fs from 'fs';
import path from 'path';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sha1 from 'sha1';
import { ObjectId, MongoClient } from 'mongodb';
import { createClient } from 'redis';
import { promisify } from 'util';
import { v4 } from 'uuid';
import app from '../server';

chai.use(chaiHttp);

const { expect } = chai;

let dbClient;
let db;
let rdClient;
let asyncSet;
let asyncGet;
let asyncDel;
const host = process.env.DB_HOST || 'localhost';
const port = process.env.BD_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
const MAX_PAGE_SIZE = 20;
const hashedPassword = sha1('test');

describe('fileController.js tests - File info and data retrieval endpoints', () => {
  const userOne = {
    _id: new ObjectId(),
    email: 'test',
    password: hashedPassword,
  };
  const userTwo = {
    _id: new ObjectId(),
    email: 'dev@mail.com',
    password: hashedPassword,
  };
  const userOneToken = v4();
  const userTwoToken = v4();
  const userOneTokenKey = `auth_${userOneToken}`;
  const userTwoTokenKey = `auth_${userTwoToken}`;

  const folders = [];
