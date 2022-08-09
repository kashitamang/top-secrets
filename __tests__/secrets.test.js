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
  
  const agent = request.agent(app);
  
  const user = await UserService.create({ ...testUser, ...userProps });
  
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
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

  it('#GET protected /secrets should return list of secrets for auth user', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.get('/api/v1/secrets');
    expect(res.status).toBe(200);
  });

  it('#POST should add a new secret if user is logged in', async () => {
    const agent = await registerAndLogin();
    const newSecret = {
      title: 'Lindsey Lohan',
      description: 'Shes just a little bossy'
    };
    const res = await agent.post('/api/v1/secrets').send(newSecret);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      ...newSecret
    });
  });

  afterAll(() => {
    pool.end();
  });
});
