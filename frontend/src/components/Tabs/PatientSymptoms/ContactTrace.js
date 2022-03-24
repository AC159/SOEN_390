import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import {Accordion, Button} from 'react-bootstrap';

import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import useInputField from '../../../hook/useInputField';
import styles from './ContactTrace.module.css';
import useFetch from '../../../hook/useFetch';

const initialEmailsState = [{email: ''}];
const newEmail = {email: ''};

function ContactTrace(props) {
  let {currentUser} = useAuth();
  let [locationDescription, setLocationDescription] = useState('');
  let [date, setDate] = useState('');
  let [showModal, setShowModal] = useState(false);
  let [update, setUpdate] = useState(false);
  const [emails, setEmails, handleEmailFieldChange, handleAddEmailField, handleDeleteEmailField] = useInputField(initialEmailsState, newEmail);
  const [patientTracing, fetchPatientContactTracing] = useFetch([], `/patient/get-contact-tracing/${currentUser.user.uid}`);

  const submitContactTracingForm = async () => {
    try {
      const list1 = emails.filter((email) => email.email !== null);
      const list = list1.map((email) => email.email);
      const userAttributes = {
        patientUid: currentUser.user.uid,
        emailList: list,
        date: date,
        locationDescription: locationDescription,
      };
      const response = await axios.post(`/patient/submit-contact-tracing`, userAttributes);
      console.log(response);
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  useEffect(() => {
    fetchPatientContactTracing();
  }, []);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  return (
    <div>
      <Button
        variant='info'
        className={styles['submit-button-trace']}
        onClick={() => {
          openModal();
          setUpdate(false);
          setEmails(initialEmailsState);
        }}
      >
        New Contact Tracing from
      </Button>
      {patientTracing ? (
        <Accordion defaultActiveKey='0'>
          {patientTracing.map((element, index) => {
            let date = new Date(element.timeStamp);
            return (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>Created on {moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a')}</Accordion.Header>
                <Accordion.Body>
                  {Object.entries(element).map(([key, value], index) => {
                    if (key === 'timeStamp') {
                      // setTimeStamp({value})
                    }
                    if (!value || key === '_id' || key === 'patientUid' || key === 'timeStamp' || value.length === 0) return null;

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
                    } else
                      return (
                        <div key={index}>
                          <strong>{key}</strong>: {value}
                        </div>
                      );
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}{' '}
        </Accordion>
      ) : null}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title> Contact Tracing form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>The date you came in contact with them</label>
          <input type='date' defaultValue={update ? date : null} onChange={(event) => setDate(event.target.value)} />
          <label>Enter the location info</label>
          <input type='text' defaultValue={update ? locationDescription : null} onChange={(event) => setLocationDescription(event.target.value)} />
          <label>Enter all the people's email</label>
          {emails.map((value, index) => {
            return (
              <div key={index}>
                <input
                  type='email'
                  name='email'
                  placeholder='email'
                  value={value.email}
                  className={styles[emails.length !== 1 && 'email-input-trace']}
                  onChange={(event) => handleEmailFieldChange(event, index)}
                />
                {emails.length !== 1 && <input type='button' value='X' className={styles['delete-button-trace']} onClick={() => handleDeleteEmailField(index)} />}
              </div>
            );
          })}

          <div>
            <Button value='Add email' onClick={handleAddEmailField}>
              Add email
            </Button>

            <Button
              onClick={() => {
                submitContactTracingForm();
                fetchPatientContactTracing();
                closeModal();
              }}
            >
              Submit
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ContactTrace;
