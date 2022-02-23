import {render, screen} from '@testing-library/react';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';

import PatientBox from './PatientBox';
jest.mock('axios');

describe('visual test of the component', () => {
  it('should render without crashing', () => {
    const patient = {
      uid: '123456',
      name: 'Alfred',
      dob: '1234-12-12',
      patientInfo: {
        doctor: 'John'
      }
    }

    const currentUser = {
      user: {
        uid: '1234567890'
      }
    }
    render(
    <PatientBox 
      eventKey="event-key"
      currentUser={currentUser}
      patient={patient} 
    />)

  })
})

