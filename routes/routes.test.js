const request = require('supertest');
const app = require('../app');
const server = require('../app').server;
const UserRepository = require('../repository/UserRepository');

jest.mock('../WebSockets/socketIO');
jest.mock('../repository/UserRepository');
jest.mock('mongodb');

describe('integration test healthOfficialRoutes - connection to domain', () => {
  afterAll(() => {
    server.close();
  });

  describe('test GET /:userId/profile', () => {
    let mockGet;
    beforeEach(() => {
      mockGet = jest.spyOn(UserRepository.prototype, 'fetch');
    });

    afterEach(() => {
      mockGet.mockRestore();
    });

    it('should be able to view patients', async () => {
      mockGet.mockImplementation(() => ({
        'uid': 'Lf8chvBVlYgqFpVh6TCC8A4eFgk2',
        'name': 'Logan Lapadula',
        'userStatus': 'APPROVED',
        'phoneNumber': '1234567890',
        'dob': '2022-03-03',
        'address': '1225 rue Waystar',
        'userType': 'patient',
      }));

      const res = await request(app).get('/user/17765/profile');
      expect(res.status).toEqual(200);
      expect(JSON.stringify(res.body)).toBe(JSON.stringify({
        'uid': 'Lf8chvBVlYgqFpVh6TCC8A4eFgk2',
        'name': 'Logan Lapadula',
        'userStatus': 'APPROVED',
        'phoneNumber': '1234567890',
        'dob': '2022-03-03',
        'address': '1225 rue Waystar',
        'userType': 'patient',
      }));
    });

    it('should return error message with 400 status code', async () => {
      mockGet.mockImplementation(() => {
        throw new Error('The user is not valid');
      });

      const response = await request(app).get('/user/17765/profile');
      expect(response.status).toEqual(400);
      expect(response.body.error).toBe('The user is not valid');
    });
  });

  describe('test POST /addNewUser', () => {
    let mockFetch;
    let mockAdd;
    beforeEach(() => {
      UserRepository.mockClear();
      mockAdd = jest.spyOn(UserRepository.prototype, 'add');
      mockFetch = jest.spyOn(UserRepository.prototype, 'fetch')
          .mockImplementation(() => ({
            userId: '1234',
            firstName: 'John',
            lastName: 'Doe',
            userStatus: 'PENDING',
            phoneNumber: '123-123-1234',
            dob: '1111-11-11',
            address: '1234 Street',
            userType: 'patient',
            verification: {
              insurance: '1234567890',
            },
            email: 'jdoe@email.com',
          }));
    });

    afterEach(() => {
      mockAdd.mockRestore();
      mockFetch.mockRestore();
    });

    it('should return flagged raise with status 200', async () => {
      const data = {
        userId: '1234',
        firstName: 'John',
        lastName: 'Doe',
        userStatus: 'PENDING',
        phoneNumber: '123-123-1234',
        dob: '1111-11-11',
        address: '1234 Street',
        userType: 'patient',
        verification: {
          insurance: '1234567890',
        },
        email: 'jdoe@email.com',
      };
      const response = await request(app)
          .post('/user/addNewUser')
          .send(data);
      expect(response.statusCode).toBe(201);
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(data));
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should return status 400 and error message on error', async () => {
      mockAdd.mockImplementation(() => {
        throw new Error('The user is not valid');
      });

      const response = await request(app).post('/user/addNewUser');

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('The user is not valid');
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });
  });
});
