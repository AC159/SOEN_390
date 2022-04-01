import React from 'react';
import {render, screen} from '@testing-library/react';
import axios from 'axios';

import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import AdminDoctorList from './AdminDoctorList';

jest.mock('axios');

describe('visual test of AdminDoctorList component', () => {
  it('should load and display without error', async () => {
    axios.get.mockReturnValueOnce({
      data: {
        data: [
          {
            name: 'John Doe',
            patientCount: 123,
          },
        ],
      },
    });
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: 'doctor1_covicare@gmail.com',
            uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
            userType: 'doctor',
          },
        }}
      >
        <AdminDoctorList />
      </AuthContext.Provider>,
    );

    expect(await screen.findByText(/Dr. John Doe/)).toBeInTheDocument();
    expect(await screen.findByText(/patients:/)).toBeInTheDocument();
    expect(await screen.findByText(/123/)).toBeInTheDocument();
  });
});
