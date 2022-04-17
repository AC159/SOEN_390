import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Accordion} from 'react-bootstrap';

import styles from './PatientBox.module.css';

const PatientTravelDataItem = ({element, index}) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(moment(new Date(element.timeStamp)).format('dddd, MMMM Do YYYY, h:mm:ss a'));
  }, [element]);

  return (
    <Accordion.Item eventKey={index} key={index}>
      <Accordion.Header>
        <h5>
          Travel Report for {element.date[0].startDate.slice(0, 10)} to{' '}
          {element.date[0].endDate.slice(0, 10)}
        </h5>
      </Accordion.Header>
      <Accordion.Body className={styles['patient-contact-tracing-report-body']}>
        <h6>Report created on {date}</h6>
        <hr />
        <h6>
          Travel Dates: From {element.date[0].startDate.slice(0, 10)} to{' '}
          {element.date[0].endDate.slice(0, 10)}
        </h6>
        <hr />
        <h6>Description of Travel Location: {element.locationDescription}</h6>
        <hr />
        <h6>Reason for stay {element.travelPurpose}</h6>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default PatientTravelDataItem;
