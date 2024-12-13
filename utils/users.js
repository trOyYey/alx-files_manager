import dbClient from './db';
import sha1 from 'sha1';

class UsersCollection {
static async createUser({ email, password }) {
    const collection = dbClient.getCollection('users');
    const newUser = { email, password: sha1(password) };
    const commandResult = await collection.insertOne(newUser);
    return commandResult.insertedId;
}
static async getUser(query) {
    const collection = dbClient.getCollection('users');
    const user = await collection.find(query);
    return user;
}
}

export default UsersCollection;
