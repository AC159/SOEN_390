import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PatientBox.module.css";
import React, { useState, useEffect } from "react";

import { Accordion, Navbar } from "react-bootstrap";
import { Button } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { Modal } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";

import axios from "axios";
import moment from "moment";
import {useAuth} from "../Authentication/FirebaseAuth/FirebaseAuth";

let selectedDoctorID = "";
let selectedDoctorName = "";

function PatientBox(props) {

  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);

  const handleDoctorListClose = () => setShowDoctorList(false);
  const handleDoctorListShow = () => setShowDoctorList(true);

  const handlePatientInfoClose = () => setShowPatientInfo(false);
  const handlePatientInfoShow = () => setShowPatientInfo(true);

    let [patientData, setPatientData] = useState();

  const openDoctorList = () => {
    handleDoctorListShow();
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
    handleDoctorListClose();
  }



  function isValidAdmin(currentUserType){

    switch(currentUserType){

      case "administrator": return true;


      default: return false;

    }

  }

  function isValidUserForPatientInfo(currentUserType){

    switch(currentUserType){

      case "administrator": return true;
      case "health-official": return true;
      case "immigration-officer": return true;
      case "doctor": return true;

      default: return false;

    }

  }

  async function fetchPatientInfo(patientUid) {
    try {
            const response = await axios.get(`/patient/get-status-forms/${patientUid}`);
            console.log(response);
            setPatientData(response.data);
        } catch (error) {
            console.log('Unable to fetch patient status forms: ', error);
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
          {isValidUserForPatientInfo(props.userType) ? <Button variant="primary" onClick={event => {handlePatientInfoShow(); fetchPatientInfo(props.patient.uid);}}>Patient Information</Button> : <div></div>}


        </AccordionBody>
      </Accordion.Item>

      <Modal className={styles["doctor-list-modal"]} data-testid="doctor-list-modal" show={showDoctorList} onHide={handleDoctorListClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title>Doctors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {renderDoctorList()}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDoctorListClose}>
            Close
          </Button>
          <Button variant="primary" onClick={assignDoctorToPatient}>
            Assign to {props.patient.name}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal fullscreen ={true} contentClassName={styles["patient-info-modal"]} data-testid="patient-info-modal" show={showPatientInfo} onHide={handlePatientInfoClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.patient.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
             {patientData ? <Accordion defaultActiveKey="0">
                {patientData.map((element, index) => {
                let date = new Date(element.timestamp * 1000);
                return <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>Created on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(element).map(([key, value], index) => {
                                if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp' || value.length === 0) return null;
                                if (Array.isArray(value)) {
                                    return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul></div>;
                                } else return <div key={index}><strong>{key}</strong>: {value}</div>;
                            })}
                        </Accordion.Body>
                    </Accordion.Item>;
            })} </Accordion> : null}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePatientInfoClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



    </div>
  );
}

export default PatientBox;
