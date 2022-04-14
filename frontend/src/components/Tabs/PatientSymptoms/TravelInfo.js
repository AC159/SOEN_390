import React, {useEffect, useState} from 'react';
import axios from 'axios';
import moment from 'moment';
import {DateRange} from 'react-date-range';
import {Accordion, Button, Modal} from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import styles from './ContactTrace.module.css';

function TravelInfo() {
  let {currentUser} = useAuth();
  let [showModal, setShowModal] = useState(false);
  let [vacationLocation, setVacationLocation] = useState('');
  let [travelPurpose, setTravelPurpose] = useState('');
  let [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);
  let [travelInfo, setTravelInfo] = useState('');

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  const submitTravelForm = async () => {
    try {
      const userTravelData = {
        patientUid: currentUser.user.uid,
        date: date,
        locationDescription: vacationLocation,
        travelPurpose: travelPurpose,
      };
      const response = await axios.post(`/patient/submit-traveler-form`, userTravelData);
      console.log(response);
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  const fetchTravelForm = async () => {
    try {
      const response = await axios.get(`/patient/get-traveler-form/${currentUser.user.uid}`);
      console.log(response);
      setTravelInfo(response.data);
    } catch (error) {
      console.log('Unable to fetch patient travel forms: ', error);
    }
  };

  useEffect(() => {
    fetchTravelForm();
  }, []);

  return (
    <div>
      <Button
        variant='info'
        className={styles['submit-button-trace']}
        onClick={() => {
          openModal();
        }}
      >
        New Travel Form
      </Button>
      {travelInfo && (
        <Accordion defaultActiveKey='0'>
          {travelInfo.map((element, index) => {
            let date = new Date(element.timeStamp);
            return (
              <Accordion.Item eventKey={index} key={index}>
                <Accordion.Header>
                  Travel Report for {element.date[0].startDate.slice(0, 10)} to{' '}
                  {element.date[0].endDate.slice(0, 10)}
                </Accordion.Header>
                <Accordion.Body>
                  {Object.entries(element).map(([key, value], index) => {
                    if (
                      !value ||
                      key === '_id' ||
                      key === 'patientUid' ||
                      key === 'timeStamp' ||
                      value.length === 0
                    )
                      return null;
                    if (key === 'date') {
                      return (
                        <div key={key}>
                          <div>
                            <strong>Report created on: </strong>
                            {moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
                          </div>
                          <div>
                            <strong>Start date:</strong> {value[0].startDate.slice(0, 10)}
                          </div>
                          <div>
                            <strong>End date:</strong> {value[0].endDate.slice(0, 10)}
                          </div>
                        </div>
                      );
                    }
                    if (key === 'locationDescription') {
                      return (
                        <div key={key}>
                          {' '}
                          <strong> Location Description: </strong> {value}
                        </div>
                      );
                    }
                    if (key === 'travelPurpose') {
                      return (
                        <div key={key}>
                          <strong>Purpose of Travel: </strong> {value}
                        </div>
                      );
                    } else return null;
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}{' '}
        </Accordion>
      )}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Travel Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Enter the start and end date of your travel</label>
          <div>
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
            />
          </div>
          <label>Enter the destination you traveled/are traveling to</label>
          <input
            type='text'
            data-testid='location-input'
            placeholder='country, province, city'
            onChange={(event) => setVacationLocation(event.target.value)}
          />
          <label>Enter the reason for your stay</label>
          <input
            type='text'
            data-testid='purpose-input'
            placeholder='Reason for stay'
            onChange={(event) => setTravelPurpose(event.target.value)}
          />
          <Button
            onClick={(event) => {
              submitTravelForm();
              closeModal();
            }}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TravelInfo;
