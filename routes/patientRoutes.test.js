const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const MongoClient = require('mongodb').MongoClient;

jest.mock('../repository/PatientRepository');
jest.mock('mongodb');


describe('test Patient routes', () => {
  beforeAll(() => {
    jest.spyOn(MongoClient, 'connect').mockImplementation(() => jest.fn());
  });

  afterEach(() => {
    server.close();
  });

  test('GET /patient/get-status-form/patientABC', async () => {
    const response = await request(app).get('/patient/get-status-form/patientABC');
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body[0])).toBe(JSON.stringify({_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}));
  });

  test('POST /update-status-form/patientABC', async () => {
    const response = await request(app).post('/patient/update-status-form/patientABC');
    expect(response.statusCode).toBe(200);
  });

  test('POST /submit-status-form', async () => {
    const response = await request(app).post('/patient/submit-status-form');
    expect(response.statusCode).toBe(200);
  });

  test('POST /raise-flag', async () => {
    const response = await request(app).post('/patient/raise-flag/patientABC').send({flagType: 'doctorFlag', flagValue: true});
    expect(response.statusCode).toBe(200);
  });
});
