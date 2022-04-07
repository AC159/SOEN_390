import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

import ContactTrace from './ContactTrace';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import useFetch from '../../../hook/useFetch';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
jest.mock('../../../hook/useFetch');

const patientTracing = [
  {
    date: '2022-03-04',
    emailList: ['melissa.2@hotmail.com', 'jan1910@hotmail.com'],
    locationDescription: 'concordia',
    timestamp: 1647368342832,
  },
];

describe('visual test of the component', () => {
  it('should display default covid status null', async () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'john@email.com',
            },
          }}
        >
          <ContactTrace />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.queryByText(/Created on /)).toBeNull();
  });

  it('should display patient tracing', async () => {
    useFetch.mockReturnValue([patientTracing, jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'john@email.com',
            },
          }}
        >
          <ContactTrace />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Created on /)).toBeInTheDocument();
  });

  it('should not display open modal', () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'john@email.com',
            },
          }}
        >
          <ContactTrace />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.queryByText('The date you came in contact with them')).toBeNull();
    expect(screen.queryByText('Enter the location info')).toBeNull();
    expect(screen.queryByText("Enter all the people's email")).toBeNull();
  });

  it('should display modal on new contact tracing button click', () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'john@email.com',
            },
          }}
        >
          <ContactTrace />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/New Contact Tracing from/));
    expect(screen.getByText('The date you came in contact with them')).toBeInTheDocument();
    expect(screen.getByText('Enter the location info')).toBeInTheDocument();
    expect(screen.getByText("Enter all the people's email")).toBeInTheDocument();
  });

  it('should submit contact tracing on submit button click', () => {
    const mockFetchPatient = jest.fn();
    useFetch.mockReturnValue([[], mockFetchPatient]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'john@email.com',
            },
          }}
        >
          <ContactTrace />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/New Contact Tracing from/));
    userEvent.click(screen.getByText(/^Submit$/));
    expect(mockFetchPatient).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
