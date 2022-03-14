import React, {useState, useEffect} from 'react';
import {useAuth} from "../Authentication/FirebaseAuth/FirebaseAuth";
import styles from "./NotificationBox.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../Tabs/CommonPageStyling.css";
import Notification from "../Notification/Notification";
import axios from 'axios';

function NotificationBox() {
    let {currentUser} = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [emptyMessage, setEmptyMessage] = useState(false);

    const deleteNotification = (id) => {
        axios.post(`/notification/${id}/delete`)
            .then(() => {
                console.log('Notification deleted!');
                setNotifications(notifications.filter(element => element._id !== id));
                setEmptyMessage(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
      async function fetchData() {
        await axios.get(`/notification/${currentUser.user.uid}/notifications`)
            .then((res) => {
                console.log('Data received!');
                console.log(res.data.length);
                if (res.data.length === 0) {
                    setEmptyMessage(true);
                } else {
                    setNotifications(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
          }
        fetchData();
    }, []);

    const EmptyMessage = () => (
        <div className={styles["empty-message"]}>
            No new notifications!
        </div>
    );

    return (
        <div className={styles["outer-container"]}>
            <div className={styles["notification-title"]}>Notifications</div>
            <div className={styles["notification-container"]}>
                {emptyMessage ? <EmptyMessage/> : null}
                {notifications.map((notification) => (
                    <div className={styles["notification-box"]} key={notification._id}>
                        <Notification
                            notificationId={notification._id}
                            timeStamp={notification.timeStamp}
                            alertType={notification.type}
                            alertHeading={notification.heading}
                            alertMainText={notification.mainText}
                            modalHeading={notification.heading}
                            modalMainText={notification.mainText}
                            modalSubText={notification.subText}
                            deleteNotification={deleteNotification}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
}

export default NotificationBox;
