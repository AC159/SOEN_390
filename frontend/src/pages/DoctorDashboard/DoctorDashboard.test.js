import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import DoctorDashboard from './DoctorDashboard';

jest.mock('axios');

window.scrollTo = jest.fn();

describe('test Doctor Dashboard page', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
      },
    },
  };
  it('should load and display without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <DoctorDashboard />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Today's News/)).toBeInTheDocument();
  });

  it('should be able to change tab', async () => {
    axios.get.mockResolvedValue({
      data: {
        data: [],
      },
    });
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <DoctorDashboard />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Today's News/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/^Monitor Patients$/));
    expect(await screen.findByText(/^Patients COVID Data$/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/^Book Appointment$/));
    expect(await screen.findByText(/Add Appointment/)).toBeInTheDocument();
  });
});
