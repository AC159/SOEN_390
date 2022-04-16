import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import PatientModal from './PatientModal';
import useFetch from '../../hook/useFetch';

jest.mock('axios');
jest.mock('../../hook/useFetch');
// jest.mock('../../hook/useInputField');

describe('visual test of Patient Modal component', () => {
  const patient = {
    uid: '1234',
    name: 'John Doe',
    status: 'Positive',
  };
  const currentUser = {
    user: {
      uid: '1234',
    },
    dbData: {
      userType: 'doctor',
    },
  };

  beforeEach(() => {
    useFetch.mockRestore();
  });

  it('should load and display', () => {
    useFetch.mockReturnValue([[], () => jest.fn()]);
    render(
      <PatientModal
        patient={patient}
        currentUser={currentUser}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    expect(screen.getByText(/COVID Status: /)).toHaveTextContent('COVID Status: Positive');
    expect(screen.getByText(/lag/)).toBeDefined();
    expect(screen.getByText(/'s submitted forms/)).toHaveTextContent("John Doe's submitted forms");
    userEvent.click(screen.getByText(/Create Patient/));
    expect(screen.getByText(/Choose form/)).toBeDefined();
  });

  it('should fetch patient info and patient CT Data on load', () => {
    const mockFetchCTData = jest.fn();
    const mockFetchPatientInfo = jest.fn();

    useFetch
      .mockReturnValue([[], jest.fn()])
      .mockReturnValueOnce([[], mockFetchCTData])
      .mockReturnValueOnce([[], mockFetchPatientInfo]);

    render(
      <PatientModal
        patient={patient}
        currentUser={currentUser}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    expect(mockFetchPatientInfo).toHaveBeenCalledTimes(1);
    expect(mockFetchCTData).toHaveBeenCalledTimes(1);
  });

  it('should fire submit doctor questions', async () => {
    useFetch.mockReturnValue([[], jest.fn()]);
    render(
      <PatientModal
        patient={patient}
        currentUser={currentUser}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    userEvent.click(screen.getByText(/Create Patient/));
    userEvent.type(await screen.findByTestId('question-input'), 'Question 1');
    expect(await screen.findByTestId('question-input')).toHaveValue('Question 1');
    userEvent.click(await screen.findByText(/Add Question/))
    userEvent.type((await screen.findAllByTestId('question-input'))[1], 'Question 2');
    expect((await screen.findAllByTestId('question-input'))[1]).toHaveValue('Question 2');
    userEvent.click((await screen.findAllByTestId('question-delete-button'))[0]);
    userEvent.click(await screen.findByTestId('doctor-question-button'));

    await expect(axios.post).toHaveBeenCalledWith('/doctor/question-answer', 
      expect.objectContaining({
        doctorUid: '1234',
        doctorQuestions: expect.arrayContaining([
          expect.objectContaining({"answer": "", "question": "Question 2"})
        ]),
      })  
    );
    await expect(axios.post).toHaveBeenCalledWith('/doctor/question-answer', 
      expect.objectContaining({
        doctorUid: '1234',
        doctorQuestions: expect.not.arrayContaining([
          expect.objectContaining({"answer": "", "question": "Question 1"})
        ]),
      })  
    );
  });

  it('should be able to flag patient and see patient info has a doctor', async () => {
    const mockFetchPatient = jest.fn();
    useFetch.mockImplementation((_, url) => {
      if (url === `/patient/get-status-forms/${patient.uid}`)
        return [[{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}], mockFetchPatient];
      else return [[], () => jest.fn()];
    });

    render(
      <PatientModal
        patient={patient}
        currentUser={currentUser}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    await expect(mockFetchPatient).toHaveBeenCalledWith(patient.uid);
    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(await screen.findByText(/Flag Patient/));
    expect(await screen.findByText(/Patient has been flagged/)).toBeInTheDocument();
    expect(await screen.findByText(/Unflag Patient/)).toBeInTheDocument();
  });

  it('should be able to flag patient has an immigration official', async () => {
    const user = {
      ...currentUser,
      dbData: {
        userType: 'immigrationOfficial',
      },
    };
    const mockFetchPatient = jest.fn();
    useFetch.mockImplementation((_, url) => {
      if (url === `/patient/get-status-forms/${patient.uid}`)
        return [[{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}], mockFetchPatient];
      else return [[], () => jest.fn()];
    });

    render(
      <PatientModal
        patient={patient}
        currentUser={user}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    await expect(mockFetchPatient).toHaveBeenCalledWith(patient.uid);
    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(await screen.findByText(/Flag Patient/));
    expect(await screen.findByText(/Patient has been flagged/)).toBeInTheDocument();
    expect(await screen.findByText(/Unflag Patient/)).toBeInTheDocument();
  });

  it('should be able to flag patient has an health official', async () => {
    const user = {
      ...currentUser,
      dbData: {
        userType: 'healthOfficial',
      },
    };
    const mockFetchPatient = jest.fn();
    useFetch.mockImplementation((_, url) => {
      if (url === `/patient/get-status-forms/${patient.uid}`)
        return [[{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}], mockFetchPatient];
      else return [[], () => jest.fn()];
    });

    render(
      <PatientModal
        patient={patient}
        currentUser={user}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    await expect(mockFetchPatient).toHaveBeenCalledWith(patient.uid);
    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(await screen.findByText(/Flag Patient/));
    expect(await screen.findByText(/Patient has been flagged/)).toBeInTheDocument();
    expect(await screen.findByText(/Unflag Patient/)).toBeInTheDocument();
  });
});
