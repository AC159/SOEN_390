import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';


import PatientList from "./PatientList.js"
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

jest.mock('axios');

describe('visual test of the PatientList component', () => {
  it('should render without crashing', () => {
    render(<BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <PatientList />
        </AuthContext.Provider>
      </BrowserRouter>)

  })
})

