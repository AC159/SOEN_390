import {render, screen} from '@testing-library/react';
import PatientBox from './PatientBox';
import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
jest.mock('axios');

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
});
