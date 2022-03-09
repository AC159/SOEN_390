import React from 'react';
import {
  Container, Row, Col, Badge
} from 'react-bootstrap';

import { useAuth } from '../../components/Authentication/FirebaseAuth/FirebaseAuth';
import {DoctorList} from '../List/List';
import styles from './AdminDoctorList.module.css';

const AdminDoctorList = () => {
  const {currentUser} = useAuth();

  return <DoctorList 
    title="Doctor List"
    listUrl={`admin/${currentUser.user.uid}/doctors`}
    render={(doctor, index) => 
      <>
      <div className={styles.container}>
        <h4 className={styles.name}>Dr. {doctor.name}</h4>
        <div className={styles.countContainer}>
          <span>patients: </span>
          <span className={styles.count}>{doctor.patientCount}</span>
        </div>
      </div>
      {/* <Container fluid>
        <Row>
          <Col></Col>
          <Col xs={6}/>
          <Col xs={2}>patients: <Badge bg="info">{doctor.patientCount}</Badge></Col>
        </Row>
      </Container> */}
      </>
    }
  />
}

export default AdminDoctorList;
