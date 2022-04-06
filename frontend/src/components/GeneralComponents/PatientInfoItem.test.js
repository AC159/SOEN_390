import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {DoctorPatientInfoList, AdnminPatientInfoList, HOPatientInfoList} from './PatientInfoItem';

test('load and display Doctor Accordion item', () => {
  render(
    <DoctorPatientInfoList
      element={{
        _id: 1,
        questions: [{question: 'What is this?', answer: 'Nothing'}],
        other: ['hello'],
        flag: 'yes',
      }}
      index={0}
      setSelectedFormId={() => {}}
      selectedFormId={1}
      isFormSelected
    />,
  );

  expect(screen.getByText(/Doctor questions/)).toBeDefined();
  expect(screen.getByText(/What is this?/)).toBeDefined();
  expect(screen.getByText(/Nothing/)).toBeDefined();
  expect(screen.getByText(/other/)).toBeDefined();
  expect(screen.getByText(/hello/)).toBeDefined();
  expect(screen.getByText(/flag/)).toBeDefined();
  expect(screen.getByText(/yes/)).toBeDefined();
  expect(screen.getByText(/Selected/)).toBeDefined();
});

test('load and display Doctor Accordion item with different id', () => {
  render(
    <DoctorPatientInfoList
      element={{
        _id: 0,
        questions: [{question: 'What is this?', answer: 'Nothing'}],
        other: ['hello'],
        flag: 'yes',
      }}
      index={0}
      setSelectedFormId={() => {}}
      selectedFormId={1}
      isFormSelected
    />,
  );

  expect(screen.getByText(/Doctor questions/)).toBeDefined();
  expect(screen.getByText(/What is this?/)).toBeDefined();
  expect(screen.getByText(/Nothing/)).toBeDefined();
  expect(screen.getByText(/other/)).toBeDefined();
  expect(screen.getByText(/hello/)).toBeDefined();
  expect(screen.getByText(/flag/)).toBeDefined();
  expect(screen.getByText(/yes/)).toBeDefined();
  expect(screen.getByText(/Select this form/)).toBeDefined();
});

test('load and display Doctor Accordion item with unselected form', () => {
  render(
    <DoctorPatientInfoList
      element={{
        _id: 0,
        questions: [{question: 'What is this?', answer: 'Nothing'}],
        other: ['hello'],
        flag: 'yes',
      }}
      index={0}
      setSelectedFormId={() => {}}
      selectedFormId={1}
      isFormSelected={false}
    />,
  );

  expect(screen.queryByText(/Select this form/)).toBeNull();
  expect(screen.queryByText(/Selected/)).toBeNull();
});

test('load and display HO Accordion item', () => {
  render(
    <HOPatientInfoList
      element={{
        other: ['hello'],
        flag: 'yes',
      }}
      index={0}
    />,
  );

  expect(screen.getByText(/other/)).toBeDefined();
  expect(screen.getByText(/hello/)).toBeDefined();
  expect(screen.getByText(/flag/)).toBeDefined();
  expect(screen.getByText(/yes/)).toBeDefined();
});

test('load and display Admin Accordion item and filter values from element', () => {
  render(
    <AdnminPatientInfoList
      element={{
        flag: 'yes',
        covidStatus: 'Positive',
      }}
      index={0}
    />,
  );

  expect(screen.getByText(/Covid Status/)).toBeDefined();
  expect(screen.getByText(/Positive/)).toBeDefined();
  expect(screen.queryByText(/flag/)).toBeNull();
  expect(screen.queryByText(/yes/)).toBeNull();
});

test('doctor can select form when form is selected', () => {
  const onClick = jest.fn();
  render(
    <DoctorPatientInfoList
      element={{
        _id: 1,
        questions: [{question: 'What is this?', answer: 'Nothing'}],
        other: ['hello'],
        flag: 'yes',
      }}
      index={0}
      setSelectedFormId={onClick}
      selectedFormId={1}
      isFormSelected
    />,
  );

  userEvent.click(screen.getByText(/Selected/));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('element is filter to remove unwanted element for doctor', () => {
  render(
    <DoctorPatientInfoList
      element={{
        _id: 1234,
        patientUid: 'uid',
        other: 'flag',
        timestamp: 1234567890,
      }}
      index={0}
      setSelectedFormId={() => {}}
      selectedFormId={1}
      isFormSelected
    />,
  );

  expect(screen.queryByText(/_id/)).toBeNull();
  expect(screen.queryByText(/patientUid/)).toBeNull();
  expect(screen.queryByText(/timestamp/)).toBeNull();
  expect(screen.getByText(/other/)).toBeDefined();
});

test('element is filter to remove unwanted element for Health Officer', () => {
  render(
    <HOPatientInfoList
      element={{
        _id: 1234,
        patientUid: 'uid',
        other: 'sickness',
        timestamp: 1234567890,
        temperature: 123,
        otherSymptoms: 'not',
        symptomDetails: 'nothing',
        health: 'good',
        flag: 'yes',
      }}
      index={0}
    />,
  );

  expect(screen.queryByText(/_id/)).toBeNull();
  expect(screen.queryByText(/patientUid/)).toBeNull();
  expect(screen.queryByText(/timestamp/)).toBeNull();
  expect(screen.queryByText(/temperature/)).toBeNull();
  expect(screen.queryByText(/otherSymptoms/)).toBeNull();
  expect(screen.queryByText(/symptomDetails/)).toBeNull();
  expect(screen.queryByText(/health/)).toBeNull();
  expect(screen.getByText(/other/)).toBeDefined();
  expect(screen.getByText(/flag/)).toBeDefined();
});
