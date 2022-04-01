import React from 'react';
import {render, screen} from '@testing-library/react';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import PrivateRoute from './PrivateRoute';
import {BrowserRouter} from 'react-router-dom';

describe('visual test of Private route component', () => {
  it('should load and display without error', () => {
    render(
      <AuthContext.Provider
        value={{
          currentUser: {
            user: {
              uid: '12345',
            },
          },
        }}
      >
        <BrowserRouter>
          <PrivateRoute requestedRoute='/admin'>
            <div>Hello</div>
          </PrivateRoute>
        </BrowserRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });
});
