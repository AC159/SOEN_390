import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Accordion, Button} from 'react-bootstrap';

import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import styles from './PatientBox.module.css';

const PatientCTDataItem = ({element, index, patientName, sendContactTraceNotification}) => {
  const {currentUser} = useAuth();
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(moment(new Date(element.timeStamp * 1000)).format('dddd, MMMM Do YYYY, h:mm:ss a'));
  }, [element]);

  return (
    <Accordion.Item eventKey={index} key={index}>
      <Accordion.Header>
        <h5>Contact Tracing Report for {element.date}</h5>
      </Accordion.Header>
      <Accordion.Body className={styles['patient-contact-tracing-report-body']}>
        <h6>Created on {date}</h6>
        <hr />
        <h6>List of emails of people who've been in contact with {patientName}:</h6>
        <div>
          {element.emailList.map((email, index) => (
            <div key={index} className={styles['contact-tracing-person-list-box']}>
              {'Email: ' + email}
              {currentUser.dbData.userType === 'healthOfficial' && (
                <Button
                  className={styles['notify-button']}
                  variant='warning'
                  onClick={() => {
                    sendContactTraceNotification(email);
                  }}
                >
                  Notify This User
                </Button>
              )}
            </div>
          ))}
        </div>
        <hr />
        <h6>Description of Contact Location: {element.locationDescription}</h6>
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default PatientCTDataItem;
