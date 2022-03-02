import {render, screen} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'

import CovidFile from './CovidFile';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

const patientData = [
    {
        covidStatus: 'Positive',
        symptoms: ['Headache', 'Sore throat'],
        otherSymptoms: '',
        temp: '38',
        symptomDetails: '',
        timestamp: 1646233975
    }
];

describe('visual test of the component', () => {

  it('should display default covid status null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
            <CovidFile state={{patientData}} />
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Created on Wednesday, March 2nd 2022, 10:12:55 am')).toBeNull();
  })
  
  it('should display default symptoms null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <CovidFile/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Do you have any symptoms:')).toBeNull();
  })

  it('should display default other symptoms null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <CovidFile/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Other Symptoms:')).toBeNull();
  })

  it('should display default temperature null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <CovidFile/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Temperature:')).toBeNull();
  })

  it('should display default details about the symptoms null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <CovidFile/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Details about the symptoms:')).toBeNull();
  })

  it('should display default detail about health null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <CovidFile/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Detail about health:')).toBeNull();
  })

  it('should have array of patient information', () => {
    expect(patientData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({covidStatus: 'Positive'}),
        expect.objectContaining({symptoms: ['Headache', 'Sore throat']}),
        expect.objectContaining({otherSymptoms: ''}),
        expect.objectContaining({temp: '38'}),
        expect.objectContaining({symptomDetails: ''}),
        expect.objectContaining({symptomDetails: ''})
      ])
    );
  });
})
