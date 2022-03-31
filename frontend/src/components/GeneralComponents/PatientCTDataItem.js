import React, {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import {Accordion, Button} from 'react-bootstrap';

import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import styles from './PatientBox.module.css';

const PatientCTDataItem = ({element, index, patientName}) => {
  const {currentUser} = useAuth();
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(moment(new Date(element.timeStamp)).format('dddd, MMMM Do YYYY, h:mm:ss a'));
  }, [element]);

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
          inviteMessage:
            'A user of the CoviCare system notified us of your potential contact with someone COVID Positive. You may want to join Covicare to track your health.',
        };
        response = await axios.post(`/user/sendInviteEmail`, payload);
        console.log(response);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
