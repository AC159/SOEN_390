import {render, screen} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'

import ContactTrace from './ContactTrace';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

const patientTracing = [
    {
        date: '2022-03-04',
        emailList: ['melissa.2@hotmail.com', 'jan1910@hotmail.com'],
        locationDescription: 'concordia',
        timestamp: 1647368342832
    }
];

describe('visual test of the component', () => {

  it('should display default covid status null', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
            <ContactTrace state={{patientTracing}} />
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Created on Tuesday, March 15th 2022, 2:19:02 pm')).toBeNull();
  })

  it('should display default date to bee null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <ContactTrace/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('The date you came in contact with them')).toBeNull();
  })

  it('should display default the location as null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <ContactTrace/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Enter the location info')).toBeNull();
  })

  it('should display default email as null', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <ContactTrace/>
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.queryByText('Enter all the people\'s email')).toBeNull();
  })

  it('should have array of patient information', async () => {
    expect(patientTracing).toEqual(
      expect.arrayContaining([
        expect.objectContaining({date: '2022-03-04'}),
        expect.objectContaining({emailList: ['melissa.2@hotmail.com', 'jan1910@hotmail.com']}),
        expect.objectContaining({locationDescription: 'concordia'})
      ])
    );
  });
})
