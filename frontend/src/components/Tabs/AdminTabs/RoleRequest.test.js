import React from 'react';
import {render, screen} from '@testing-library/react';
import axios from 'axios';

import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import RoleRequest from './RoleRequest';

jest.mock('axios');

describe('visual test of RoleRequest Component', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
      },
    },
  };

  it('should load and display without error', async () => {
    axios.get.mockResolvedValue({
      data: {
        users: [],
        doctors: [],
        healthOfficials: [],
        immigrationOfficials: [],
      },
    });

    render(
      <AuthContext.Provider value={auth}>
        <RoleRequest />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/Role Requests/)).toBeInTheDocument();
    expect(await screen.findByText(/Patient Requests/)).toBeInTheDocument();
    expect(await screen.findByText(/Doctor Requests/)).toBeInTheDocument();
    expect(await screen.findByText(/Admin Requests/)).toBeInTheDocument();
    expect(await screen.findByText(/Health Official Requests/)).toBeInTheDocument();
    expect(await screen.findByText(/Immigration Official Requests/)).toBeInTheDocument();
  });

  it('should log an error when axios throw', () => {
    axios.get.mockRejectedValue(new Error('This is not working'));
    render(
      <AuthContext.Provider value={auth}>
        <RoleRequest />
      </AuthContext.Provider>,
    );
  });

  it('should render a role request box', async () => {
    axios.get.mockResolvedValue({
      data: {
        users: [
          {
            uid: '1234',
            name: 'John Doe',
            userType: 'Doctor',
            email: 'jdoe@email.com',
          },
        ],
        doctors: [],
        healthOfficials: [],
        immigrationOfficials: [],
      },
    });

    render(
      <AuthContext.Provider value={auth}>
        <RoleRequest />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/John Doe wants to join as a Doctor/)).toBeInTheDocument();
  });
});
