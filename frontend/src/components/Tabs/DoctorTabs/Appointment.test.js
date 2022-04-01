import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import Appointment from './Appointment';
import useFetch from '../../../hook/useFetch';

jest.mock('axios');
jest.mock('../../../hook/useFetch');

describe('visual test of the component', () => {
  it('should render book appointment tab without crashing', () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'doctor1_covicare@gmail.com',
              uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
              userType: 'doctor',
            },
          }}
        >
          <Appointment />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
    const appointmentElement = screen.getByTestId('appointment-1');
    expect(appointmentElement).toBeInTheDocument();
  });

  it('renders book appointment button correctly', () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'doctor1_covicare@gmail.com',
              uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
              userType: 'doctor',
            },
          }}
        >
          <Appointment />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
    const appointmentBtnElement = screen.getByTestId('viewBookAppointmentBtn');
    expect(appointmentBtnElement).toHaveTextContent('Book Appointment');
  });

  it('should render empty list of appointments without crashing', async () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'doctor1_covicare@gmail.com',
              uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
              userType: 'doctor',
            },
          }}
        >
          <Appointment />
        </AuthContext.Provider>
      </BrowserRouter>,
    );
    const listAppointmentElement = screen.getByTestId('appointment-list');
    expect(listAppointmentElement).toBeInTheDocument();
    expect(await screen.findByText(/You have no appointments at this time/)).toBeInTheDocument();
  });

  it('should render list of appointments already booked without crashing', async () => {
    const mockFetchAppointment = jest.fn();
    useFetch.mockReturnValueOnce([[], jest.fn()]).mockReturnValueOnce([
      [
        {
          patientName: 'John Doe',
          title: 'Amazing Appoitment',
          information: 'info',
          dateAndTime: 1234567890,
        },
      ],
      mockFetchAppointment,
    ]);

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: 'doctor1_covicare@gmail.com',
              uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
              userType: 'doctor',
            },
          }}
        >
          <Appointment />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/^Patient:$/)).toBeInTheDocument();
    expect(await screen.findByText(/^Title:$/)).toBeInTheDocument();
    expect(await screen.findByText(/^Info:$/)).toBeInTheDocument();
    expect(await screen.findByText(/^Date and Time:$/)).toBeInTheDocument();
    expect(await screen.findByText(/John Doe/)).toBeInTheDocument();
    expect(await screen.findByText(/Amazing/)).toBeInTheDocument();
  });

  it('should be able to submit an appointment', () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    axios.post.mockResolvedValueOnce({success: true});
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
              },
            },
          }}
        >
          <Appointment />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/Book Appointment/));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post.mock.calls[0]).toEqual(
      expect.arrayContaining(['doctor/zXX7Yt2lNSa6BhaLFnbosq4IdS22/appointment']),
    );
  });
});
