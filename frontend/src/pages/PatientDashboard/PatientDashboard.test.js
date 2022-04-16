import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import PatientDashboard from './PatientDashboard';

jest.mock('axios');

describe('test PatientDashboard page', () => {
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
          <PatientDashboard />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Today's News/)).toBeInTheDocument();
  });

  // it('should be able to change tab', async () => {
  //   axios.get.mockResolvedValue({
  //     data: {
  //       users: [],
  //       doctors: [],
  //       healthOfficials: [],
  //       immigrationOfficials: [],
  //       data: [],
  //     },
  //   });
  //   render(
  //     <BrowserRouter>
  //       <AuthContext.Provider value={auth}>
  //         <PatientDashboard />
  //       </AuthContext.Provider>
  //     </BrowserRouter>,
  //   );

  //   expect(screen.getByText(/Today's News/)).toBeInTheDocument();
  //   userEvent.click(await screen.findByText(/^Account Request$/));
  //   expect(await screen.findByText(/^Role Requests$/)).toBeInTheDocument();
  //   expect(await screen.findByText(/^Patient Requests$/)).toBeInTheDocument();
  //   userEvent.click(await screen.findByText(/^Patient List$/));
  //   expect(await screen.findByPlaceholderText('Search patient by name...')).toBeInTheDocument();
  //   userEvent.click(await screen.findByText(/^Doctor List$/));
  //   expect(await screen.findByPlaceholderText('Search doctor by name...')).toBeInTheDocument();
  //   userEvent.click(await screen.findByText(/^Contact$/));
  //   expect(await screen.findByText('Contacts')).toBeInTheDocument();
  // });
});
