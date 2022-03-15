import styles from "./Notification.module.css";
import React, {useState} from 'react';
import {Button, Card, Dropdown, DropdownButton} from "react-bootstrap";
import {Modal} from "react-bootstrap";

function Notification(props) {
    const [showing, setShowing] = useState(false);

    const handleModalClose = () => setShowing(false);
    const handleModalShow = () => setShowing(true);

    const id = props.notificationId;
    const timeStamp = props.timeStamp;

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

    let color;
    if (props.alertType === 'warning') color = 'warning-color';
    else if (props.alertType === 'primary') color = 'info-color';
    if (props.alertType === 'urgent') color = 'urgent-color';

    return (
      <div className={styles["notification-box"]}>
            <Card className={styles[color]}>
                <Card.Header>{props.alertHeading}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {props.alertMainText}
                    </Card.Text>
                    <div className="p-1">
                        <DropdownButton id="dropdown-basic-button" title="More">
                            <Dropdown.Item onClick={handleModalShow} variant="primary">View</Dropdown.Item>
                            <Dropdown.Item onClick={() => props.deleteNotification(id)} variant="primary">Delete</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </Card.Body>
                <Card.Footer>{showTimeStamp()}</Card.Footer>
            </Card>

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
