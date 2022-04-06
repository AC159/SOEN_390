import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import NotificationBox from './NotificationBox';

jest.mock('axios');
window.scrollTo = jest.fn();

describe('visual test of Notification box', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '12345',
      },
    },
  };

  it('should load and display without error', async () => {
    axios.get.mockResolvedValueOnce({data: []});
    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/No new notifications/)).toBeInTheDocument();
  });

  it('should throw when there is a problem with axios', async () => {
    axios.get.mockRejectedValue(new Error('This is not working'));

    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );
  });

  it('should display notification when present', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1234',
          timeStamp: 1234567890,
          type: 'warning',
          heading: 'Test',
          mainText: 'testing',
          subText: '123-testing',
        },
      ],
    });

    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/^Test$/)).toBeInTheDocument();
    expect(await screen.findByText(/^testing$/)).toBeInTheDocument();
  });

  it('should delete notification on delete notification', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1234',
          timeStamp: 1234567890,
          type: 'urgent',
          heading: 'Test',
          mainText: 'testing',
          subText: '123-testing',
        },
      ],
    });

    axios.post.mockResolvedValueOnce({success: true});

    render(
      <AuthContext.Provider value={auth}>
        <NotificationBox />
      </AuthContext.Provider>,
    );

    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/^Test$/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/More/));
    userEvent.click(await screen.findByText(/Delete/));
    expect(await axios.post).toHaveBeenCalledTimes(1);
    expect(await axios.post).toHaveBeenCalledWith('/notification/1234/delete');
    expect(await screen.findByText(/No new notifications/)).toBeInTheDocument();
  });
});
