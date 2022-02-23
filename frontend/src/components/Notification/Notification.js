import styles from "./Notification.module.css";
import React, {useState} from 'react';

import {Button} from "react-bootstrap";
import {Alert} from "react-bootstrap";
import {Modal} from "react-bootstrap";

import axios from 'axios';

function Notification(props) {
    const [show, setShow] = useState(true);
    const [showing, setShowing] = useState(false);

    const handleModalClose = () => setShowing(false);
    const handleModalShow = () => setShowing(true);

    const id = props.notificationId;
    const timeStamp = props.timeStamp;

    const deleteNotification = (id) => {
        axios.post(`/notification/${id}/delete`)
            .then(() => {
                console.log('Notification deleted!');
                setShow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function showTimeStamp() {
        return (
            new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).format(timeStamp)
        );
    }

    return (
        <div className={styles["notification-box"]}>
            <Alert show={show} variant={props.alertType}>
                <Alert.Heading>
                    {props.alertHeading}
                </Alert.Heading>
                <p>
                    {props.alertMainText}
                </p>
                <div className="d-flex">
                    <div class="mr-auto p-2">
                        {showTimeStamp()}
                    </div>
                    <div class="p-1">
                        <Button onClick={handleModalShow} variant="outline-success">
                            View
                        </Button>
                        <Button onClick={() => deleteNotification(id)} variant="outline-success">
                            Delete
                        </Button>
                    </div>
                </div>
            </Alert>

            <div>
                <Modal show={showing} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{props.modalHeading}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>
                            {props.modalMainText}
                        </p>
                        <hr/>
                        <p className="mb-0">
                            {props.modalSubText}
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
                        <p>
                            {showTimeStamp()}
                        </p>
                        <Button variant="secondary" onClick={handleModalClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default Notification;
