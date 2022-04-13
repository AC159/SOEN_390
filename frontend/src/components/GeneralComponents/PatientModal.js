import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Accordion, Button, Modal, Card, Tabs, Tab} from 'react-bootstrap';

import {DoctorPatientInfoList, HOPatientInfoList, AdnminPatientInfoList} from './PatientInfoItem';
import useFetch from '../../hook/useFetch';
import useInputField from '../../hook/useInputField';
import PatientCTDataItem from './PatientCTDataItem';
import PatientTravelDataItem from './PatientTravelDataItem';
import patientIcon from '../../assets/patientIcon.png';
import styles from './PatientBox.module.css';
import moment from 'moment';

const initialQuestionsState = [{question: '', answer: ''}];
const newQuestion = {question: '', answer: ''};

const PatientModal = ({
  patient,
  currentUser,
  showPatientInfo,
  handlePatientInfoClose,
  openDoctorList,
}) => {
  const [isFlagged, setIsFlagged] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState('');
  const [patientCTData, fetchPatientCTData] = useFetch(
    [],
    `patient/get-contact-tracing/${patient.uid}`,
  );
  const [patientTravelData, fetchPatientTravelData] = useFetch(
    [],
    `/patient/get-traveler-forms/${patient.uid}`,
  );
  const [patientData, fetchPatientInfo] = useFetch([], `/patient/get-status-forms/${patient.uid}`);
  const [
    questions,
    setQuestions,
    handleQuestionFieldChange,
    handleAddQuestionField,
    handleDeleteQuestionField,
  ] = useInputField(initialQuestionsState, newQuestion);

  useEffect(() => {
    fetchPatientCTData();
  }, []);

  useEffect(() => {
    fetchPatientTravelData();
  }, []);

  useEffect(() => {
    fetchPatientInfo(patient.uid);
  }, []);

  useEffect(() => {
    const flagValue = {
      doctor: patient?.doctorFlagInfo?.isFlagged || false,
      immigrationOfficial: patient?.immigrationOfficerFlagInfo?.isFlagged || false,
      healthOfficial: patient?.healthOfficialFlagInfo?.isFlagged || false,
    };
    setIsFlagged(flagValue[currentUser.dbData.userType] || false);
  }, [patient]);

  const submitDoctorQuestions = async (selectedFormId) => {
    try {
      // delete empty questions
      const list = questions.filter((question) => question.question !== '');
      const requestBody = {
        formId: selectedFormId,
        doctorUid: currentUser.user.uid,
        doctorQuestions: list,
      };
      await axios.post('/doctor/question-answer', requestBody);
      setQuestions([]);
    } catch (error) {
      console.log('Error sending doctor questions: ', error);
    }
  };

  const flagPatient = () => {
    const selectRouteType = () => {
      switch (currentUser.dbData.userType) {
        case 'immigrationOfficial':
          return 'immigration-official';
        case 'healthOfficial':
          return 'health-official';
        default:
          return 'doctor';
      }
    };
    setIsFlagged(!isFlagged);

    const routeType = selectRouteType();
    const newFlagValue = !isFlagged;
    const info = {
      flagValue: newFlagValue,
      patientId: patient.uid,
    };
    try {
      axios.post(`${routeType}/${currentUser.user.uid}/raise-flag`, info);
    } catch (error) {}
  };

  const RenderPatientInfo = ({selectForm}) => {
    return patientData.map((element, index) => {
      if (currentUser.dbData.userType === 'doctor')
        return (
          <DoctorPatientInfoList
            key={index}
            element={element}
            index={index}
            isFormSelected={selectForm}
            setSelectedFormId={setSelectedFormId}
            selectedFormId={selectedFormId}
          />
        );
      if (
        currentUser.dbData.userType === 'administrator' ||
        currentUser.dbData.userType === 'immigrationOfficial'
      )
        return <AdnminPatientInfoList key={index} element={element} index={index} />;
      if (currentUser.dbData.userType === 'healthOfficial')
        return <HOPatientInfoList key={index} element={element} index={index} />;
      return <></>;
    });
  };

  return (
    <Modal
      fullscreen={true}
      contentClassName={styles['patient-info-modal']}
      data-testid='patient-info-modal'
      show={showPatientInfo}
      onHide={handlePatientInfoClose}
      animation={true}
      centered
    >
      <Modal.Header>
        <Modal.Title>{patient.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles['patient-info-outer-container']}>
          <div className={styles['patient-info-card']}>
            <Card
              style={{width: '18rem', height: '100%'}}
              className={styles['patient-general-info-card']}
            >
              <Card.Img variant='top' src={patientIcon} />
              <Card.Body>
                <Card.Title className={styles['patient-info-card-text']}>{patient.name}</Card.Title>
                <Card.Text>
                  <span className={styles['patient-info-card-userType']}>Patient</span>

                  <span
                    className={
                      patient.status === 'Negative'
                        ? styles['patient-info-card-covidStatusN']
                        : styles['patient-info-card-covidStatusP']
                    }
                  >
                    {'COVID Status: ' + patient.status}
                  </span>
                  {isFlagged && (
                    <span className={styles['patient-info-card-flagStatusY']}>
                      Patient has been flagged!
                    </span>
                  )}
                </Card.Text>
                {currentUser.dbData.userType === 'administrator' ? (
                  <Button variant='primary' onClick={openDoctorList}>
                    Assign Doctor
                  </Button>
                ) : (
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
            <Tabs
              className={styles['patient-info-tabs']}
              defaultActiveKey='submitted-forms'
              unmountOnExit={true}
              mountOnEnter={true}
            >
              <Tab eventKey='submitted-forms' title='Submitted Forms'>
                <div className={styles['patient-info-tab-page']}>
                  {patientData && (
                    <Accordion defaultActiveKey='0'>
                      <h2 className={styles['patient-info-tab-title']}>
                        {patient.name + "'s submitted forms"}
                      </h2>
                      <hr />
                      <RenderPatientInfo selectForm={false} />
                    </Accordion>
                  )}
                </div>
              </Tab>
              {currentUser.dbData.userType === 'doctor' ? (
                <Tab
                  className={styles['tab-outer']}
                  eventKey='ask-questions'
                  title='Create Patient Q/A Form'
                >
                  <div className={styles['patient-info-tab-page']}>
                    <h2 className={styles['patient-info-tab-title']}>{'Create Q&A Form'}</h2>
                    <hr />
                    <h4 className={styles['patient-info-tab-subtitle']}>
                      Choose form to respond to
                    </h4>
                    {<RenderPatientInfo selectForm={true} />}
                    <hr />
                    <h4 className={styles['patient-info-tab-subtitle']}>Create Question List</h4>
                    {questions.map((item, index) => (
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
                    ))}
                    <div className={styles['outer-qa-form-buttons']}>
                      <input
                        type='button'
                        value='Add Question'
                        className={styles['qa-add-button']}
                        onClick={handleAddQuestionField}
                      />
                      <input
                        type='button'
                        value='SUBMIT'
                        onClick={() => submitDoctorQuestions(selectedFormId)}
                        className={styles['qa-submit-button']}
                        data-testid='doctor-question-button'
                      />
                    </div>
                  </div>
                </Tab>
              ) : (
                <Tab
                  className={styles['tab-outer']}
                  eventKey='ctr-data'
                  title='Contact Tracing Data'
                >
                  <div className={styles['patient-info-tab-page']}>
                    <h2 className={styles['patient-info-tab-title']}>Contact Tracing Data</h2>
                    <hr />
                    <Accordion>
                      {patientCTData.map((element, index) => (
                        <PatientCTDataItem
                          key={index}
                          element={element}
                          index={index}
                          patientName={patient.name}
                        />
                      ))}
                    </Accordion>
                  </div>
                </Tab>
              )}
              {currentUser.dbData.userType === 'immigrationOfficial' && (
                <Tab className={styles['tab-outer']} eventKey='travel-data' title='Travel Data'>
                  <div className={styles['patient-info-tab-page']}>
                    <h2 className={styles['patient-info-tab-title']}>Travel Data</h2>
                    <hr />
                    <Accordion>
                      {patientTravelData.map((element, index) => (
                        <PatientTravelDataItem key={index} element={element} index={index} />
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
  );
};

export default PatientModal;
