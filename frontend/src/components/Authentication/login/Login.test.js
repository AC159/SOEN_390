import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import {AuthContext} from '../FirebaseAuth/FirebaseAuth';
import Login from './Login';

const mockUseNavigate = jest.fn();

jest.mock('axios');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

describe('visual test of SignUp component', () => {
  const mockLogin = jest.fn();
  const auth = {
    login: mockLogin,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        userType: 'doctor',
        userStatus: 'PENDING',
      },
    });
    mockLogin.mockReturnValue({
      user: {
        uid: '1234',
      },
    });
  });

  afterEach(() => {
    mockLogin.mockRestore();
  });

  it('should load and display without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Welcome to CoviCare/)).toBeInTheDocument();
  });

  it('should insert the value in the right input and save to state', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    expect(await screen.findByTestId('email-input')).toHaveValue('jd@email.com');

    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    expect(await screen.findByTestId('password-input')).toHaveValue('!Q@W3e4r');
  });

  it('should submit the login form with the right information for a patient', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'patient',
        userStatus: 'APPROVED',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/patient-dashboard');
  });

  it('should submit the login form with the right information for a doctor', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'doctor',
        userStatus: 'APPROVED',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/doctor-dashboard');
  });

  it('should submit the login form with the right information for a administrator', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'administrator',
        userStatus: 'APPROVED',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/admin-dashboard');
  });

  it('should submit the login form with the right information for a Health Official', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'healthOfficial',
        userStatus: 'APPROVED',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/health-official-dashboard');
  });

  it('should submit the login form with the right information for a immigration official', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'immigrationOfficial',
        userStatus: 'APPROVED',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/immigration-officer-dashboard');
  });

  it('should submit the login form and navigate to general dashboard when user not accepted', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        userType: 'patient',
        userStatus: 'PENDING',
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await mockLogin).toHaveBeenCalledTimes(1);
    expect(await mockLogin).toHaveBeenCalledWith('jd@email.com', '!Q@W3e4r');
    expect(await axios.get).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledTimes(1);
    expect(await mockUseNavigate).toHaveBeenCalledWith('/general-dashboard');
  });

  it('should output a message when user not found', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/user-not-found';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/User not found, sign up?/)).toBeInTheDocument();
  });

  it('should output a message when there are too many requests', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/too-many-requests';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/Too many requests, try again later/)).toBeInTheDocument();
  });

  it('should output a message when user is disabled', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/user-disabled';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/User account disabled/)).toBeInTheDocument();
  });

  it('should output a message when email is already used', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/email-already-in-use';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/Email already in use/)).toBeInTheDocument();
  });

  it('should output a message when network request failed', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/network-request-failed';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
  });

  it('should output a message when password is too weak', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/weak-password';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/Weak password/)).toBeInTheDocument();
  });

  it('should output a message when password is wrong', async () => {
    mockLogin.mockImplementationOnce(() => {
      const error = new Error('hello');
      error.code = 'auth/wrong-password';
      throw error;
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'jd@email.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    await userEvent.click(await screen.findByText(/^Submit$/));
    expect(await screen.findByText(/Wrong password/)).toBeInTheDocument();
  });
});
