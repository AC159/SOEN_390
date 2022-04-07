import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import PatientBox from './PatientBox';
import useFetch from '../../hook/useFetch';
import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';

jest.mock('axios');
jest.mock('../../hook/useFetch');

describe('visual test of the component', () => {
  const patient = {
    uid: '123456',
    name: 'Alfred',
    dob: '1234-12-12',
    patientInfo: {
      doctor: 'John',
    },
  };

  const currentUser = {
    user: {
      uid: '1234567890',
    },
    dbData: {
      userType: 'administrator',
    },
  };

  beforeEach(() => {
    useFetch.mockReturnValue([[], jest.fn()]);
  });

  it('should render without crashing', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: 'john@email.com',
            dbData: {
              userType: 'administrator',
            },
          },
          logout: () => {},
        }}
      >
        <PatientBox eventKey='event-key' currentUser={currentUser} patient={patient} />
      </AuthContext.Provider>,
    );
  });

  it('should display patient name accurately', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: 'john@email.com',
            dbData: {
              userType: 'administrator',
            },
          },
          logout: () => {},
        }}
      >
        <PatientBox eventKey='event-key' currentUser={currentUser} patient={patient} />
      </AuthContext.Provider>,
    );
    expect(screen.getByTestId('patient-name')).toHaveTextContent('Alfred');
  });

  it('should display patient dob accurately', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: 'john@email.com',
            dbData: {
              userType: 'administrator',
            },
          },
          logout: () => {},
        }}
      >
        <PatientBox eventKey='event-key' currentUser={currentUser} patient={patient} />
      </AuthContext.Provider>,
    );
    expect(screen.getByTestId('patient-dob')).toHaveTextContent('1234-12-12');
  });

  it('should assign doctor to patient when assign button click', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: 'john@email.com',
            dbData: {
              userType: 'administrator',
            },
          },
          logout: () => {},
        }}
      >
        <PatientBox
          eventKey='event-key'
          userType='administrator'
          currentUser={currentUser}
          patient={patient}
        />
      </AuthContext.Provider>,
    );

    userEvent.click(screen.getByText(/Assign Doctor/));
    expect(screen.getByText(/^Doctors$/)).toBeInTheDocument();

    userEvent.click(screen.getByText(/Assign to Alfred/));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0]).toEqual(expect.arrayContaining(['admin/1234567890/patient']));
  });
});
