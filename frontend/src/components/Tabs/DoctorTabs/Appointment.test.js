import {render, screen} from '@testing-library/react'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

import { AuthContext } from '../../Authentication/FirebaseAuth/FirebaseAuth';
import Appointment from './Appointment';


describe('visual test of the component', () => {
    it('should render appointments without crashing', () => {
        render(<BrowserRouter>
            <AuthContext.Provider value={{
              currentUser: {
                user: 'doctor1_covicare@gmail.com',
                uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
                userType: 'doctor',
              },
            }}>
              <Appointment/>
            </AuthContext.Provider>
          </BrowserRouter>);
        const appointmentElement = screen.getByTestId('appointment-1');
        expect(appointmentElement).toBeInTheDocument();
    });

    it('renders book appointment button correctly', () => {
        const {getByTestId} = render(<BrowserRouter>
            <AuthContext.Provider value={{
              currentUser: {
                user: 'doctor1_covicare@gmail.com',
                uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
                userType: 'doctor',
              },
            }}>
              <Appointment/>
            </AuthContext.Provider>
          </BrowserRouter>)
        expect(getByTestId('viewBookAppointmentBtn')).toHaveTextContent("Book Appointment")
    })
    
    it('should render appointments without crashing', () => {
        render(<BrowserRouter>
            <AuthContext.Provider value={{
              currentUser: {
                user: 'doctor1_covicare@gmail.com',
                uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
                userType: 'doctor',
              },
            }}>
              <Appointment/>
            </AuthContext.Provider>
          </BrowserRouter>);
        const listAppointmentElement = screen.getByTestId('appointment-list');
        expect(listAppointmentElement).toBeInTheDocument();
    });
});
