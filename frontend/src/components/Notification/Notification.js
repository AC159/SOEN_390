import styles from "./Notification.module.css";
import React, { useState } from 'react';

import { Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { Modal } from "react-bootstrap";

import axios from 'axios';

function Notification(props) {
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
    
  const [show, setShow] = useState(true);
  const [showing, setShowing] = useState(false);


  const handleModalClose  = () => setShowing(false);
  const handleModalShow  = () => setShowing(true);


  const id = props.notificationId;

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


    return (
        <div className={styles["notification-box"]}>
            <Alert show={show} variant={props.alertType}>
                <Alert.Heading>{props.alertHeading}</Alert.Heading>
                <p>
                    {props.alertMainText}
                </p>
                
                <div className="d-flex justify-content-end">
                  <Button onClick={handleModalShow} variant="outline-success">
                    View
                  </Button>
                  <Button onClick={() => deleteNotification(id)} variant="outline-success">
                    Delete
                  </Button>
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
                        <hr />
                        <p className="mb-0">
                            {props.modalSubText}
                        </p>
                    </Modal.Body>

                    <Modal.Footer>
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