import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import PatientCTDataItem from './PatientCTDataItem';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
  axios.mockRestore();
});

test('load and display Accordion item', () => {
  render(
    <AuthContext.Provider
      value={{
        currentUser: {
          dbData: {
            userType: 'healthOfficial',
          },
        },
      }}
    >
      <PatientCTDataItem
        element={{
          timestamp: 123456678,
          date: '2020-01-01',
          emailList: ['jdoe@email.com'],
        }}
        index={0}
        patientName='John Doe'
        sendContactTraceNotification={() => {}}
      />
    </AuthContext.Provider>,
  );

  expect(screen.getByText(/^List of emails/)).toHaveTextContent(
    "List of emails of people who've been in contact with John Doe",
  );
  expect(screen.getByText(/Notify This User/)).toBeDefined();
});

test('it should trigger function on health official click', () => {
  const mockGet = axios.get.mockResolvedValue({
    data: {
      uid: '1234',
    },
  });
  render(
    <AuthContext.Provider
      value={{
        currentUser: {
          dbData: {
            userType: 'healthOfficial',
          },
        },
      }}
    >
      <PatientCTDataItem
        element={{
          timestamp: 123456678,
          date: '2020-01-01',
          emailList: ['jdoe@email.com'],
        }}
        index={0}
        patientName='John Doe'
      />
    </AuthContext.Provider>,
  );

  userEvent.click(screen.getByText(/Notify /));
  expect(mockGet).toHaveBeenCalledTimes(1);
});

test('it should not show button if not health official', () => {
  render(
    <AuthContext.Provider
      value={{
        currentUser: {
          dbData: {
            userType: 'doctor',
          },
        },
      }}
    >
      <PatientCTDataItem
        element={{
          timestamp: 123456678,
          date: '2020-01-01',
          emailList: ['jdoe@email.com'],
        }}
        index={0}
        patientName='John Doe'
      />
    </AuthContext.Provider>,
  );

  expect(screen.queryByText(/Notify This User/)).toBeNull();
});

test('it should not show button if no email for health official', () => {
  render(
    <AuthContext.Provider
      value={{
        currentUser: {
          dbData: {
            userType: 'doctor',
          },
        },
      }}
    >
      <PatientCTDataItem
        element={{
          timestamp: 123456678,
          date: '2020-01-01',
          emailList: [],
        }}
        index={0}
        patientName='John Doe'
      />
    </AuthContext.Provider>,
  );

  expect(screen.queryByText(/Notify This User/)).toBeNull();
});
