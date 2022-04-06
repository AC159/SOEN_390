import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import Appointment from './Appointment';
import useFetch from '../../../hook/useFetch';

jest.mock('axios');
jest.mock('../../../hook/useFetch');
window.alert = jest.fn();
window.scrollTo = jest.fn();

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

  it('should be able to submit an appointment', async () => {
    useFetch.mockReturnValue([
      [
        {
          name: 'John Doe',
          uid: '1234',
        },
      ],
      jest.fn(),
    ]);
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

    userEvent.selectOptions(screen.getByTestId('select-patient'), ['John Doe']);
    expect(await screen.findByTestId('select-patient')).toHaveValue('1234|John Doe');
    userEvent.type(await screen.findByTestId('title-input'), 'Checkup');
    expect(await screen.findByTestId('title-input')).toHaveValue('Checkup');
    userEvent.type(await screen.findByTestId('meeting-detail-input'), 'Annual Checkup');
    expect(await screen.findByTestId('meeting-detail-input')).toHaveValue('Annual Checkup');
    userEvent.click(screen.getByLabelText(/Choose Sunday, April 24th, 2022/));
    userEvent.type(await screen.findByTestId('meeting-link-input'), 'meeting.com/1234');
    expect(await screen.findByTestId('meeting-link-input')).toHaveValue('meeting.com/1234');

    await userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenCalledWith('Created');
    expect(await axios.post).toHaveBeenCalledTimes(1);
    expect(await axios.post).toHaveBeenCalledWith(
      'doctor/zXX7Yt2lNSa6BhaLFnbosq4IdS22/appointment',
      expect.objectContaining({
        doctorId: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
        patientId: '1234',
        patientName: 'John Doe',
        title: 'Checkup',
        information: 'Annual Checkup',
        meetingLink: 'meeting.com/1234',
      }),
    );

    expect(await screen.findByTestId('title-input')).toHaveValue('');
    expect(await screen.findByTestId('meeting-detail-input')).toHaveValue('');
    expect(await screen.findByTestId('meeting-link-input')).toHaveValue('');
  });

  it('should alert the user when information is missing', async () => {
    useFetch.mockReturnValue([
      [
        {
          name: 'John Doe',
          uid: '1234',
        },
      ],
      jest.fn(),
    ]);
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

    userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenLastCalledWith('Patient is required');
    userEvent.selectOptions(screen.getByTestId('select-patient'), ['John Doe']);
    userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenLastCalledWith('Meeting Title is required');
    userEvent.type(await screen.findByTestId('title-input'), 'Checkup');
    userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenLastCalledWith('Meeting Details is required');
    userEvent.type(await screen.findByTestId('meeting-detail-input'), 'Annual Checkup');
    userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenLastCalledWith('Date & Time is required');
    userEvent.click(screen.getByLabelText(/Choose Sunday, April 24th, 2022/));
    userEvent.click(await screen.findByText(/Book Appointment/));
    expect(await window.alert).toHaveBeenLastCalledWith('Meeting Link is required');
    expect(await window.alert).toHaveBeenCalledTimes(5);
  });
});
