import React from 'react';
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {AuthContext} from '../../Authentication/FirebaseAuth/FirebaseAuth';

import ContactPatients from './ContactPatients.js';

jest.mock('axios');

describe('visual test of Contact Doctor component', () => {
  const patientMessage = {
    chatId: 1, 
    message: "test message 1 from patient", 
    senderId: "p1", 
    receiverId: "d1", 
    priority: false
  };
  const doctorMessage = {
    chatId: 2, 
    message: "test message 1 from doctor", 
    senderId: "d1", 
    receiverId: "p1", 
    priority: false
  };

  const user = {
    user: {
      uid: '1234',
    },
    dbData: {
      userType: 'doctor',
    },
  };


  it('should load and display', () => {
    var component = render(
    <AuthContext.Provider
        value={{
            currentUser: user,
        }}>
            <ContactPatients/>
        </AuthContext.Provider>
    );
    expect(component);
  });

  it('should display loading text and animation', async () => {
    var component = render(
    <AuthContext.Provider
        value={{
            currentUser: user,
        }}>
            <ContactPatients/>
        </AuthContext.Provider>
    );
    expect(screen.getByTestId("spinner"));
  });

});