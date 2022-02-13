import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

import styles from "./NotificationBox.module.css";

import { Alert } from "react-bootstrap";
import Notification from "../Notification/Notification";


function NotificationBox(props) {
    let { currentUser } = useAuth();
    [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ].map((variant, idx) => (
        <Alert key={idx} variant={variant}>
          This is a {variant} alert—check it out!
        </Alert>
      ));

    return (
        <div className={styles["outer-container"]}>
            <div className={styles["notification-title"]}>Notifications</div>
            <div className={styles["notification-container"]}>
            
            <div className={styles["notification-box"]}>
            <Notification
                alertType="warning"
                alertMainText="It is very important that you update your COVID symptoms before 11:59PM today."
                alertSubText="You can do so by clicking the Update COVID Symptoms tab to the left of this page." 
                alertHeading="Important!"
            />
            <Notification
                alertType="info"
                alertMainText="The Government of Quebec announced today that from Monday, 11th January 2021 onwards......"
                alertSubText=""
                alertHeading="Changes in Government Guidelines"
            />
            <Notification
                alertType="success"
                alertMainText="Your doctor has decided that your symptoms are not serious."
                alertSubText=""
                alertHeading="Good news!"
            />
            <Notification
                alertType="primary"
                alertMainText="You have a new message from Dr. Gumsimran Singh"
                alertSubText="Click here to open Chat" 
                alertHeading="New Message!"
            />
            <Notification
                alertType="warning"
                alertMainText="Please verify your email"
                alertSubText="Follow the instructions on the verification email we sent you." 
                alertHeading="Important!"
            />
            </div>
        </div>
        </div>
        
    );
}

export default NotificationBox;