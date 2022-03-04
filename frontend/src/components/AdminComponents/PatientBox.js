import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PatientBox.module.css";
import { useState, useEffect } from "react";

import { Accordion } from "react-bootstrap";
import { Button } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { Modal } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

import axios from "axios";

let selectedDoctorID = "";
let selectedDoctorName = "";

function PatientBox(props) {
  
  const [show, setShow] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openDoctorList = () => {
    handleShow();
    fetchDoctorList();
  }

  const selectDoctor = (id, name) => {
    selectedDoctorID=id;
    selectedDoctorName=name;
  }

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(`admin/${props.currentUser.user.uid}/doctors`);
      setDoctorList(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  const assignDoctorToPatient = () => {

    const pair = {
      patient:props.patient.uid, 
      doctor:selectedDoctorID,
      adminID:props.currentUser.uid,
      doctorName: selectedDoctorName
    }

    try {
      const response = axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setAssignedDoctor(selectedDoctorName);
    handleClose();
  }

  

  function isValidAdmin(currentUserType){

    switch(currentUserType){

      case "administrator": return true;
      

      default: return false;
      
    }

  }

  const renderDoctorList = () => {
    return <ListGroup>
      {doctorList.map((doctor) => 
        <ListGroup.Item>
          {doctor.name}
          <div className={styles["doctor-side"]}>
          <div className={styles["doctor-patient-count"]}>{"Patients Assigned: " + doctor.patientCount}</div>
          <Button 
          variant="outline-primary" 
          onClick={() => selectDoctor(doctor.uid, doctor.name)} 
          className={styles["doctor-select-button"]}>
          Select
          </Button>
          </div>
          
        </ListGroup.Item> )}
    </ListGroup>;
  } 

  return (
    <div className={styles["card-container"]}>
      
      <Accordion.Item eventKey={props.eventKey} className={styles["patient-box"]}>
        <Accordion.Header data-testid="patient-name"><h5>{props.patient.name}</h5></Accordion.Header>
        <AccordionBody>
          <h6 data-testid="patient-dob">Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {(props.doctorName === "" ? "No Doctor Assigned" : assignedDoctor)}</h6>

          {isValidAdmin(props.userType) ? <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button> : <div></div>}
          
          
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
