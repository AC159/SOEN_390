import React from 'react';
import {render, screen} from '@testing-library/react';

import PatientTravelDataItem from './PatientTravelDataItem';

describe('visual test of PatientTravelDataItem component', () => {
  const element = {
    timeStamp: 123456789,
    date: [
      {
        startDate: '1111-01-01',
        endDate: '3333-01-01',
      },
    ],
    locationDescription: 'Canada',
    travelPurpose: 'pleasure',
  };

  it('should load and display without error', async () => {
    render(<PatientTravelDataItem index={0} element={element} />);

    expect(screen.getByText(/pleasure/)).toBeInTheDocument();
    expect(await screen.findByText(/Friday, January 2nd 1970,/)).toBeInTheDocument();
  });
});
