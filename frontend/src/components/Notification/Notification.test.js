import {render, screen} from '@testing-library/react'
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

import Notification from './Notification';
import { AuthContext } from '../Authentication/FirebaseAuth/FirebaseAuth';


test('should render notification without crashing', () => {
    render(<Notification/>);
    const notificationElement = screen.getByTestId('notification-1');
    expect(notificationElement).toBeInTheDocument();
  });

it('renders view button correctly', () => {
    const {getByTestId} = render(<Notification/>)
    expect(getByTestId('viewNotificationButton')).toHaveTextContent("View")
})

it('renders delete button correctly', () => {
    const {getByTestId} = render(<Notification/>)
    expect(getByTestId('deleteNotificationButton')).toHaveTextContent("Delete")
})