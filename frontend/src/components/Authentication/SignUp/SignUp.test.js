import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {AuthContext} from '../FirebaseAuth/FirebaseAuth';
import SignUp from './SignUp';
import {BrowserRouter} from 'react-router-dom';

describe('visual test of SignUp component', () => {
  const mockRegister = jest.fn();
  const auth = {
    register: mockRegister,
  };

  afterEach(() => {
    mockRegister.mockRestore();
  });

  it('should load and display without error', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Create your CoviCare Account/)).toBeInTheDocument();
  });

  it('should check if email input is correct', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'john');
    expect(await screen.findByTestId('email-input')).toHaveValue('john');
    await userEvent.type(screen.getByTestId('email-input'), '@gmail.com');
    expect(await screen.findByTestId('email-input')).toHaveValue('john@gmail.com');
    expect(screen.queryByText(/Invalid email/)).toBeNull();
  });

  it('should display a message if email input is incorrect', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('email-input'), 'john##@.com');
    expect(await screen.findByTestId('email-input')).toHaveValue('john##@.com');
    expect(await screen.findByText(/Invalid email/)).toBeInTheDocument();
  });

  it('should check if password input is correct', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    expect(await screen.findByTestId('password-input')).toHaveValue('!Q@W3e4r');
    expect(screen.queryByText(/The password must contain/)).toBeNull();
  });

  it('should display a message if password input is incorrect', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('password-input'), 'abc def');
    expect(await screen.findByTestId('password-input')).toHaveValue('abc def');
    expect(await screen.findByText(/The password must contain/)).toBeInTheDocument();
  });

  it('should check if password confirmation input is matching password input', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    expect(await screen.findByTestId('password-input')).toHaveValue('!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    expect(await screen.findByTestId('password-conf-input')).toHaveValue('!Q@W3e4r');
    expect(screen.queryByText(/Passwords do not match!/)).toBeNull();
  });

  it('should display a message if password conf input does not match password input', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r567');
    expect(await screen.findByTestId('password-input')).toHaveValue('!Q@W3e4r567');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    expect(await screen.findByTestId('password-conf-input')).toHaveValue('!Q@W3e4r');
    expect(await screen.findByText(/Passwords do not match!/)).toBeInTheDocument();
  });

  it('should save the basic input in the state', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.type(screen.getByTestId('first-name-input'), 'John');
    expect(await screen.findByTestId('first-name-input')).toHaveValue('John');
    userEvent.type(screen.getByTestId('last-name-input'), 'Doe');
    expect(await screen.findByTestId('last-name-input')).toHaveValue('Doe');
    userEvent.type(screen.getByTestId('phone-input'), '1234567890');
    expect(await screen.findByTestId('phone-input')).toHaveValue('1234567890');
    userEvent.type(screen.getByTestId('address-input'), '1234 Street');
    expect(await screen.findByTestId('address-input')).toHaveValue('1234 Street');
  });

  it('should save the change of user type in the state', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Patient']);
    expect(await screen.findByTestId('user-change-input')).toHaveValue('patient');
  });

  it('should restrict the number of character to 12 for a patient id card', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Patient']);
    expect(await screen.findByTestId('user-change-input')).toHaveValue('patient');

    expect((await screen.findByTestId('id-card-input')).placeholder).toBe(
      'Health Insurance Number',
    );
    userEvent.type(await screen.findByTestId('id-card-input'), 'aaabbbcccdddeee');
    expect(await screen.findByTestId('id-card-input')).toHaveValue('aaabbbcccddd');
    expect((await screen.findByTestId('id-card-input')).maxLength).toBe(12);
  });

  it('should restrict the number of character to 6 for a doctor id card', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Doctor']);
    expect(await screen.findByTestId('user-change-input')).toHaveValue('doctor');

    expect((await screen.findByTestId('id-card-input')).placeholder).toBe(
      "Doctor's License Number",
    );
    userEvent.type(await screen.findByTestId('id-card-input'), 'aaabbbcccdddeee');
    expect(await screen.findByTestId('id-card-input')).toHaveValue('aaabbb');
    expect((await screen.findByTestId('id-card-input')).maxLength).toBe(6);
  });

  it('should not restrict the number of character for other user', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Health Officer']);
    expect(await screen.findByTestId('user-change-input')).toHaveValue('healthOfficial');
    expect((await screen.findByTestId('id-card-input')).placeholder).toBe(
      "Health official's License Number",
    );
    expect((await screen.findByTestId('id-card-input')).maxLength).toBe(200);
  });

  it('should submit the correct information for the patient', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Patient']);
    userEvent.type(await screen.findByTestId('id-card-input'), 'patient-id');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).not.toHaveBeenCalled();

    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toBeCalledWith(
      'john@gmail.com',
      '!Q@W3e4r',
      expect.objectContaining({
        userType: 'patient',
        verification: expect.objectContaining({
          insurance: 'patient-id',
        }),
      }),
    );
  });

  it('should submit the correct information for the doctor', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Doctor']);
    userEvent.type(await screen.findByTestId('id-card-input'), '123456');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).not.toHaveBeenCalled();

    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toBeCalledWith(
      'john@gmail.com',
      '!Q@W3e4r',
      expect.objectContaining({
        userType: 'doctor',
        verification: expect.objectContaining({
          doctorLicense: '123456',
        }),
      }),
    );
  });

  it('should submit the correct information for the administrator', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Administrator']);
    expect((await screen.findByTestId('id-card-input')).placeholder).toBe(
      "Administrator's Id Number",
    );
    userEvent.type(await screen.findByTestId('id-card-input'), 'admin-id');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).not.toHaveBeenCalled();

    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toBeCalledWith(
      'john@gmail.com',
      '!Q@W3e4r',
      expect.objectContaining({
        userType: 'administrator',
        verification: expect.objectContaining({
          administratorId: 'admin-id',
        }),
      }),
    );
  });

  it('should submit the correct information for the health official', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Health Officer']);
    userEvent.type(await screen.findByTestId('id-card-input'), 'health-official-id');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).not.toHaveBeenCalled();

    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toBeCalledWith(
      'john@gmail.com',
      '!Q@W3e4r',
      expect.objectContaining({
        userType: 'healthOfficial',
        verification: expect.objectContaining({
          healthLicense: 'health-official-id',
        }),
      }),
    );
  });

  it('should submit the correct information for the immigration officer', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <SignUp />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.selectOptions(screen.getByTestId('user-change-input'), ['Immigration Officer']);
    expect((await screen.findByTestId('id-card-input')).placeholder).toBe(
      "Immigration official's Id Number",
    );
    userEvent.type(await screen.findByTestId('id-card-input'), 'immigration-id');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).not.toHaveBeenCalled();

    userEvent.type(screen.getByTestId('email-input'), 'john@gmail.com');
    userEvent.type(screen.getByTestId('password-input'), '!Q@W3e4r');
    userEvent.type(await screen.findByTestId('password-conf-input'), '!Q@W3e4r');
    userEvent.click(await screen.findByText(/^Submit$/));
    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toBeCalledWith(
      'john@gmail.com',
      '!Q@W3e4r',
      expect.objectContaining({
        userType: 'immigrationOfficial',
        verification: expect.objectContaining({
          immigrationId: 'immigration-id',
        }),
      }),
    );
  });
});
