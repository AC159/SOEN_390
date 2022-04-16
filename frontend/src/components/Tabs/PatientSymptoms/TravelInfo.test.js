import React from 'react';
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MockedSocket from 'socket.io-mock';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import TravelInfo from './TravelInfo';

jest.mock('axios');

describe('test TravelInfo component', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
      },
    },
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [],
    });
    axios.post.mockResolvedValue({
      success: 'true',
    });
  });

  afterEach(() => {
    axios.get.mockReset();
  });

  it('should load and display without error', async () => {
    render(
      <AuthContext.Provider value={auth}>
        <TravelInfo />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/New Travel Form/)).toBeInTheDocument();
    expect(screen.queryByText(/Travel Report/)).toBeNull();
    await expect(axios.get).toHaveBeenCalledTimes(1);
    await expect(axios.get).toHaveBeenCalledWith(
      `/patient/get-traveler-form/${auth.currentUser.user.uid}`,
    );
  });

  it('should load and display travel report', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          timeStamp: 123456789,
          date: [
            {
              startDate: '1111-11-11',
              endDate: '2222-22-22',
            },
          ],
          patientUid: '4321',
          locationDescription: 'Canada',
          travelPurpose: 'pleasure',
        },
      ],
    });

    render(
      <AuthContext.Provider value={auth}>
        <TravelInfo />
      </AuthContext.Provider>,
    );

    await expect(axios.get).toHaveBeenCalledTimes(1);
    expect(await screen.findByText(/Travel Report for 1111-11-11/)).toBeInTheDocument();
    expect(await screen.findByText(/Report created on:/)).toBeInTheDocument();
    expect(await screen.findByText(/Location Description/)).toBeInTheDocument();
    expect(await screen.findByText(/Purpose of Travel/)).toBeInTheDocument();
  });

  it('should be able to submit a travel form', async () => {
    render(
      <AuthContext.Provider value={auth}>
        <TravelInfo />
      </AuthContext.Provider>,
    );

    userEvent.click(await screen.findByText(/New Travel Form/));
    expect(await screen.findByText(/Enter the start/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/^Submit$/));
    await expect(axios.post).toHaveBeenCalledTimes(1);
    await expect(axios.post).toHaveBeenCalledWith(
      '/patient/submit-traveler-form',
      expect.objectContaining({
        patientUid: auth.currentUser.user.uid,
        locationDescription: '',
        travelPurpose: '',
      }),
    );
  });

  it('should be able to fill a travel form and submit the information', async () => {
    render(
      <AuthContext.Provider value={auth}>
        <TravelInfo />
      </AuthContext.Provider>,
    );

    userEvent.click(await screen.findByText(/New Travel Form/));

    userEvent.type(await screen.findByTestId('location-input'), 'Canada');
    userEvent.type(await screen.findByTestId('purpose-input'), 'pleasure');

    userEvent.click(await screen.findByText(/^Submit$/));
    await expect(axios.post).toHaveBeenCalledWith(
      '/patient/submit-traveler-form',
      expect.objectContaining({
        patientUid: auth.currentUser.user.uid,
        locationDescription: 'Canada',
        travelPurpose: 'pleasure',
      }),
    );
  });
});
