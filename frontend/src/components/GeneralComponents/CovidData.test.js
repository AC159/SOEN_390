import {render, screen} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import axios from 'axios';

import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';
import CovidData from './CovidData';

jest.mock('axios');

describe('visual test of the component', () => {
  const auth = {
    currentUser: {
      user: {
        uid: '123456',
      },
    },
  };

  beforeEach(() => {
    axios.get.mockReturnValue({
      data: {
        data: [],
      },
    });
  });

  afterEach(() => {
    axios.get.mockReset();
  });

  it('should render covid data charts without crashing', async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <CovidData />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByTestId('covid-data')).toBeInTheDocument();
    expect(await screen.findByText('Current Patients Status')).toBeInTheDocument();
  });

  it('should render nothing when error on fetch patient array', async () => {
    axios.get.mockRejectedValueOnce(new Error('error'));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <CovidData />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    expect(await screen.findByText('Current Patients Status')).toBeInTheDocument();
  });

  it('should increment patientCount depending on the type of patient', async () => {
    axios.get.mockReturnValueOnce({
      data: {
        data: [
          {
            status: 'Positive',
            doctorFlagInfo: {
              isFlagged: true,
            },
          },
          {
            status: 'Negative',
            doctorFlagInfo: {
              isFlagged: false,
            },
          },
          {
            status: 'not tested',
            doctorFlagInfo: {
              isFlagged: true,
            },
          },
        ],
      },
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={auth}>
          <CovidData />
        </AuthContext.Provider>
      </BrowserRouter>,
    );

    await expect(axios.get).toHaveBeenCalledTimes(1);
    await expect(axios.get).toHaveBeenCalledWith(
      `doctor/${auth.currentUser.user.uid}/patientArrays`,
    );
  });
});
