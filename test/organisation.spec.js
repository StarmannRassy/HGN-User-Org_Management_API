// test/organisation.spec.js (or wherever your test file is)
const request = require('supertest');
const app = require('../app'); // Adjust the path based on your project structure

describe('Organisation Endpoints', () => {
  let token;
  let orgId;

  beforeAll(async () => {
    const user = {
      firstName: 'maureen',
      lastName: 'attah',
      email: 'bisi@example.com',
      password: 'password',
      phone: '12345678',
    };

    // Assuming your registration endpoint returns the expected data structure
    const response = await request(app)
      .post('/api/auth/register')
      .send(user);

    token = response.body.data.accessToken;
    orgId = response.body.data.organisation.orgId;
  });

  it('should create a new organisation', async () => {
    const organisation = {
      name: "maureen's Organisation",
      description: 'This is a new organisation.',
    };

    const response = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${token}`)
      .send(organisation);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    expect(response.body.data.name).toBe(organisation.name);
  });

  it('should get a single organisation by ID', async () => {
    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.orgId).toBe(orgId);
  });

  it('should get all organisations for the logged-in user', async () => {
    const response = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.organisations.length).toBeGreaterThan(0);
  });

  it('should add a user to an organisation', async () => {
    const newUser = {
      firstName: 'maureen',
      lastName: 'attah',
      email: 'bisi@example.com',
      password: 'password',
      phone: '12345678',
    };

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    const newUserId = registerResponse.body.data.user.userId;

    const response = await request(app)
      .post(`/api/organisations/${orgId}/users`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: newUserId });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toBe('User added to organisation successfully');
  });
});
