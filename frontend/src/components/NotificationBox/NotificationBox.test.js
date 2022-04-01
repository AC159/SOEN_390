import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import NotificationBox from './NotificationBox';

jest.mock('axios');

describe('visual test of Notification box', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '12345',
      },
    },
  };

  it('should load and display without error', () => {
    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );

    expect(screen.getByText(/Notifications/)).toBeInTheDocument();
  });

  it('should throw when there is a problem with axios', async () => {
    axios.get.mockRejectedValue(new Error('This is not working'));

    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );
  });
});
