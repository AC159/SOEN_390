import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PatientBox.module.css";
import React, { useState, useEffect } from "react";

import { Accordion} from "react-bootstrap";
import { Button } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import { Modal } from "react-bootstrap";
import { ListGroup } from "react-bootstrap";
import { Tabs } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import { Card } from "react-bootstrap";
import patientIcon from "../../assets/patientIcon.png";

import axios from "axios";
import moment from "moment";
import {useAuth} from "../Authentication/FirebaseAuth/FirebaseAuth";

let selectedDoctorID = "";
let selectedDoctorName = "";

function PatientBox(props) {

  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);

  const [showPatientInfo, setShowPatientInfo] = useState(false)

  const [isFlagged, setIsFlagged] = useState(false);


  const handleDoctorListClose = () => setShowDoctorList(false);
  const handleDoctorListShow = () => setShowDoctorList(true);

  const handlePatientInfoClose = () => {
    setShowPatientInfo(false);
  }
  
  useEffect(() => {
    checkIsFlagged();
  }, [])

  useEffect(() => {
    changeFlagButtonText();
  }, [isFlagged])

  const checkIsFlagged = () => {
    var newFlagValue;
    switch(localStorage.getItem("userType"))
    {
      case "doctor": (props.patient.doctorFlagInfo.isFlagged ? newFlagValue=true : newFlagValue=false); break;
      case "immigrationOfficial": (props.patient.immigrationOfficerFlagInfo.isFlagged ? newFlagValue=true : newFlagValue=false); break;
      case "healthOfficial": (props.patient.healthOfficialFlagInfo.isFlagged ? newFlagValue=true : newFlagValue=false); break;

      default: newFlagValue=false;
    }

    setIsFlagged(newFlagValue);
  }
  
  const handlePatientInfoShow = () => {
    setShowPatientInfo(true);
    fetchPatientInfo(props.patient.uid);
  }


  let [patientData, setPatientData] = useState();
  let {currentUser} = useAuth();

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
      axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
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
      case "healthOfficial": return true;
      case "immigrationOfficial": return true;
      case "doctor": return true;
      default: return false;
    }
  }

  async function fetchPatientInfo(patientUid) {
    try {
          const response = await axios.get(`/patient/get-status-forms/${patientUid}`);
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

  const renderPatientInfo = () => {
  return patientData.map((element, index) => {
    let date = new Date(element.timestamp * 1000);
    return <Accordion.Item eventKey={index} key={index}>
            <Accordion.Header>Created on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Accordion.Header>
            <Accordion.Body>
                {Object.entries(element).map(([key, value], index) => {
                  if(currentUser.dbData.userType === 'doctor'){
                    if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp' || value.length === 0) return null;
                    if (Array.isArray(value)) {
                        return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul></div>;
                    } else return <div key={index}><strong>{key}</strong>: {value}</div>;
                  } else if(currentUser.dbData.userType === "administrator" || currentUser.dbData.userType === "immigrationOfficial") {
                    if(key === 'covidStatus') return <div><strong>Covid Status</strong>: {value}</div>
                   }else if(currentUser.dbData.userType === "healthOfficial") {
                     if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp'|| key === 'temperature'
                        || key === 'otherSymptoms' || key === 'symptomDetails' || key === 'health'
                        || value.length === 0) return null;
                    if (Array.isArray(value)) {
                        return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul></div>;
                    } else return <div key={index}><strong>{key}</strong>: {value}</div>;
                   }
                })}
            </Accordion.Body>
        </Accordion.Item>;
    })
  }

  const flagPatient = () => {
    
    var routeType;
    switch(localStorage.getItem("userType"))
    {
      case "doctor": routeType="doctor"; break;
      case "immigrationOfficial": routeType="immigration-official"; break;
      case "healthOfficial": routeType="health-official"; break;

      default: routeType="doctor";

    }
    
    var newFlagValue;
    if(isFlagged)
    {
      newFlagValue = false;
      setIsFlagged(false);
    }
    else
    {
      newFlagValue = true;
      setIsFlagged(true);
    }
    
    const info = {
    flagValue: newFlagValue,
    patientId: props.patient.uid,
  }
  try{
    const response = axios.post(`${routeType}/${currentUser.user.uid}/raise-flag`, info); 
  } catch (error){
  }
}

const [flagButtonText, setFlagButtonText] = useState("");
const changeFlagButtonText = () => {
  
  if(isFlagged) setFlagButtonText("Unflag Patient");
  else setFlagButtonText("Flag Patient");
  
};

  return (
    <div className={styles["card-container"]}>

      <Accordion.Item eventKey={props.eventKey} className={styles["patient-box"]}>
        <Accordion.Header data-testid="patient-name" closeButton><h5>{props.patient.name}</h5></Accordion.Header>
        <AccordionBody>
          <h6 data-testid="patient-dob">Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {(props.doctorName === "" ? "No Doctor Assigned" : assignedDoctor)}</h6>

          {isValidAdmin(props.userType) ? <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button> : <div></div>}
          {isValidUserForPatientInfo(props.userType) ? <Button variant="primary" onClick={handlePatientInfoShow}>Patient Information</Button> : <div></div>}


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



      {/*This is the modal for the doctor */}
      <Modal fullscreen={true} contentClassName={styles["patient-info-modal"]} data-testid="patient-info-modal" show={showPatientInfo} onHide={handlePatientInfoClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title>{props.patient.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles["patient-info-outer-container"]}>
            <Card style={{ width: '18rem', height: '100%'}} className={styles["patient-general-info-card"]}>
              &nbsp;
              <Card.Img variant="top" src={patientIcon} />
              <Card.Body>
                &nbsp;
                <Card.Title>Patient Info</Card.Title>
                <Card.Text>
                  {props.patient.name + "'s information"}
                </Card.Text>
                {isValidAdmin(props.userType) ? <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button> : <div></div>}
                <div contentClassName={styles["flag-button"]}><Button variant="danger" onClick={() => {flagPatient()}}>{flagButtonText}</Button></div>
              </Card.Body>
            </Card>
            <div className={styles["patient-info-tabs-container"]}>
            <Tabs className="tabStyle" defaultActiveKey="home" unmountOnExit={true} mountOnEnter={true}>
              <Tab eventKey="submitted-forms" title="Submitted Forms">
                {patientData ? 
                <Accordion defaultActiveKey="0">
                    {renderPatientInfo()} 
                </Accordion> : null}
              </Tab>
              <Tab eventKey="ask-questions" title="Create Patient Q/A Form">
              </Tab>
            </Tabs>
          
          </div>
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
