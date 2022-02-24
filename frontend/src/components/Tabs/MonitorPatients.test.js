import React from "react";
import MonitorPatients from "./MonitorPatients";

import {render, screen} from '@testing-library/react';
import {BrowserRouter, MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event'

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios'
// jest.mock('axios');

describe('visual test of the component', () => {

it("renders without crashing", ()=>{
    render(<BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
        }}>
          <MonitorPatients />
        </AuthContext.Provider>
      </BrowserRouter>)
})

})