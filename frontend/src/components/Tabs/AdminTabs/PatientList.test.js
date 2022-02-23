import {render, screen} from '@testing-library/react';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event'

import PatientList from "./PatientList.js"
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

import axios from 'axios'
jest.mock('axios');

describe('visual test of the PatientList qcomponent', () => {
  it('should render without crashing', () => {
    render(<BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>)

  })
})

