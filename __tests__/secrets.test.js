const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

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

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('/secrets should return a 401 if not authenticated', async () => {
    const res = await request(app).get('/api/v1/secrets');
    expect(res.status).toEqual(401);
  });

  it('/secrets should return the current user if authenticated', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});
