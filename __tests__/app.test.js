const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

//dummy user for testing purposes
const testUser = {
  title: 'Test',
  description: 'Test Secret',
};

const regiserAndLogin = async (userProps = {})=> {
  const title = userProps.title ?? testUser.title;
  //create an "agent" that gives us the ability to store cookies between requests in a test
  const agent =
   
}

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('example test - delete me!', () => {
    expect(1).toEqual(1);
  });


  afterAll(() => {
    pool.end();
  });
});
