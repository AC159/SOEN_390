import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import GeneralDashboard from './GeneralDashboard';

jest.mock('axios');

describe('test General Dashboard page', () => {
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
          <GeneralDashboard />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Today's News/)).toBeInTheDocument();
  });
});
