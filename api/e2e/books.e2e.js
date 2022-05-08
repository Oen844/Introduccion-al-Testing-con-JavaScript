const request = require('supertest');
const { MongoClient } = require('mongodb');

const createApp = require('../src/app');
const { config } = require('../src/config');

const DB_NAME = config.dbName;
const MONGO_URI = config.dbUrl;

describe('Test for books', () => {
  let app = null;
  let server = null;
  let database = null;
  beforeAll(async () => {
    app = createApp();
    server = app.listen(3050);
    const client = new MongoClient(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    database = client.db(DB_NAME);
  });

  afterAll(async () => {
    await database.dropDatabase();
    await server.close();
  });

  describe('test for [GET] /api/v1/books', () => {
    test('Shold return list books', () => {
      // Arrange
      const seedData = database.collection('books').insertMany([
        {
          name: 'Harry Potter',
          year: '1997',
          author: 'J.K. Rowling',
        },
        {
          name: 'Harry Potter2',
          year: '2000',
          author: 'J.K. Rowling',
        },
      ]);
      console.log(seedData);
      // Act
      return request(app)
        .get('/api/v1/books')
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          // Assert
          expect(body.length).toEqual(2);
        });
    });
  });
});
