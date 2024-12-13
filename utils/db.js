import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.BD_PORT || 27017;
    const DATABASE = process.env.DB_DATABASE || 'files_manager';
    const URI = `mongodb://${HOST}:${PORT}`;
    this.mongoClient = new MongoClient(URI, { useUnifiedTopology: true });
    this.mongoClient.connect((error) => {
      if (!error) this.db = this.mongoClient.db(DATABASE);
    });
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  getCollection(collectionName) {
    const collection = this.db.collection(collectionName);
    return collection;
  }

  async nbUsers() {
    const usersCollection = this.getCollection('users');
    const numberOfUsers = await usersCollection.countDocuments();
    return numberOfUsers;
  }

  async nbFiles() {
    const filesCollection = this.getCollection('files');
    const numberOfFiles = await filesCollection.countDocuments();
    return numberOfFiles;
  }

  async close() {
    await this.mongoClient.close();
  }
}

const dbClient = new DBClient();
export default dbClient;
