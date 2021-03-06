import RoleRequestBox from '../../AdminComponents/RoleRequestBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './RoleRequest.module.css';
import {useEffect, useState} from 'react';
import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';

function RoleRequest(props) {
  let {currentUser} = useAuth();

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [healthOfficialList, setHOList] = useState([]);
  const [immigrationOfficialList, setIOList] = useState([]);

  useEffect(() => {
    console.log('Patient List is Loaded!');
    axios
      .get(`admin/${currentUser.user.uid}/pending-patients`)
      .then((response) => {
        setPatientList(response.data.users);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });

    axios
      .get(`admin/${currentUser.user.uid}/pending-doctors`)
      .then((response) => {
        setDoctorList(response.data.doctors);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });

    axios
      .get(`admin/${currentUser.user.uid}/pending-health-officials`)
      .then((response) => {
        setHOList(response.data.healthOfficials);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });

    axios
      .get(`admin/${currentUser.user.uid}/pending-immigration-officials`)
      .then((response) => {
        setIOList(response.data.immigrationOfficials);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  function renderPendingUserList(userList) {
    if (userList === null) return;
    return (
      <div>
        {userList.map((user, index) => (
          <RoleRequestBox
            key={index}
            RequesterUsername={user.name}
            RequestType={user.userType}
            uID={user.uid}
            adminID={currentUser.user.uid}
            userEmail={user.email}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles['role-outer-container']}>
      <div className={styles['todays-new-title']}>Role Requests</div>
      <hr />

      <div className={styles['request-container']}>
        <div className={styles['user-category']}>Patient Requests</div>
        <hr />
        {renderPendingUserList(patientList)}
        <hr />
        <div className={styles['user-category']}>Doctor Requests</div>
        <hr />
        {renderPendingUserList(doctorList)}
        <hr />
        <div className={styles['user-category']}>Admin Requests</div>
        <hr />

        <hr />
        <div className={styles['user-category']}>Health Official Requests</div>
        <hr />
        {renderPendingUserList(healthOfficialList)}
        <hr />
        <div className={styles['user-category']}>Immigration Official Requests</div>
        <hr />
        {renderPendingUserList(immigrationOfficialList)}
        <hr />
      </div>
    </div>
  );
}

export default RoleRequest;
