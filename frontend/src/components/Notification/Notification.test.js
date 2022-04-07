import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Notification from './Notification';

describe('visual test of Notification', () => {
  it('should load and display without error', async () => {
    render(
      <Notification
        notificationId='1234'
        timeStamp={123456799}
        alertType='warning'
        alertHeading='Heading'
        alertMainText='Main Text'
        modalHeading='Modal Heading'
        modalMainText='Modal Main Text'
        modalSubText='Modal Sub Text'
        deleteNotification={() => jest.fn()}
      />,
    );

    expect(screen.getByText(/^Heading/)).toBeInTheDocument();
    expect(screen.getByText(/^Main Text/)).toBeInTheDocument();

    userEvent.click(screen.getByText(/^More/));
    userEvent.click(screen.getByText(/^View/));
    expect(await screen.findByText(/^Modal Heading/)).toBeInTheDocument();
    expect(await screen.findByText(/^Modal Main Text/)).toBeInTheDocument();
    expect(await screen.findByText(/^Modal Sub Text/)).toBeInTheDocument();

    expect(screen.getByTestId('card-color-id').className.split(' ')).toEqual(
      expect.arrayContaining(['warning-color']),
    );
  });

  it('should be able to delete a notification', async () => {
    const mockOnClick = jest.fn();
    render(
      <Notification
        notificationId='1234'
        timeStamp={123456799}
        alertType='primary'
        alertHeading='Heading'
        alertMainText='Main Text'
        modalHeading='Modal Heading'
        modalMainText='Modal Main Text'
        modalSubText='Modal Sub Text'
        deleteNotification={mockOnClick}
      />,
    );

    userEvent.click(screen.getByText(/^More/));
    userEvent.click(screen.getByText(/^Delete/));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect((await screen.findByTestId('card-color-id')).className.split(' ')).toEqual(
      expect.arrayContaining(['info-color']),
    );
  });

  it('should reflect urgent notification color', () => {
    const mockOnClick = jest.fn();
    render(
      <Notification
        notificationId='1234'
        timeStamp={123456799}
        alertType='urgent'
        alertHeading='Heading'
        alertMainText='Main Text'
        modalHeading='Modal Heading'
        modalMainText='Modal Main Text'
        modalSubText='Modal Sub Text'
        deleteNotification={mockOnClick}
      />,
    );

    expect(screen.getByTestId('card-color-id').className.split(' ')).toEqual(
      expect.arrayContaining(['urgent-color']),
    );
  });
});
