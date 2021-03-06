import {render, screen} from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

import RequestDoctorPage from './RequestDoctorPage';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

jest.mock('axios');

describe('visual test of RequestDoctorPage component', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
      },
      dbData: {
        patientInfo: {
          doctor: '',
        },
      },
    },
  };
  beforeEach(() => {
    axios.get.mockReturnValue({
      data: {
        wantToBeAssignedToDoctor: false,
      },
    });
  });

  it('should load and display without error', async () => {
    render(
      <AuthContext.Provider value={auth}>
        <RequestDoctorPage />
      </AuthContext.Provider>,
    );

    expect(await screen.findByTestId('request-doctor-button')).toBeInTheDocument();
  });

  it('should load and display without error when doctor is assigned', async () => {
    const value = {
      currentUser: {
        ...auth.currentUser,
        dbData: {
          patientInfo: {
            doctor: 'John Doe',
          },
        },
      },
    };
    render(
      <AuthContext.Provider value={value}>
        <RequestDoctorPage />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/Your doctor: John Doe/)).toBeInTheDocument();
  });

  it('should fetch patient on load', async () => {
    axios.get.mockReturnValueOnce({
      data: {
        wantToBeAssignedToDoctor: true,
      },
    });
    render(
      <AuthContext.Provider value={auth}>
        <RequestDoctorPage />
      </AuthContext.Provider>,
    );

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(await screen.findByTestId('request-doctor-button')).toHaveTextContent(
      'Cancel Doctor Request',
    );
  });

  it('should send request on request doctor click', async () => {
    render(
      <AuthContext.Provider value={auth}>
        <RequestDoctorPage />
      </AuthContext.Provider>,
    );

    userEvent.click(screen.getByTestId('request-doctor-button'));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(await screen.findByTestId('request-doctor-button')).toHaveTextContent(
      'Cancel Doctor Request',
    );
  });
});
