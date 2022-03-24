import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {Accordion, Button, Modal, ListGroup, Tabs, Tab, Card, Badge} from 'react-bootstrap';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';

import patientIcon from '../../assets/patientIcon.png';
import DoctorListItem from './DoctorListItem';
import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import {DoctorPatientInfoList, HOPatientInfoList, AdnminPatientInfoList} from './PatientInfoItem';
import PatientCTDataItem from './PatientCTDataItem';
import useInputField from '../../hook/useInputField';
import useFetch from '../../hook/useFetch';
import styles from './PatientBox.module.css';

const initialQuestionsState = [{question: '', answer: ''}];
const newQuestion = {question: '', answer: ''};

function PatientBox(props) {
  const initialDoctorInfo = {
    id: props.patient.patientInfo.doctorId || '',
    name: props.patient.patientInfo.doctor,
  };

  // TODO: Create a single state object
  const {currentUser} = useAuth();
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [displayRequestBadge] = useState(props.patient.wantToBeAssignedToDoctor);

  const [questions, setQuestions, handleQuestionFieldChange, handleAddQuestionField, handleDeleteQuestionField] = useInputField(initialQuestionsState, newQuestion);
  const [doctorList, fetchDoctorList] = useFetch([], `admin/${props.currentUser.user.uid}/doctors`);
  const [patientCTData, fetchPatientCTData] = useFetch([], `patient/get-contact-tracing/${props.patient.uid}`);
  const [patientData, fetchPatientInfo] = useFetch([], `/patient/get-status-forms/${props.patient.uid}`);

  const handleDoctorListClose = useCallback(() => {
    setDoctorInfo(initialDoctorInfo);
    setShowDoctorList(false);
  }, []);

  const handlePatientInfoClose = () => {
    setShowPatientInfo(false);
  };

  useEffect(() => {
    checkIsFlagged();
  }, []);

  const checkIsFlagged = () => {
    const flagValue = {
      doctor: props?.patient?.doctorFlagInfo?.isFlagged || false,
      immigrationOfficial: props?.patient?.immigrationOfficerFlagInfo?.isFlagged || false,
      healthOfficial: props?.patient?.healthOfficialFlagInfo?.isFlagged || false,
    };
    setIsFlagged(flagValue[localStorage.getItem('userType')] || false);
  };

  const handlePatientInfoShow = () => {
    setShowPatientInfo(true);
    fetchPatientInfo(props.patient.uid);
    fetchPatientCTData();
  };

  const openDoctorList = () => {
    setShowDoctorList(true);
    fetchDoctorList();
  };

  const assignDoctorToPatient = useCallback(() => {
    const pair = {
      patient: props.patient.uid,
      doctor: doctorInfo.id,
      adminID: props.currentUser.uid,
      doctorName: doctorInfo.name,
    };
    try {
      axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
    } catch (error) {
      console.log(error);
    }
    setAssignedDoctor(doctorInfo.name);
    handleDoctorListClose();
  }, [doctorInfo.id, doctorInfo.name, handleDoctorListClose, props.currentUser.uid, props.currentUser.user.uid, props.patient.uid]);

  function isValidAdmin(currentUserType) {
    return currentUserType === 'administrator';
  }

  function isValidDoctor() {
    return localStorage.getItem('userType') === 'doctor';
  }

  function isValidUserForPatientInfo(currentUserType) {
    switch (currentUserType) {
      case 'administrator':
      case 'healthOfficial':
      case 'immigrationOfficial':
      case 'doctor':
        return true;
      default:
        return false;
    }
  }

  const sendContactTraceNotification = async (email) => {
    try {
      const userCheck = await axios.get(`/user/${email}/profile`);
      var user = userCheck.data;
      var response;

      if (user !== null) {
        const payload = {
          patientEmail: email,
          type: 'warning',
          heading: 'Alert!',
          mainText: 'COVID Contact Alert!',
          subText: `You may have been in contact in with someone who is COVID Positive. Please continue using CoviCare to monitor your symptoms`,
          patientUid: user.uid,
        };
        response = await axios.post(`notification/addNewNotification`, payload);
        console.log(response);
      } else {
        const payload = {
          userEmail: email,
          inviteMessage: 'A user of the CoviCare system notified us of your potential contact with someone COVID Positive. You may want to join Covicare to track your health.',
        };
        response = await axios.post(`/user/sendInviteEmail`, payload);
        console.log(response);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const RenderPatientInfo = ({isFormSelected}) => {
    return patientData.map((element, index) => {
      if (currentUser.dbData.userType === 'doctor')
        return <DoctorPatientInfoList element={element} index={index} isFormSelected={isFormSelected} setSelectedFormId={setSelectedFormId} selectedFormId={selectedFormId} />;
      if (currentUser.dbData.userType === 'administrator' || currentUser.dbData.userType === 'immigrationOfficial') return <AdnminPatientInfoList element={element} index={index} />;
      if (currentUser.dbData.userType === 'healthOfficial') return <HOPatientInfoList element={element} index={index} />;
      return <></>;
    });
  };

  const flagPatient = () => {
    const selectRouteType = () => {
      switch (localStorage.getItem('userType')) {
        case 'immigrationOfficial':
          return 'immigration-official';
        case 'healthOfficial':
          return 'health-official';
        default:
          return 'doctor';
      }
    };

    if (isFlagged) {
      setIsFlagged(false);
    } else {
      setIsFlagged(true);
    }

    const routeType = selectRouteType();
    const newFlagValue = !isFlagged;
    const info = {
      flagValue: newFlagValue,
      patientId: props.patient.uid,
    };
    try {
      axios.post(`${routeType}/${currentUser.user.uid}/raise-flag`, info);
    } catch (error) {}
  };

  const submitDoctorQuestions = async (selectedFormId) => {
    try {
      // delete empty questions
      const list = questions.filter((question) => question.question !== '');
      const requestBody = {
        formId: selectedFormId,
        doctorUid: props.currentUser.user.uid,
        doctorQuestions: list,
      };
      await axios.post('/doctor/question-answer', requestBody);
      setQuestions([]);
    } catch (error) {
      console.log('Error sending doctor questions: ', error);
    }
  };

  return (
    <div className={styles['card-container']}>
      <Accordion.Item eventKey={props.eventKey} className={styles['patient-box']}>
        <Accordion.Header data-testid='patient-name' closeButton>
          <h5>{props.patient.name}</h5>
          <div className={styles['patient-box-header-badge']}>
            {currentUser.dbData.userType === 'administrator' && displayRequestBadge && assignedDoctor === '' && (
              <Badge pill bg='warning' text='dark'>
                Wants to be assigned a doctor
              </Badge>
            )}
          </div>
        </Accordion.Header>
        <AccordionBody>
          <h6 data-testid='patient-dob'>Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {assignedDoctor === '' ? 'No Doctor Assigned' : assignedDoctor}</h6>

          {isValidAdmin(props.userType) && (
            <Button variant='primary' onClick={openDoctorList}>
              Assign Doctor
            </Button>
          )}
          {isValidUserForPatientInfo(props.userType) && (
            <Button variant='primary' onClick={handlePatientInfoShow}>
              Patient Information
            </Button>
          )}
        </AccordionBody>
      </Accordion.Item>

      <Modal className={styles['doctor-list-modal']} data-testid='doctor-list-modal' show={showDoctorList} onHide={handleDoctorListClose} animation={true} centered>
        <Modal.Header>
          <Modal.Title>Doctors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {doctorList.map((doctor) => (
              <DoctorListItem doctor={doctor} setDoctorInfo={setDoctorInfo} selected={doctorInfo.id === doctor.uid} />
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleDoctorListClose}>
            Close
          </Button>
          <Button variant='primary' onClick={assignDoctorToPatient}>
            Assign to {props.patient.name}
          </Button>
        </Modal.Footer>
      </Modal>

      {/*This is the modal for the doctor */}
      <Modal fullscreen={true} contentClassName={styles['patient-info-modal']} data-testid='patient-info-modal' show={showPatientInfo} onHide={handlePatientInfoClose} animation={true} centered>
        <Modal.Header>
          <Modal.Title>{props.patient.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles['patient-info-outer-container']}>
            <div className={styles['patient-info-card']}>
              <Card style={{width: '18rem', height: '100%'}} className={styles['patient-general-info-card']}>
                &nbsp;
                <Card.Img variant='top' src={patientIcon} />
                <Card.Body>
                  &nbsp;
                  <Card.Title className={styles['patient-info-card-text']}>{props.patient.name}</Card.Title>
                  <Card.Text>
                    <p className={styles['patient-info-card-userType']}>Patient</p>

                    <p className={props.patient.covidStatus === 'Negative' ? styles['patient-info-card-covidStatusN'] : styles['patient-info-card-covidStatusP']}>
                      {'COVID Status: ' + props.patient.covidStatus}
                    </p>
                    {isFlagged && <p className={styles['patient-info-card-flagStatusY']}>Patient has been flagged!</p>}
                  </Card.Text>
                  {isValidAdmin(props.userType) && (
                    <Button variant='primary' onClick={openDoctorList}>
                      Assign Doctor
                    </Button>
                  )}
                  {!isValidAdmin(localStorage.getItem('userType')) && (
                    <Button
                      bsClass={styles['flag-button']}
                      variant='danger'
                      onClick={() => {
                        flagPatient();
                      }}
                    >
                      {isFlagged ? 'Unflag' : 'Flag'} Patient
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </div>
            <div className={styles['patient-info-tabs-container']}>
              <Tabs className={styles['patient-info-tabs']} defaultActiveKey='submitted-forms' unmountOnExit={true} mountOnEnter={true}>
                <Tab eventKey='submitted-forms' title='Submitted Forms'>
                  <div className={styles['patient-info-tab-page']}>
                    {patientData && (
                      <Accordion defaultActiveKey='0'>
                        <h2 className={styles['patient-info-tab-title']}>{props.patient.name + "'s submitted forms"}</h2>
                        <hr />
                        <RenderPatientInfo selectForm={false} />
                      </Accordion>
                    )}
                  </div>
                </Tab>

                {isValidDoctor() && (
                  <Tab className={styles['tab-outer']} eventKey='ask-questions' title='Create Patient Q/A Form'>
                    <div className={styles['patient-info-tab-page']}>
                      <h2 className={styles['patient-info-tab-title']}>{'Create Q&A Form'}</h2>
                      <hr />
                      <h4 className={styles['patient-info-tab-subtitle']}>Choose form to respond to</h4>
                      {<RenderPatientInfo selectForm={true} />}
                      <hr />
                      <h4 className={styles['patient-info-tab-subtitle']}>Create Question List</h4>
                      {questions.map((item, index) => {
                        return (
                          <div key={index} className={styles['qa-form']}>
                            <input
                              type='text'
                              name='question'
                              placeholder='Enter Question Here'
                              value={item.question}
                              onChange={(event) => handleQuestionFieldChange(event, index)}
                              className={styles['question-input-field']}
                            />
                            {questions.length !== 1 && (
                              <input
                                type='button'
                                value='X'
                                className={styles['qa-delete-button']}
                                onClick={() => handleDeleteQuestionField(index)} //passing index here as we want to delete a specific question
                              />
                            )}
                          </div>
                        );
                      })}
                      <div className={styles['outer-qa-form-buttons']}>
                        <input type='button' value='Add Question' className={styles['qa-add-button']} onClick={handleAddQuestionField} />
                        <input type='button' value='SUBMIT' onClick={() => submitDoctorQuestions(selectedFormId)} className={styles['qa-submit-button']} />
                      </div>
                    </div>
                  </Tab>
                )}

                {!isValidDoctor() && (
                  <Tab className={styles['tab-outer']} eventKey='ctr-data' title='Contact Tracing Data'>
                    <div className={styles['patient-info-tab-page']}>
                      <h2 className={styles['patient-info-tab-title']}>{'Contact Tracing Data'}</h2>
                      <hr />
                      <Accordion>
                        {patientCTData.map((element, index) => (
                          <PatientCTDataItem element={element} index={index} patientName={props.patient.name} sendContactTraceNotification={sendContactTraceNotification} />
                        ))}
                      </Accordion>
                    </div>
                  </Tab>
                )}
              </Tabs>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handlePatientInfoClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PatientBox;
