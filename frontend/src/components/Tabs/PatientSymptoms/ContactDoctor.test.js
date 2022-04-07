import React from 'react';
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';
import MockedSocket from 'socket.io-mock';
import socketIOClient from 'socket.io-client';

import ContactDoctor from './ContactDoctor.js';

jest.mock('axios');
jest.mock('socket.io-client');

describe('visual test of Contact Doctor component', () => {
  const patientMessage = {
    chatId: 1,
    message: 'test message 1 from patient',
    senderId: 'p1',
    receiverId: 'd1',
    priority: false,
  };
  const doctorMessage = {
    chatId: 2,
    message: 'test message 1 from doctor',
    senderId: 'd1',
    receiverId: 'p1',
    priority: false,
  };

  const user = {
    user: {
      uid: '1234',
    },
    dbData: {
      userType: 'doctor',
      patientInfo: {
        doctorId: '1234',
      },
    },
  };

  beforeEach(() => {
    axios.get.mockReturnValue({data: []});
    const socket = new MockedSocket();
    socket.close = jest.fn();
    socketIOClient.mockReturnValue(socket);
  });

  it('should load and display', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: user,
        }}
      >
        <ContactDoctor />
      </AuthContext.Provider>,
    );
  });

  it('should display loading text and animation', async () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: user,
        }}
      >
        <ContactDoctor />
      </AuthContext.Provider>,
    );
    expect(screen.getByText(/any message/)).toBeInTheDocument();
  });
});
