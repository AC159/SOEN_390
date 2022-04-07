import React from 'react';
import {render, screen} from '@testing-library/react';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

import RoleRequestBox from './RoleRequestBox';

jest.mock('axios');

describe('visual test of RoleRequestBox component', () => {
  it('should load and display without error', () => {
    render(
      <RoleRequestBox
        uID='1234'
        adminId='5678'
        userEmail='jdoe@email.com'
        RequesterUsername='John Doe'
        RequestType='Doctor'
      />,
    );

    expect(screen.getByText(/John Doe wants to join as a Doctor/)).toBeInTheDocument();
  });

  it('should approve user on approve click', async () => {
    const mockGet = axios.post.mockResolvedValue({success: true});

    render(
      <RoleRequestBox
        uID='1234'
        adminId='5678'
        userEmail='jdoe@email.com'
        RequesterUsername='John Doe'
        RequestType='Doctor'
      />,
    );

    userEvent.click(screen.getByText(/Approve/));
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should throw an error on approve click when axios fail', async () => {
    const mockGet = axios.post.mockRejectedValue(new Error('This is not working'));

    render(
      <RoleRequestBox
        uID='1234'
        adminId='5678'
        userEmail='jdoe@email.com'
        RequesterUsername='John Doe'
        RequestType='Doctor'
      />,
    );

    userEvent.click(screen.getByText(/Approve/));
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should reject user on reject click', async () => {
    const mockGet = axios.post.mockResolvedValue({success: true});

    render(
      <RoleRequestBox
        uID='1234'
        adminId='5678'
        userEmail='jdoe@email.com'
        RequesterUsername='John Doe'
        RequestType='Doctor'
      />,
    );

    userEvent.click(screen.getByText(/Reject/));
    expect(mockGet).toHaveBeenCalledTimes(1);
  });

  it('should throw an error on reject click when axios fail', async () => {
    const mockGet = axios.post.mockRejectedValue(new Error('This is not working'));

    render(
      <RoleRequestBox
        uID='1234'
        adminId='5678'
        userEmail='jdoe@email.com'
        RequesterUsername='John Doe'
        RequestType='Doctor'
      />,
    );

    userEvent.click(screen.getByText(/Reject/));
    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});
