import React, {useState, useEffect} from 'react';
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

import styles from "./NotificationBox.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Tabs/CommonPageStyling.css";

import { Alert } from "react-bootstrap";
import Notification from "../Notification/Notification";
import axios from 'axios';

function NotificationBox(props) {
    let {currentUser} = useAuth();
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

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async() => {
        axios.get(`/notification/${currentUser.user.uid}/notifications`)
        .then((res) => {
            console.log('Data received!');
            console.log(res);
            setNotifications(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className={styles["outer-container"]}>
            <div className={styles["notification-title"]}>Notifications</div>
            <div className={styles["notification-container"]}>
                {notifications.map((notifications) => (
                        <div className={styles["notification-box"]} key={notifications._id}>
                            <Notification 
                                notificationId={notifications._id}
                                timeStamp={notifications.timeStamp}

                                alertType={notifications.type}
                                alertHeading={notifications.heading} 
                                alertMainText={notifications.mainText}

                                modalHeading={notifications.heading} 
                                modalMainText={notifications.mainText}
                                modalSubText={notifications.subText}
                            />
                        </div>
                ))}
            </div>
        </div>
        
    );
}

export default NotificationBox;