import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';

import Notification from './Notification';

const deleteNotification = (id) => {};

test('should render notification without crashing', () => {
    render(<Notification 
                notificationId={"123"}
                timeStamp={1214153236}
                alertType={"warning"}
                alertHeading={"Alert Heading"}
                alertMainText={"Alert Text"}
                modalHeading={"Alert Modal Heading"}
                modalMainText={"Alert Modal Main Text"}
                modalSubText={"Alert Modal Sub Text"}
                deleteNotification={deleteNotification(1213131)}
        />);
    const notificationElement = screen.getByTestId('notification-1');
    expect(notificationElement).toBeInTheDocument();
  });

it('renders view and delete button correctly', () => {
    const {getByTestId} = render(<Notification
        notificationId={"123"}
        timeStamp={1214153236}
        alertType={"warning"}
        alertHeading={"Alert Heading"}
        alertMainText={"Alert Text"}
        modalHeading={"Alert Modal Heading"}
        modalMainText={"Alert Modal Main Text"}
        modalSubText={"Alert Modal Sub Text"}
        deleteNotification={deleteNotification()}
    />)

    userEvent.click(screen.getByText("More"));

    expect(screen.getByTestId('viewNotificationButton')).toBeInTheDocument()
    expect(screen.getByTestId('deleteNotificationButton')).toBeInTheDocument()
    
})

/*it('renders delete button correctly', () => {
    const {getByTestId} = render(<Notification
        notificationId={"123"}
        timeStamp={1214153236}
        alertType={"warning"}
        alertHeading={"Alert Heading"}
        alertMainText={"Alert Text"}
        modalHeading={"Alert Modal Heading"}
        modalMainText={"Alert Modal Main Text"}
        modalSubText={"Alert Modal Sub Text"}
        deleteNotification={deleteNotification()}
    />)
    
})*/