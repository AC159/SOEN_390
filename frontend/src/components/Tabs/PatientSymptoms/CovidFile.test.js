import {render, screen} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'

import CovidFile from './CovidFile';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

const patientData = [{covidStatus: 'Positive'}, {symptoms: ['Headache', 'Sore throat']}, {otherSymptoms: ''}, {temp: '38'},{symptomDetails: ''}, {symptomDetails: ''}];

describe('visual test of the component', () => {
  it('should display default covid status null', () => {
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

    expect(screen.getByText(/^Covid Status:/)).toHaveTextContent('Covid Status:');
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

    expect(screen.getByText(/^Symptoms:/)).toHaveTextContent('Symptoms:');
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

    expect(screen.getByText(/^Other Symptoms:/)).toHaveTextContent('Other Symptoms:');
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

    expect(screen.getByText(/^Temperature:/)).toHaveTextContent('Temperature:');
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

    expect(screen.getByText(/^Details about the symptoms:/)).toHaveTextContent('Details about the symptoms:');
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

    expect(screen.getByText(/^Detail about health:/)).toHaveTextContent('Detail about health:');
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