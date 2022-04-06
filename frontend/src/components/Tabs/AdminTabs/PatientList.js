import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientBox from '../../GeneralComponents/PatientBox';
import styles from './PatientList.module.css';
import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';
import {Accordion} from 'react-bootstrap';

function PatientList(props) {
  let {currentUser} = useAuth();
  const [patientList, setPatientList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [flagCheck, setFlagCheck] = useState(false);

  useEffect(() => {
    fetchListOfPatients();
    console.log(localStorage.getItem('userType'));
  }, [patientList.length]);

  const fetchListOfPatients = async () => {
    try {
      let routeType;
      switch (localStorage.getItem('userType')) {
        case 'administrator':
          routeType = 'admin';
          break;
        case 'immigrationOfficial':
          routeType = 'immigration-official';
          break;
        case 'healthOfficial':
          routeType = 'health-official';
          break;

        default:
          routeType = 'admin';
      }
      const response = await axios.get(`${routeType}/${currentUser.user.uid}/patients`);
      setPatientList(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function handleFlagCheckChange() {
    setFlagCheck((prevState) => !prevState);
  }

  function checkIfAdmin() {
    return localStorage.getItem('userType') === 'administrator';
  }

  const flagFilter = (item) => ({
    doctor: item.doctorFlagInfo.isFlagged,
    immigrationOfficial: item.immigrationOfficerFlagInfo.isFlagged,
    healthOfficial: item.healthOfficialFlagInfo.isFlagged,
  });

  function renderPatientList() {
    return (
      <Accordion>
        {patientList
          .filter(
            (item) =>
              searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .filter((item) => !flagCheck || flagFilter(item)[localStorage.getItem('userType')])
          .map((patient, index) => (
            <PatientBox
              key={index}
              eventKey={index}
              patient={patient}
              doctorName={patient.patientInfo.doctor}
              currentUser={currentUser}
              userType={localStorage.getItem('userType')}
              className={styles['patient-box']}
            />
          ))}
      </Accordion>
    );
  }

  return (
    <div className={styles['role-outer-container']}>
      <div className={styles['todays-new-title']}>Patient List</div>
      <hr />
      <div className={styles['side-by-side']}>
        <input
          type='text'
          placeholder='Search patient by name...'
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        {!checkIfAdmin() && (
          <label className={styles['check-box']}>
            <input
              type='checkbox'
              id='flagCheckBox'
              checked={flagCheck}
              onChange={handleFlagCheckChange}
            />
            <span> flagged </span>
          </label>
        )}
      </div>
      <div>{renderPatientList()}</div>
    </div>
  );
}

export default PatientList;
