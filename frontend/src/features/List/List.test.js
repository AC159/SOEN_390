/* eslint-disable */ 
import React from 'react';
import axios from 'axios';
import {render, screen} from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { PatientList, DoctorList } from './List';

jest.mock('axios');

describe('visual test of PatientList', () => {
  beforeEach(() => {
    axios.get.mockImplementation(url => {
      if (url === 'admin/1234/patients') {
        return  Promise.resolve({data: {data: [
          {
            name: 'John',
          }
        ]}});
      }
    })
  })
  it('renders without crashing', async () => {
    act(() => {render(<PatientList
      title="Patient List"
      listUrl="admin/1234/patients"
      render={(patient, index) => <div key={index}>{patient.name}</div>}
    />)});

    const title = screen.getByText(/Patient List/);

    expect(title).toBeInTheDocument();
  })
});


describe('visual test of DoctorList', () => {
  beforeEach(() => {
    axios.get.mockImplementation(url => {
      if (url === 'admin/1234/doctors') {
        return  Promise.resolve({data: {data: [
          {
            name: 'John',
          }
        ]}});
      }
    })
  })
  it('renders without crashing', async () => {
    act(() => {render(<DoctorList
      title="Doctor List"
      listUrl="admin/1234/patients"
      render={(patient, index) => <div key={index}>{doctor.name}</div>}
    />)});

    const title = screen.getByText(/Doctor List/);

    expect(title).toBeInTheDocument();
  })
})