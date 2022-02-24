import {render, screen} from '@testing-library/react';

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

  it('should display patient name accurately', () => {

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
    expect(screen.getByTestId('patient-name')).toHaveTextContent("Alfred")

  })

  it('should display patient dob accurately', () => {

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
    expect(screen.getByTestId('patient-dob')).toHaveTextContent("1234-12-12")

  })

})

