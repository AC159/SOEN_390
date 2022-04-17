import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PatientModal from './PatientModal';

import useFetch from '../../hook/useFetch';
import useInputField from '../../hook/useInputField';

jest.mock('axios');
jest.mock('../../hook/useFetch');
jest.mock('../../hook/useInputField');

describe('visual test of Patient Modal component', () => {
  const patient = {
    uid: '1234',
    name: 'John Doe',
    covidStatus: 'Positive',
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
    useInputField.mockRestore();
  });

  it('should load and display', () => {
    useFetch.mockReturnValue([[], () => jest.fn()]);
    useInputField.mockReturnValue([
      [],
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
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
    useInputField.mockReturnValue([
      [],
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
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
    let mockQuestion = ['', '', ''];
    const mockSetQuestion = jest
      .fn()
      .mockName('mockQuestions')
      .mockImplementation(() => {
        console.log('OBJECTION');
        mockQuestion = [];
        console.log(mockQuestion);
      });
    useFetch.mockReturnValue([[], jest.fn()]);
    useInputField.mockImplementation(() => [
      mockQuestion,
      mockSetQuestion,
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
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
    userEvent.click(await screen.findByTestId('doctor-question-button'));

    expect(await mockSetQuestion).toHaveBeenCalledTimes(1);
  });

  it('should be able to flag patient and see patient info has a doctor', () => {
    useFetch
      .mockReturnValue([[], () => {}])
      .mockReturnValueOnce([[], () => jest.fn()])
      .mockReturnValueOnce([
        [{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}],
        () => jest.fn(),
      ]);
    useInputField.mockReturnValue([
      [],
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
    render(
      <PatientModal
        patient={patient}
        currentUser={currentUser}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(screen.getByText(/Flag Patient/));
    expect(screen.getByText(/Patient has been flagged/)).toBeDefined();
    expect(screen.getByText(/Positive/)).toBeDefined();
  });

  it('should be able to flag patient has an immigration official', () => {
    const user = {
      ...currentUser,
      dbData: {
        userType: 'immigrationOfficial',
      },
    };
    useFetch
      .mockReturnValue([[], () => {}])
      .mockReturnValueOnce([[], () => jest.fn()])
      .mockReturnValueOnce([
        [{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}],
        () => jest.fn(),
      ]);
    useInputField.mockReturnValue([
      [],
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
    render(
      <PatientModal
        patient={patient}
        currentUser={user}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(screen.getByText(/Flag Patient/));
    expect(screen.getByText(/Patient has been flagged/)).toBeDefined();
    expect(screen.getByText(/Positive/)).toBeDefined();
  });

  it('should be able to flag patient has an health official', () => {
    const user = {
      ...currentUser,
      dbData: {
        userType: 'healthOfficial',
      },
    };
    useFetch
      .mockReturnValue([[], () => {}])
      .mockReturnValueOnce([[], () => jest.fn()])
      .mockReturnValueOnce([
        [{_id: '1234', covidStatus: 'Positive', timestamp: 12345678}],
        () => jest.fn(),
      ]);

    useInputField.mockReturnValue([
      [],
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
      () => jest.fn(),
    ]);
    render(
      <PatientModal
        patient={patient}
        currentUser={user}
        showPatientInfo={() => {}}
        handlePatientInfoClose={() => {}}
        openDoctorList={() => {}}
      />,
    );

    expect(screen.queryByText(/Patient has been flagged/)).toBeNull();
    userEvent.click(screen.getByText(/Flag Patient/));
    expect(screen.getByText(/Patient has been flagged/)).toBeDefined();
    expect(screen.getByText(/Positive/)).toBeInTheDocument();
  });
});
