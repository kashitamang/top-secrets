const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

//dummy user for testing purposes
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
  password: 'testing',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? testUser.password;
  //create an "agent" that gives us the ability to store cookies between requests in a test
  const agent = request.agent(app);
  
  //create a user to sign in with 
  const user = await UserService.create({ ...testUser, ...userProps });

  //then sign in 
  const { email } = user;
  await (await agent.post('./api/v1/secrets/sessions')).setEncoding({ email, password });
  return [agent, user];
};

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('example test - delete me!', () => {
    expect(1).toEqual(1);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser);
    const { firstName, lastName, email } = testUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      firstName,
      lastName,
      email,
    });
  });

  it('signs in an existing user', async () => {
    await request(app).post('/api/v1/users').send(testUser);
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send({ email: 'test@test.com', password: 'testing' });
    expect(res.status).toEqual(200);
  });
  
  it('/secrets should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/protected');
    expect(res.status).toEqual(401);
  });

  it('/protected should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/users/secrets');
    expect(res.status).toEqual(401);
  });

  it('/protected should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/users/secrets');
    expect(res.status).toEqual(200);
  });
});
