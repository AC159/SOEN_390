const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const MongoClient = require('mongodb').MongoClient;
const PatientRepository = require('../repository/PatientRepository');
const patientRepository = new PatientRepository();

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
    const response = await request(app).get('/patient/get-status-forms/patientABC');
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body.data[0])).toBe(
      JSON.stringify({_id: '123456789', patientUid: 'abcdef', doctorUid: 'asdfgg'}),
    );
    expect(patientRepository.fetchPatientStatusForms).toHaveBeenCalledTimes(1);
  });

  test('POST /update-status-form/patientABC', async () => {
    const response = await request(app).post('/patient/update-status-form/patientABC');
    expect(response.statusCode).toBe(200);
    expect(patientRepository.updateStatusForm).toHaveBeenCalledTimes(1);
  });

  test('POST /submit-status-form', async () => {
    const response = await request(app).post('/patient/submit-status-form');
    expect(response.statusCode).toBe(200);
    expect(patientRepository.addStatusForm).toHaveBeenCalledTimes(1);
  });

  test('POST /submit-contact-tracing', async () => {
    const response = await request(app).post('/patient/submit-contact-tracing');
    expect(response.statusCode).toBe(200);
  });

  test('GET /get-contact-tracing/:patientUid', async () => {
    const response = await request(app).get('/patient/get-contact-tracing/patientABC');
    expect(response.statusCode).toBe(200);
  });

  // test('POST /submit-traveler-form', async () => {
  //   const response = await request(app).post('/patient/submit-traveler-form').send({
  //     patientUid: '12345',
  //     locationDescription: 'Canada',
  //     date: '11-11-11',
  //     travelPurpose: 'pleasure',
  //   });
  //   expect(response.statusCode).toBe(200);
  // });

  // test('GET /get-traveler-form/:patientUid', async () => {
  //   const response = await request(app).get('/get-traveler-form/patientABC');
  //   expect(response.statusCode).toBe(200);
  // });

  test('POST /raise-flag', async () => {
    const response = await request(app)
      .post('/patient/raise-flag/patientABC')
      .send({flagType: 'doctorFlag', flagValue: true});
    expect(response.statusCode).toBe(200);
    expect(patientRepository.raiseFlag).toHaveBeenCalledTimes(1);
  });

  test('GET /patient/get-patients-covid-info/:officialId', async () => {
    const response = await request(app).get('/patient/get-patients-covid-info/officialID123');
    expect(response.statusCode).toBe(200);
    expect(JSON.stringify(response.body[0])).toBe(
      JSON.stringify({name: 'John Doe', patientUid: 'abcdef', covidStatus: 'negative'}),
    );
  });
});
