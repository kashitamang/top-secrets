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

const registerAndLogin = async (userProps = {})=> {
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
});
