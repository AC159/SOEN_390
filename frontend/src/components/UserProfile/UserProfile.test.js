import {render, screen} from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import UserProfile from './UserProfile';
import {BrowserRouter} from 'react-router-dom';

jest.mock('axios');

describe('visual test of UserProfile component', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '1234',
        email: 'jdoe@email.com',
      },
      dbData: {
        phoneNumber: '1234567890',
        address: '1234 Stree',
        userType: 'Doctor',
        userStatus: 'Positive',
        name: 'John Doe',
      },
    },
  };

  it('should load and display without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
  });

  it('should open modal on change phone number click', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Change Phone Number/));
    expect(screen.getByText(/Enter new phone number :/)).toBeInTheDocument();
  });

  it('should submit phone form on phone form save change click', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Change Phone Number/));
    userEvent.click(screen.getByText(/Save Changes/));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0]).toEqual(expect.arrayContaining(['/user/update-profile/1234']));
  });

  it('should open modal on change address click', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Change Address/));
    expect(screen.getByText(/Enter new address:/)).toBeInTheDocument();
  });

  it('should submit address form on address form save change click', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <UserProfile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Change Address/));
    userEvent.click(screen.getByText(/Save Changes/));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0]).toEqual(expect.arrayContaining(['/user/update-profile/1234']));
  });
});
