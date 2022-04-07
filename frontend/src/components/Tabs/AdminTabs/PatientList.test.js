import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import PatientList from './PatientList.js';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';

jest.mock('axios');

describe('visual test of the PatientList component', () => {
  const auth = {
    currentUser: {
      uid: '0987',
      user: {
        uid: '1234',
      },
      dbData: {
        userType: 'administrator',
        user: {
          uid: '0987',
        },
      },
    },
  };
  beforeEach(() => {
    axios.get.mockReturnValue({
      data: {
        data: [
          {
            uid: '4312',
            name: 'Bruce Wayne',
            dob: '1111-11-11',
            wantToBeAssignedToDoctor: false,
            patientInfo: {
              doctor: 'John Doe',
              doctorId: '1234',
            },
          },
        ],
      },
    });
  });

  it('should render without crashing and load list of patient for admin', async () => {
    localStorage.setItem('userType', 'administrator');
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Patient List/)).toBeInTheDocument();
    expect(await screen.findByText(/Date of Birth: 1111-11-11/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get.mock.calls[0]).toEqual(expect.arrayContaining(['admin/1234/patients']));
  });

  it('should render without crashing and load list of patient for immigration official', async () => {
    localStorage.setItem('userType', 'immigrationOfficial');
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Patient List/)).toBeInTheDocument();
    expect(await screen.findByText(/Date of Birth: 1111-11-11/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get.mock.calls[0]).toEqual(
      expect.arrayContaining(['immigration-official/1234/patients']),
    );
  });

  it('should render without crashing and load list of patient for health official', async () => {
    localStorage.setItem('userType', 'healthOfficial');
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Patient List/)).toBeInTheDocument();
    expect(await screen.findByText(/Date of Birth: 1111-11-11/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get.mock.calls[0]).toEqual(
      expect.arrayContaining(['health-official/1234/patients']),
    );
  });

  it('should render without crashing and load list of patient for anyone else', async () => {
    localStorage.setItem('userType', 'patient');
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Patient List/)).toBeInTheDocument();
    expect(await screen.findByText(/Date of Birth: 1111-11-11/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalled();
    expect(axios.get.mock.calls[0]).toEqual(expect.arrayContaining(['admin/1234/patients']));
  });
});
