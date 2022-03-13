import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import moment from 'moment';
import { Accordion, Button, Modal, ListGroup, Tabs, Tab, Card} from 'react-bootstrap';
import { Dropdown } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

import patientIcon from "../../assets/patientIcon.png";
import DoctorListItem from "./DoctorListItem";
import {useAuth} from "../Authentication/FirebaseAuth/FirebaseAuth";
import styles from "./PatientBox.module.css";


function PatientBox(props) {
  const initialDoctorInfo = {
    id: props.patient.patientInfo.doctorId ? props.patient.patientInfo.doctorId : '',
    name: props.patient.patientInfo.doctor
  };

  const [showDoctorList, setShowDoctorList] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);
  const [showPatientInfo, setShowPatientInfo] = useState(false)
  const [isFlagged, setIsFlagged] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo);
  const [selectedFormId, setSelectedFormId] = useState("");


  const handleDoctorListClose = useCallback(() => {
    setDoctorInfo(initialDoctorInfo);
    setShowDoctorList(false);
  }, []);

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
    switch(localStorage.getItem("userType")) {
      case "doctor": newFlagValue = props.patient.doctorFlagInfo.isFlagged; break;
      case "immigrationOfficial": newFlagValue = props.patient.immigrationOfficerFlagInfo.isFlagged; break;
      case "healthOfficial": newFlagValue = props.patient.healthOfficialFlagInfo.isFlagged; break;
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
    setShowDoctorList(true);
    fetchDoctorList();
  }

  const fetchDoctorList = async () => {
    try {
      const response = await axios.get(`admin/${props.currentUser.user.uid}/doctors`);
      setDoctorList(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  const assignDoctorToPatient = useCallback(() => {
    const pair = {
      patient:props.patient.uid,
      doctor: doctorInfo.id,
      adminID: props.currentUser.uid,
      doctorName: doctorInfo.name
    }
    try {
      axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
    } catch (error) {
      console.log(error);
    }
    setAssignedDoctor(doctorInfo.name); 
    handleDoctorListClose();
  }, [doctorInfo.id, doctorInfo.name, handleDoctorListClose, props.currentUser.uid,
    props.currentUser.user.uid, props.patient.uid])

  function isValidAdmin(currentUserType){
    return currentUserType === 'administrator';
  }

  function isValidDoctor(){
    return localStorage.getItem("userType") === 'doctor';
  }

  function isValidUserForPatientInfo(currentUserType){
    switch(currentUserType){
      case "administrator":
      case "healthOfficial":
      case "immigrationOfficial":
      case "doctor": return true;
      default: return false;
    }
  }

  async function fetchPatientInfo(patientUid) {
    try {
      const response = await axios.get(`/patient/get-status-forms/${patientUid}`);
      setPatientData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log('Unable to fetch patient status forms: ', error);
    }
  }

  const RenderDoctorList = () => {
    return <ListGroup>
      {doctorList.map((doctor) => 
        <DoctorListItem
          doctor={doctor}
          setDoctorInfo={setDoctorInfo}
          selected={doctorInfo.id === doctor.uid}
        />)}
    </ListGroup>;
  }

  const FormSelect = (formId) => {
    setSelectedFormId(formId);
  }

  const RenderPatientInfo = (selectForm) => {
  return patientData.map((element, index) => {
    let date = new Date(element.timestamp * 1000);
    return (
      <Accordion.Item eventKey={index} key={index}>
        <Accordion.Header>Created on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Accordion.Header>
        <Accordion.Body>
          {Object.entries(element).map(([key, value], index) => {
            if(currentUser.dbData.userType === 'doctor'){
              if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp' || value.length === 0) return null;
              if (Array.isArray(value)) {
                  return <div key={index}>
                    <strong>{key}</strong>: 
                      <ul>{value.map((element, i) => <li key={i}>{element}</li>)}
                      </ul>
                    </div>;
              } else return <div key={index}><strong>{key}</strong>: {value}</div>;
            } else if (currentUser.dbData.userType === "administrator" || currentUser.dbData.userType === "immigrationOfficial") {
              if(key === 'covidStatus') return <div><strong>Covid Status</strong>: {value}</div>
            } else if (currentUser.dbData.userType === "healthOfficial") {
              if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp'|| key === 'temperature'
                  || key === 'otherSymptoms' || key === 'symptomDetails' || key === 'health'
                  || value.length === 0) return null;
              if (Array.isArray(value)) {
                  return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul></div>;
              } else return <div key={index}><strong>{key}</strong>: {value}</div>;
            }
          })}
          {(currentUser.dbData.userType === 'doctor') ? 
            ((selectForm["selectForm"] === true) ?  
            <Button className={styles["form-select-button"]} 
            onClick={(e)=>{FormSelect(element._id);}} 
            variant={(selectedFormId === element._id) ? "primary" : "outline-primary"}>
              {(selectedFormId === element._id) ? "Selected" : "Select this form"}
            </Button>
            : null )
          : null}
          
        </Accordion.Body>
      </Accordion.Item>
      );
    })
  }

  const flagPatient = () => {
    const selectRouteType = () => {
      switch(localStorage.getItem("userType")) {
        case "immigrationOfficial": return "immigration-official";
        case "healthOfficial": return "health-official";
        default: return "doctor";
      }
    }

    if(isFlagged) {
      setIsFlagged(false);
    } else {
      setIsFlagged(true);
    }

    const routeType = selectRouteType();
    const newFlagValue = !isFlagged;
    const info = {
      flagValue: newFlagValue,
      patientId: props.patient.uid,
    }
    try{
      axios.post(`${routeType}/${currentUser.user.uid}/raise-flag`, info); 
    } catch (error){
  }
}

  const [flagButtonText, setFlagButtonText] = useState("");
  const changeFlagButtonText = () => {
    if (isFlagged) setFlagButtonText("Unflag Patient");
    else setFlagButtonText("Flag Patient");
  };

  const [inputList, setInputList] = useState([
    { questionInput: "" },
  ]);

  const handleQuestionInputChange = (event, index) => {
    const {name, value} = event.target;
    const list = [...inputList];
    list[index][name] = value; //updates list based on the index
    setInputList(list);
  }

  const handleAddQuestionInput = () => {
    setInputList([...inputList, { questionInput: "" }]); //pushing new input field to list each time this is called
  }

  const handleDeleteInput = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  }

  return (
    <div className={styles["card-container"]}>

      <Accordion.Item eventKey={props.eventKey} className={styles["patient-box"]}>
        <Accordion.Header data-testid="patient-name" closeButton><h5>{props.patient.name}</h5></Accordion.Header>
        <AccordionBody>
          <h6 data-testid="patient-dob">Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {(assignedDoctor === "" ? "No Doctor Assigned" : assignedDoctor)}</h6>

          {isValidAdmin(props.userType) && <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button>}
          {isValidUserForPatientInfo(props.userType) && <Button variant="primary" onClick={handlePatientInfoShow}>Patient Information</Button>}
        </AccordionBody>
      </Accordion.Item>

      <Modal className={styles["doctor-list-modal"]} data-testid="doctor-list-modal" show={showDoctorList} onHide={handleDoctorListClose} animation={true} centered>
        <Modal.Header closeButton>
          <Modal.Title>Doctors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RenderDoctorList />
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
            <div className={styles["patient-info-card"]}>
              <Card style={{ width: '18rem', height: '100%'}} className={styles["patient-general-info-card"]}>
                &nbsp;
                <Card.Img variant="top" src={patientIcon} />
                <Card.Body>
                  &nbsp;
                  <Card.Title className={styles["patient-info-card-text"]}>{props.patient.name}</Card.Title>
                  <Card.Text>
                    <p className={styles["patient-info-card-userType"]}>{"Patient"}</p>
                    <p className={(props.patient.covidStatus === "Negative") ? styles["patient-info-card-covidStatusN"] : styles["patient-info-card-covidStatusP"]}>{"COVID Status: "+props.patient.covidStatus}</p>
                    <p className={(isFlagged) ? styles["patient-info-card-flagStatusY"] : styles["patient-info-card-flagStatusN"]}>{(isFlagged) ? "Patient has been flagged!" : ""}</p>
                  </Card.Text>
                  {isValidAdmin(props.userType) && <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button>}
                  {isValidAdmin(localStorage.getItem("userType")) ? null : <Button bsClass={styles["flag-button"]} variant="danger" onClick={() => {flagPatient()}}>{flagButtonText}</Button>}
                </Card.Body>
              </Card>
            </div>
            <div className={styles["patient-info-tabs-container"]}>
              <Tabs className={styles["patient-info-tabs"]} defaultActiveKey="submitted-forms" unmountOnExit={true} mountOnEnter={true}>
                <Tab eventKey="submitted-forms" title="Submitted Forms">
                  <div className={styles["patient-info-tab-page"]}>
                    {patientData && (
                      <Accordion defaultActiveKey="0">
                        <h2 className={styles["patient-info-tab-title"]}>{props.patient.name+"'s submitted forms"}</h2>
                        <hr />
                        <RenderPatientInfo selectForm={false} /> 
                      </Accordion>)}
                  </div>
                </Tab>
              
               {isValidDoctor() ?  
               <Tab className={styles["tab-outer"]} eventKey="ask-questions" title="Create Patient Q/A Form">
                  <div className={styles["patient-info-tab-page"]}>
                    <h2 className={styles["patient-info-tab-title"]}>{"Create Q&A Form"}</h2>
                    <hr />
                    <h4 className={styles["patient-info-tab-subtitle"]}>Choose form to respond to</h4>
                    {<RenderPatientInfo selectForm={true}/>} 
                    <hr />
                    <h4 className={styles["patient-info-tab-subtitle"]}>Create Question List</h4>

                    {inputList.map((item, index) => {
                      return (
                        <div key ={index} className={styles["qa-form"]}>
                        <input 
                          type = "text"
                          name = "questionInput"
                          placeholder = "Enter Question Here"
                          value = {item.questionInput}
                          onChange = {event => handleQuestionInputChange(event, index)}
                          className={styles["question-input-field"]}
                        />
                        {inputList.length !== 1 && <input
                          type = "button"
                          value = "X"
                          className = {styles["qa-delete-button"]}
                          onClick = {() => handleDeleteInput(index)} //passing index here as we want to delete a specific question
                        />}
                      </div>
                      )
                    })}
                    <div className = {styles["outer-qa-form-buttons"]}>
                      <input 
                        type = "button"
                        value = "Add Question"
                        className = {styles["qa-add-button"]}
                        onClick = {handleAddQuestionInput}
                      />
                      <input //TODO: post form
                        type = "button"
                        value = "SUBMIT"
                        onClick = {() => {console.log(selectedFormId)}}
                        className = {styles["qa-submit-button"]}
                      />
                    </div>
                  </div>
                </Tab> :
                null}
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
