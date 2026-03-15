const request = require('supertest');
const app = require('./server');
const db = require('./db');

describe('API Endpoints', () => {
  beforeAll((done) => {
    // Clear the messages table before tests
    db.run('DELETE FROM messages', done);
  });

  afterAll((done) => {
    // Keep it clean
    db.run('DELETE FROM messages', () => {
      db.close(done);
    });
  });

  let messageId;

  it('should post a new message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ text: 'Hello World Test' });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.text).toEqual('Hello World Test');
    expect(res.body.likes).toEqual(0);
    
    messageId = res.body.id;
  });

  it('should not post an empty message', async () => {
    const res = await request(app)
      .post('/api/messages')
      .send({ text: '   ' });
    
    expect(res.statusCode).toEqual(400);
  });

  it('should get all messages', async () => {
    const res = await request(app).get('/api/messages');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].text).toEqual('Hello World Test');
  });

  it('should like a message', async () => {
    const res = await request(app).post(`/api/messages/${messageId}/like`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.likes).toEqual(1);
  });
});
