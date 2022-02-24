import React from "react";
import MonitorPatients from "./MonitorPatients";
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';


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