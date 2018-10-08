const request = require('supertest');
const { describe, it } = require('mocha');
const expect = require('chai').expect;
const app = require('../app').app;

describe('Login API', () => {
  it('Should success if credential is valid', () => {
    return request(app)
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ username: 'mali@ante1.com', password: 'jedan' })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(response => {
        expect(response.body).not.to.be.empty;
        expect(response.body).to.be.an('object');
      });
  });
});
