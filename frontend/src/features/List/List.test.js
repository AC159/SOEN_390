/* eslint-disable */
import React from 'react';
import axios from 'axios';
import {render, screen} from '@testing-library/react';
import {act} from 'react-dom/test-utils';

import {PatientList, DoctorList} from './List';

jest.mock('axios');

describe('visual test of PatientList', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url === 'admin/1234/patients') {
        return Promise.resolve({
          data: {
            data: [
              {
                name: 'John',
              },
            ],
          },
        });
      }
    });
  });
  it('renders without crashing', async () => {
    act(() => {
      render(
        <PatientList
          title='Patient List'
          listUrl='admin/1234/patients'
          render={(patient, index) => <div key={index}>{patient.name}</div>}
        />,
      );
    });

    expect(await screen.findByText(/Patient List/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get.mock.calls[0]).toEqual(expect.arrayContaining(['admin/1234/patients']));
  });
});

describe('visual test of DoctorList', () => {
  beforeEach(() => {
    axios.get.mockReturnValue({
      data: {
        data: [
          {
            name: 'John',
          },
        ],
      },
    });
  });
  it('renders without crashing', async () => {
    act(() => {
      render(
        <DoctorList
          title='Doctor List'
          listUrl='admin/1234/doctors'
          render={(doctor, index) => <div key={index}>{doctor.name}</div>}
        />,
      );
    });

    expect(axios.get.mock.calls[0]).toEqual(expect.arrayContaining(['admin/1234/doctors']));
    expect(await screen.findByText(/Doctor List/)).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledTimes(1);
  });
});
