import {render, screen} from '@testing-library/react'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

import { AuthContext } from '../Authentication/FirebaseAuth/FirebaseAuth';
import CovidData from './CovidData';


describe('visual test of the component', () => {
    it('should render covid data charts without crashing', () => {
        render(<BrowserRouter>
            <AuthContext.Provider value={{
              currentUser: {
                user: 'doctor1_covicare@gmail.com',
                uid: 'zXX7Yt2lNSa6BhaLFnbosq4IdS22',
                userType: 'doctor',
              },
            }}>
              <CovidData/>
            </AuthContext.Provider>
          </BrowserRouter>);
        const covidDataElement = screen.getByTestId('covid-data');
        expect(covidDataElement).toBeInTheDocument();
    });
});
