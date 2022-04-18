import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import IODashboard from './IODashboard';

jest.mock('axios');

describe('test Immigration Officer Dashboard page', () => {
  const auth = {
    currentUser: {
      dbData: {userStatus: 'PENDING'},
      user: {
        uid: '1234',
      },
    },
  };
  it('should load and display without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <IODashboard />
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
          <IODashboard />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Today's News/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/^Monitor Patients$/));
    expect(await screen.findByPlaceholderText('Search patient by name...')).toBeInTheDocument();
    userEvent.click(await screen.findByText(/^Contact$/));
    expect(await screen.findByText('Contacts')).toBeInTheDocument();
  });
});
