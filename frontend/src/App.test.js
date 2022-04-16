import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import * as auth from 'firebase/auth';

import FirebaseAuthProvider, {
  AuthContext,
} from './components/Authentication/FirebaseAuth/FirebaseAuth';
import App from './App';

jest.mock('firebase/auth');
jest.mock('axios');

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

  expect(screen.getAllByText(/CoviCare/).length).toBeGreaterThanOrEqual(1);
});

describe('FirebaseAuth test', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [],
    });
    axios.post.mockResolvedValue({
      data: {
        name: 'John Doe',
      },
    });

    auth.getAuth.mockReturnValue({
      id: 'super-secret-id',
    });
    auth.createUserWithEmailAndPassword.mockReturnValue({
      user: {
        uid: '1234',
        email: 'test@email.com',
      },
    });
  });

  afterEach(() => {
    axios.get.mockReset();
  });

  it('should login with email & password', async () => {
    render(
      <BrowserRouter>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jdoe@email.com');
    userEvent.type(screen.getByTestId('password-input'), '123456');

    userEvent.click(await screen.findByText(/Submit/));
    await expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'super-secret-id',
      }),
      'jdoe@email.com',
      '123456',
    );
    await expect(auth.onAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it('should throw error on bad sign in', async () => {
    auth.signInWithEmailAndPassword.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/user-not-found';
      throw error;
    });
    render(
      <BrowserRouter>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jdoe@email.com');
    userEvent.type(screen.getByTestId('password-input'), '123456');

    userEvent.click(await screen.findByText(/Submit/));
    await expect(auth.signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
    await expect(axios.get).not.toHaveBeenCalled();
    await expect(await screen.findByText(/User not found, sign up?/)).toBeInTheDocument();
  });

  it('should be able to sign in', async () => {
    render(
      <BrowserRouter>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </BrowserRouter>,
    );

    userEvent.click(await screen.findByText(/Sign Up!/));

    userEvent.selectOptions(await screen.findByTestId('user-change-input'), ['Patient']);
    userEvent.type(await screen.findByTestId('id-card-input'), 'patient-id');
    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));

    await expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'super-secret-id',
      }),
      'john@gmail.com',
      '!Q@W3e4r',
    );
    expect(axios.post).toBeCalledWith(
      'user/addNewUser',
      expect.objectContaining({
        userType: 'patient',
        userId: '1234',
        verification: expect.objectContaining({
          insurance: 'patient-id',
        }),
      }),
    );

    expect(await screen.findByText(/Welcome test@email.com/)).toBeInTheDocument();
  });

  it('should throw an error when bad sign up', async () => {
    axios.post.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/user-not-found';
      throw error;
    });

    render(
      <BrowserRouter>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </BrowserRouter>,
    );

    userEvent.click(await screen.findByText(/Sign Up!/));

    userEvent.selectOptions(await screen.findByTestId('user-change-input'), ['Patient']);
    userEvent.type(await screen.findByTestId('id-card-input'), 'patient-id');
    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));

    await expect(auth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'super-secret-id',
      }),
      'john@gmail.com',
      '!Q@W3e4r',
    );
    expect(axios.post).toBeCalledWith(
      'user/addNewUser',
      expect.objectContaining({
        userType: 'patient',
        userId: '1234',
        verification: expect.objectContaining({
          insurance: 'patient-id',
        }),
      }),
    );

    expect(await screen.findByText(/Create your CoviCare Account/)).toBeInTheDocument();
  });

  it('should be able to logout', async () => {
    render(
      <BrowserRouter>
        <FirebaseAuthProvider>
          <App />
        </FirebaseAuthProvider>
      </BrowserRouter>,
    );

    // userEvent.click(await screen.findByText(/Sign Up!/));

    userEvent.selectOptions(await screen.findByTestId('user-change-input'), ['Patient']);
    userEvent.type(await screen.findByTestId('id-card-input'), 'patient-id');
    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));

    expect(await screen.findByText(/Log out/)).toBeInTheDocument();
    userEvent.click(await screen.findByText(/Log out/));
    expect(auth.signOut).toHaveBeenCalled();
  });
});
