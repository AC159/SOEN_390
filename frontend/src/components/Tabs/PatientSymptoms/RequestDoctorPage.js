import React, {useEffect, useState} from 'react';
import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';
import styles from './RequestDoctorPage.module.css';
import {Button} from 'react-bootstrap';

function RequestDoctorPage(props) {
  let {currentUser} = useAuth();
  let [requestSent, setRequestSent] = useState();

  useEffect(() => {
    fetchPatientInfo();
  }, []);

  const fetchPatientInfo = async () => {
    try {
      const response = await axios.get(`/user/${currentUser.user.uid}/profile`);
      console.log(response.data);
      setRequestSent(response.data.wantToBeAssignedToDoctor);
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  const requestDoctor = async () => {
    var requestValue = requestSent ? false : true;
    const payload = {
      requestSent: requestValue,
    };
    try {
      const response = await axios.post(`/patient/${currentUser.user.uid}/requestDoctor`, payload);
      setRequestSent(!requestSent);
      console.log(response);
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  return (
    <div>
      <div className={styles['page-title']}>Request a Doctor</div>

      <hr />

      {currentUser.dbData.patientInfo.doctor === '' ? (
        <div>
          <p className={styles['main-text']}>You have no doctor assigned!</p>
          <Button data-testid='request-doctor-button' variant='primary' onClick={requestDoctor}>
            {requestSent ? 'Cancel Doctor Request' : 'Request a Doctor'}
          </Button>
        </div>
      ) : (
        <p className={styles['main-text']}>Your doctor: {currentUser.dbData.patientInfo.doctor}</p>
      )}
    </div>
  );
}

export default RequestDoctorPage;
