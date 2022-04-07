import {render, screen} from '@testing-library/react';
import {BrowserRouter, Router} from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import Navbar from './Navbar';
import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';

describe('visual test of the component', () => {
  it('should display default null welcome message', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              // user: 'john@email.com',
            },
            logout: () => {},
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/^Welcome/)).toHaveTextContent('Welcome');
  });

  it('should display welcome message with email', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {email: 'john@email.com'},
            },
            logout: () => {},
          }}
        >
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/^Welcome/)).toHaveTextContent('Welcome john@email.com');
  });

  it('should display value from AuthContext', () => {
    const providerProps = {
      currentUser: {
        user: {email: 'john@email.com'},
      },
      logout: () => {},
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={providerProps}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
    expect(screen.getByText(/^Welcome/)).toHaveTextContent('Welcome john@email.com');
  });

  it('should logout when logout button is clicked and redirect to main page', () => {
    const mockLogout = jest.fn();
    const providerProps = {
      currentUser: {
        user: {email: 'john@email.com'},
      },
      logout: mockLogout,
    };
    render(
      <BrowserRouter>
        <AuthContext.Provider value={providerProps}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Log out/));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should output error when error login out', () => {
    const mockLogout = jest.fn().mockImplementation(() => {
      throw new Error('error');
    });
    const providerProps = {
      currentUser: {
        user: {email: 'john@email.com'},
      },
      logout: mockLogout,
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={providerProps}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Log out/));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should navigate to user profile on user profile click', () => {
    const providerProps = {
      currentUser: {
        user: {email: 'john@email.com'},
      },
      logout: () => {},
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={providerProps}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByAltText('User icon'));
    expect(window.location.pathname).toBe('/user-profile');
  });
});
