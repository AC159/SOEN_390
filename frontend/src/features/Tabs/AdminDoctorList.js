import React from 'react';

import {useAuth} from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import {DoctorList} from '../List/List';
import styles from './AdminDoctorList.module.css';

const AdminDoctorList = () => {
  const {currentUser} = useAuth();

  return (
    <DoctorList
      listUrl={`admin/${currentUser.user.uid}/doctors`}
      render={(doctor, index) => (
        <div key={index} className={styles.container}>
          <h4 className={styles.name}>Dr. {doctor.name}</h4>
          <div>
            <span>patients: </span>
            <span className={styles.count}>{doctor.patientCount}</span>
          </div>
        </div>
      )}
    />
  );
};

export default AdminDoctorList;
