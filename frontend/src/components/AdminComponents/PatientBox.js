import React, { useState } from 'react';
import axios from "axios";
import { Accordion, Button, Modal, ListGroup } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

import DoctorListItem from './DoctorListItem';
import styles from "./PatientBox.module.css";

function PatientBox(props) {
  
  const [show, setShow] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState(props.patient.patientInfo.doctor);
  const [doctorInfo, setDoctorInfo] = useState({
    id: '',
    name: ''
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openDoctorList = () => {
    handleShow();
    fetchDoctorList();
  }

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(`admin/${props.currentUser.user.uid}/doctors`);
      setDoctorList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  const assignDoctorToPatient = () => {

    const pair = {
      patient:props.patient.uid, 
      doctor:doctorInfo.id,
      adminID:props.currentUser.uid,
      doctorName: doctorInfo.name
    }

    try {
      const response = axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setAssignedDoctor(doctorInfo.name);
    handleClose();
  }

  const renderDoctorList = () => {
    return <ListGroup>
      {doctorList.map((doctor) => 
        <DoctorListItem 
          doctor={doctor}
          setDoctorInfo={setDoctorInfo}
          selected={doctorInfo.id === doctor.uid}
        />
        )}
    </ListGroup>;
  } 

  return (
    <div className={styles["card-container"]}>
      
      <Accordion.Item eventKey={props.eventKey} className={styles["patient-box"]}>
        <Accordion.Header data-testid="patient-name"><h5>{props.patient.name}</h5></Accordion.Header>
        <AccordionBody>
          <h6 data-testid="patient-dob">Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {(props.patient.patientInfo.doctor === "" ? "No Doctor Assigned" : assignedDoctor)}</h6>

          <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button>
          
        </AccordionBody>
      </Accordion.Item>

      <Modal data-testid="doctor-list-modal" show={show} onHide={handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Doctors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {renderDoctorList()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={assignDoctorToPatient}>
            Assign to {props.patient.name}
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}

export default PatientBox;
