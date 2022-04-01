import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import {Accordion, Button} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import Checkbox from './Checkbox';
import symptoms from './text';
import styles from './CovidFile.module.css';
import useFetch from '../../../hook/useFetch';

const COVID_STATUS = ['None', 'Not tested', 'Positive', 'Negative'];

function CovidFile(props) {
  let {currentUser} = useAuth();
  let [covidStat, setCovidStat] = useState('');
  let [haveSymptoms, setHaveSymptoms] = useState(false);
  let [userSymptoms, setUserSymptoms] = useState([]);
  let [haveFever, setHaveFever] = useState(false);
  let [temp, setTemp] = useState('');
  let [other, setOther] = useState(false);
  let [whatOtherSymptoms, setWhatOtherSymptoms] = useState('');
  let [symptomDetails, setSymptomDetails] = useState('');
  let [health, setHealth] = useState('');
  let [showModal, setShowModal] = useState(false);
  let [selectedFormIndex, setSelectedFormIndex] = useState(-1);
  let [patientAnswers, setPatientAnswers] = useState([]);

  const [patientData, fetchPatientForm] = useFetch(
    [],
    `/patient/get-status-forms/${currentUser.user.uid}`,
  );

  const submitPatientForm = async () => {
    try {
      const userAttributes = {
        patientUid: currentUser.user.uid,
        covidStatus: covidStat,
        symptoms: userSymptoms,
        temperature: temp,
        otherSymptoms: whatOtherSymptoms,
        symptomDetails: symptomDetails,
        health: health,
      };
      const response = await axios.post(`/patient/submit-status-form`, userAttributes);
      console.log(response);
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  const updatePatientForm = async () => {
    const userAttributes = {
      _id: patientData[selectedFormIndex]._id,
      patientUid: currentUser.user.uid,
      covidStatus: covidStat,
      symptoms: userSymptoms,
      temperature: temp,
      otherSymptoms: whatOtherSymptoms,
      symptomDetails: symptomDetails,
      health: health,
      doctorQuestions: patientAnswers,
    };
    console.log(userAttributes);
    axios
      .post(`/patient/update-status-form/${currentUser.user.uid}`, userAttributes)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    setSelectedFormIndex(-1);
  };

  useEffect(() => {
    fetchPatientForm();
  }, []);

  const updatePatientAnswer = (value, index) => {
    patientAnswers[index].answer = value;
    setPatientAnswers(patientAnswers);
  };

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const showModalForCovidFormUpdate = (formIndex) => {
    console.log(formIndex);
    setCovidStat(patientData[formIndex].covidStatus);
    setHaveSymptoms(patientData[formIndex].symptoms.length > 0 ? true : false);
    setUserSymptoms(patientData[formIndex].symptoms);
    setHaveFever(!!patientData[formIndex].temperature);
    setTemp(patientData[formIndex].temperature);
    setOther(!!patientData[formIndex].otherSymptoms);
    setWhatOtherSymptoms(patientData[formIndex].otherSymptoms);
    setSymptomDetails(patientData[formIndex].symptomDetails);
    setHealth(patientData[formIndex].health);
    if (patientData[formIndex].doctorQuestions) {
      setPatientAnswers(JSON.parse(JSON.stringify(patientData[formIndex].doctorQuestions)));
    }
    setSelectedFormIndex(formIndex);
    openModal();
  };

  const showCovidFormModalNew = () => {
    setCovidStat('');
    setHaveSymptoms(false);
    setUserSymptoms([]);
    setHaveFever(false);
    setTemp('');
    setOther(false);
    setWhatOtherSymptoms('');
    setSymptomDetails('');
    setHealth('');
    setPatientAnswers([]);
    setSelectedFormIndex(-1);
    openModal();
  };

  function removeUnchecked(value) {
    const index = userSymptoms.indexOf(value);
    if (index !== -1) {
      userSymptoms.splice(index, 1);
    }
  }

  console.log(patientData);

  return (
    <div>
      <Button variant='info' onClick={showCovidFormModalNew}>
        New form
      </Button>
      {patientData && (
        <Accordion defaultActiveKey='0'>
          {patientData.map((element, index) => {
            let date = new Date(element.timestamp * 1000);
            return (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>
                  Created on {moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                </Accordion.Header>
                <Accordion.Body>
                  {Object.entries(element).map(([key, value], index) => {
                    if (
                      !value ||
                      key === '_id' ||
                      key === 'patientUid' ||
                      key === 'timestamp' ||
                      value.length === 0
                    )
                      return null;
                    if (Array.isArray(value) && typeof value[0] === 'object') {
                      return (
                        <div key={index}>
                          <strong>Doctor questions</strong>:
                          <ul>
                            {value.map((element, i) => (
                              <div key={i}>
                                <li>{element.question}</li>
                                <p>{element.answer}</p>
                              </div>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    if (Array.isArray(value)) {
                      return (
                        <div key={index}>
                          <strong>{key}</strong>:{' '}
                          <ul>
                            {value.map((element, i) => (
                              <li key={i}>{element}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                    return (
                      <div key={index}>
                        <strong>{key}</strong>: {value}
                      </div>
                    );
                  })}
                  <Button variant='info' onClick={() => showModalForCovidFormUpdate(index)}>
                    Update
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}{' '}
        </Accordion>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedFormIndex >= 0 ? 'Update a ' : 'Create a new '} covid status form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <h6>Select your Covid Status:</h6>
            <select
              value={covidStat}
              onChange={(event) => {
                setCovidStat(event.target.value);
                if (event.target.value === 'None') {
                  setUserSymptoms([]);
                  setTemp('');
                  setWhatOtherSymptoms('');
                  setSymptomDetails('');
                }
              }}
            >
              {COVID_STATUS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <br />

            <h6>Do you have any symptoms:</h6>
            <select
              value={haveSymptoms}
              onChange={(event) => {
                const value = event.target.value === 'true';
                setHaveSymptoms(value);
                if (!value) {
                  setUserSymptoms([]);
                }
              }}
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
            {haveSymptoms && (
              <>
                <br />
                <h6>Select all the Symptoms you feel:</h6>
                {Object.entries(symptoms).map(([type, desc], _) => (
                  <Checkbox
                    key={type}
                    id={type}
                    name='symptoms'
                    value={desc}
                    defaultChecked={userSymptoms.indexOf(desc) >= 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setUserSymptoms([...userSymptoms, e.target.value]);
                        if (type === 'fever') setHaveFever(true);
                      } else {
                        removeUnchecked(e.target.value);
                        if (type === 'fever') setHaveFever(false);
                      }
                    }}
                  />
                ))}
              </>
            )}
            {haveFever && (
              <>
                <br />
                <h6>What is your temperature?</h6>
                <input
                  type='number'
                  defaultValue={
                    selectedFormIndex >= 0 ? patientData[selectedFormIndex].temperature : null
                  }
                  min={0}
                  step='.01'
                  onChange={(e) => setTemp(e.target.value)}
                />
              </>
            )}

            {other && (
              <>
                <br />
                <h6>What are the other symptoms?</h6>
                <textarea
                  rows='4'
                  cols='50'
                  defaultValue={
                    selectedFormIndex >= 0 ? patientData[selectedFormIndex].otherSymptoms : null
                  }
                  onChange={(e) => setWhatOtherSymptoms(e.target.value)}
                />
              </>
            )}
            {haveSymptoms && (
              <>
                <br />
                <h6>Anything to add about your symptoms?</h6>
                <textarea
                  rows='4'
                  cols='50'
                  defaultValue={
                    selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptomDetails : null
                  }
                  onChange={(e) => setSymptomDetails(e.target.value)}
                />
              </>
            )}

            <br />
            <h6>Anything to add about your health?</h6>
            <textarea
              rows='4'
              cols='50'
              defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].health : null}
              onChange={(e) => setHealth(e.target.value)}
            />

            {patientAnswers.length > 0 && (
              <>
                <h6>Questions from your doctor:</h6>
                <div>
                  {patientAnswers.map((question, index) => {
                    return (
                      <div key={index}>
                        <h6>{question.question}</h6>
                        <textarea
                          rows='4'
                          cols='50'
                          defaultValue={question.answer}
                          onChange={(e) => updatePatientAnswer(e.target.value, index)}
                        />
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className={styles['visible_CovidFile']}
            data-testid='form-button-action'
            onClick={async (event) => {
              selectedFormIndex >= 0 ? await updatePatientForm() : await submitPatientForm();
              await fetchPatientForm();
              closeModal();
            }}
          >
            {selectedFormIndex >= 0 ? 'update' : 'submit'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CovidFile;
