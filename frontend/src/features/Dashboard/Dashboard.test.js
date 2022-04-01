import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Dashboard from './Dashboard';
import {AuthContext} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import {BrowserRouter} from 'react-router-dom';

describe('visual test of Dashboard component', () => {
  it('should render and load without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
              dbData: {
                userType: 'healthOfficial',
              },
            },
          }}
        >
          <Dashboard
            defaultActiveKey='home'
            tabsList={[
              {
                eventKey: 'home',
                title: 'Home',
                element: <div>Hello</div>,
              },
            ]}
          />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });
});
