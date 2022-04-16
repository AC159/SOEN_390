import React, {useContext} from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import * as auth from 'firebase/auth';

import {AuthContext} from '../FirebaseAuth/FirebaseAuth';
import FirebaseAuthProvider from './FirebaseAuth';

jest.mock('axios');
jest.mock('firebase/auth');

describe('FirebaseAuthProvider test', () => {
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
      },
    });
  });

  afterEach(() => {
    axios.get.mockReset();
  });

  it('should load and display without error', () => {
    render(
      <FirebaseAuthProvider>
        <p>hello</p>
      </FirebaseAuthProvider>,
    );

    expect(screen.getByText(/hello/)).toBeInTheDocument();
  });
});
