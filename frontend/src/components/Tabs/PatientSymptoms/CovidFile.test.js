import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

import CovidFile from './CovidFile';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import useFetch from '../../../hook/useFetch';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
jest.mock('../../../hook/useFetch');

const patientData = [
  {
    covidStatus: 'Positive',
    symptoms: ['Headache', 'Sore throat'],
    otherSymptoms: '',
    temp: '38',
    symptomDetails: '',
    timestamp: 1646233975,
  },
];

describe('visual test of the component', () => {
  beforeEach(() => {
    useFetch.mockReturnValue([[], jest.fn()]);
    axios.mockRestore();
  });

  it('should display no patient data and closed modal', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(screen.queryByText('Created on Wednesday, March 2nd 2022, 10:12:55 am')).toBeNull();
    expect(screen.queryByText('Do you have any symptoms:')).toBeNull();
  });

  it('should display patient data', async () => {
    const mockFetchPatient = jest.fn();
    useFetch.mockReturnValueOnce([
      [
        {
          timestamp: 123456789,
          questions: [
            {
              q1: 'answer1',
            },
          ],
        },
      ],
      mockFetchPatient,
    ]);

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText(/Doctor questions/)).toBeInTheDocument();
    expect(await screen.findByText(/^Created on/)).toBeInTheDocument();
    expect(await screen.findByText(/^Update$/)).toBeInTheDocument();
    expect(mockFetchPatient).toHaveBeenCalledTimes(1);
  });

  it('should open modal when clicking on update', async () => {
    const mockFetchPatient = jest.fn();
    patientData[0]['doctorQuestions'] = [{"answer": "", "question": "Question 2"}]
    useFetch.mockReturnValue([patientData, mockFetchPatient]);

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/^Update$/));
    expect(await screen.findByText(/Select all the Symptoms you feel:/)).toBeInTheDocument();
    expect(await screen.findByText(/^Anything to add about your symptoms/)).toBeInTheDocument();
    expect(await screen.findByText(/^Anything to add about your health/)).toBeInTheDocument();
    expect(await screen.findByText(/^Questions from your doctor:/)).toBeInTheDocument();
    expect((await screen.findAllByText(/^Question 2/)).length).toBeGreaterThanOrEqual(1);
  });

  it('should submit patient form on submit click', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/New form/));
    expect(await screen.findByText(/Create a new covid status form/)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('form-button-action'));
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when submit patient form on submit click if axios throw', async () => {
    axios.post.mockRejectedValueOnce(new Error('this is bad'));
    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/New form/));
    expect(await screen.findByText(/Create a new covid status form/)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('form-button-action'));
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should update patient form on update click', async () => {
    const mockFetchPatient = jest.fn();
    useFetch.mockReturnValue([patientData, mockFetchPatient]);
    axios.post.mockResolvedValueOnce({success: true});

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/^Update$/));
    userEvent.click(await screen.findByText(/Unusual fatigue/));
    userEvent.click(await screen.findByText(/Unusual fatigue/));
    expect(await screen.findByText(/^Update a covid status form/)).toBeInTheDocument();

    userEvent.click(screen.getByTestId('form-button-action'));
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it('should be able to remove covid status', async () => {
    const mockFetchPatient = jest.fn();
    useFetch.mockReturnValue([patientData, mockFetchPatient]);
    axios.post.mockResolvedValueOnce({success: true});

    render(
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            currentUser: {
              user: {
                uid: '1234',
              },
            },
          }}
        >
          <CovidFile />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    userEvent.click(screen.getByText(/^Update$/));
    userEvent.selectOptions(await screen.findByTestId('covid-select'), ['None']);
    expect(screen.queryByTestId('temp-input')).toBeNull();
  })
});
