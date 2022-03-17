import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import moment from 'moment';
import { Accordion, Button, Modal, ListGroup, Tabs, Tab, Card, Badge} from 'react-bootstrap';
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

  let [displayRequestBadge] = useState(props.patient.wantToBeAssignedToDoctor);
  let [patientCTData, setPatientCTData] = useState([]);


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
    let newFlagValue;
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
    fetchPatientCTData();
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

  const sendContactTraceNotification = async (email) => {
    console.log(email);
    try{
      const userCheck = await axios.get(`/user/${email}/profile`);
      var user = userCheck.data;
      console.log(user)
      var response;

      if(user !== null){
        const payload = {
          patientEmail: email,
          type: "warning",
          heading: "Alert!",
          mainText: "COVID Contact Alert!",
          subText: `You may have been in contact in with someone who is COVID Positive. Please continue using CoviCare to monitor your symptoms`,
          patientUid: user.uid,
        }
        response = await axios.post(`notification/addNewNotification`, payload)
        console.log(response);
      }
      else{
        const payload = {
          
          userEmail: email,
          inviteMessage: "A user of the CoviCare system notified us of your potential contact with someone COVID Positive. You may want to join Covicare to track your health."
        
        }
        response = await axios.post(`/user/sendInviteEmail`, payload)
        console.log(response);
      }
      
    }
    catch(error){
      console.log(error.message);
    }
  }

  const fetchPatientCTData = async() =>{
    try{
      const response = await axios.get(`patient/get-contact-tracing/${props.patient.uid}`)
      setPatientCTData(response.data);
      console.log(response.data);
    }
    catch(error) {
      console.log(error.message);
    }
  }

  const RenderPatientCTData = () => {
    return patientCTData.map((element, index) => {
      let date = new Date(element.timeStamp * 1000);
      return (
        <Accordion.Item eventKey={index} key={index}>
          <Accordion.Header><h5>{"Contact Tracing Report for "+element.date}</h5></Accordion.Header>
          <Accordion.Body className={styles["patient-contact-tracing-report-body"]}>
            <h6>Created on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</h6>
            <hr />
            <h6>List of emails of people who've been in contact with {props.patient.name}:</h6>
            <div>
              {element.emailList.map((email, index) => {
                return <div className={styles["contact-tracing-person-list-box"]}>
                  {"Email: "+email}
                  {(currentUser.dbData.userType === "healthOfficial") && 
                  <Button 
                  className={styles["notify-button"]} 
                  variant="warning" onClick={() => {sendContactTraceNotification(email);}}>
                    Notify This User
                  </Button>}
                </div>
              })}
            </div>

            <hr/>
            
            <h6>Description of Contact Location: {element.locationDescription}</h6>
          </Accordion.Body>
        </Accordion.Item>
        );
      })
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
              if (Array.isArray(value) && typeof value[0] === 'object') {
                return <div key={index}>
                        <strong>Doctor questions</strong>:
                        <ul>{value.map((element, i) => <div key={i}><li>{element.question}</li><p>{element.answer}</p></div>)}</ul>
                      </div>;
              }
              if (Array.isArray(value)) {
                  return <div key={index}>
                    <strong>{key}</strong>: 
                      <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul>
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

  const [inputList, setInputList] = useState([{question: "", answer: ""}]);

  const handleQuestionInputChange = (event, index) => {
    const {name, value} = event.target;
    const list = [...inputList];
    list[index][name] = value; //updates list based on the index
    setInputList(list);
  }

  const handleAddQuestionInput = () => {
    setInputList([...inputList, {question: "", answer: ""}]); //pushing new input field to list each time this is called
  }

  const handleDeleteInput = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  }

  const submitDoctorQuestions = async (selectedFormId) => {
    try {
      // delete empty questions
      const list = inputList.filter(question => question.question !== '');
      const requestBody = {formId: selectedFormId, doctorUid: props.currentUser.user.uid, doctorQuestions: list};
      await axios.post('/doctor/question-answer', requestBody);
      setInputList([]);
    } catch (error) {
      console.log("Error sending doctor questions: ", error);
    }
  }

  return (
    <div className={styles["card-container"]}>

      <Accordion.Item eventKey={props.eventKey} className={styles["patient-box"]}>
        <Accordion.Header data-testid="patient-name" closeButton>
          <h5>{props.patient.name}</h5>
          <div className={styles["patient-box-header-badge"]}>
            <Badge pill
            bg="warning" 
            text="dark">
              {(currentUser.dbData.userType === "administrator" && displayRequestBadge && assignedDoctor === "") ? "Wants to be assigned a doctor" : null}
            </Badge>
          </div>
        </Accordion.Header>
        <AccordionBody>
          <h6 data-testid="patient-dob">Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {(assignedDoctor === "" ? "No Doctor Assigned" : assignedDoctor)}</h6>

          {isValidAdmin(props.userType) && <Button variant="primary" onClick={openDoctorList}>Assign Doctor</Button>}
          {isValidUserForPatientInfo(props.userType) && <Button variant="primary" onClick={handlePatientInfoShow}>Patient Information</Button>}
        </AccordionBody>
      </Accordion.Item>

      <Modal className={styles["doctor-list-modal"]} data-testid="doctor-list-modal" show={showDoctorList} onHide={handleDoctorListClose} animation={true} centered>
        <Modal.Header>
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
        <Modal.Header>
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
              
               {isValidDoctor() && 
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
                          name = "question"
                          placeholder = "Enter Question Here"
                          value = {item.question}
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
                      <input
                        type = "button"
                        value = "SUBMIT"
                        onClick = {() => submitDoctorQuestions(selectedFormId)}
                        className = {styles["qa-submit-button"]}
                      />
                    </div>
                  </div>
                </Tab>}

              {!isValidDoctor() &&  
               <Tab className={styles["tab-outer"]} eventKey="ctr-data" title="Contact Tracing Data">
                  <div className={styles["patient-info-tab-page"]}>
                    <h2 className={styles["patient-info-tab-title"]}>{"Contact Tracing Data"}</h2>
                    <hr />
                    <Accordion>
                    {<RenderPatientCTData />}
                    </Accordion>
                    
                  </div>
                </Tab>}
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
