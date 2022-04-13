import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import {AuthContext} from './components/Authentication/FirebaseAuth/FirebaseAuth';
import App from './App';

test('it should load and display without error', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
      },
    },
  };

  render(
    <BrowserRouter>
      <AuthContext.Provider value={auth}>
        <App />
      </AuthContext.Provider>
    </BrowserRouter>,
  );

  expect(screen.getByText(/CoviCare/)).toBeInTheDocument();
});
