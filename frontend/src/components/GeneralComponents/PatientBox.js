import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import {Accordion, Button, Modal, ListGroup, Badge} from 'react-bootstrap';
import AccordionBody from 'react-bootstrap/esm/AccordionBody';

import DoctorListItem from './DoctorListItem';
import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import PatientModal from './PatientModal';
import useFetch from '../../hook/useFetch';
import styles from './PatientBox.module.css';

function PatientBox(props) {
  const initialDoctorInfo = {
    id: props.patient.patientInfo.doctorId || '',
    name: props.patient.patientInfo.doctor,
  };

  const {currentUser} = useAuth();
  const [isFlagged, setIsFlagged] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [assignedDoctor, setAssignedDoctor] = useState(props.doctorName);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo);
  const [displayRequestBadge] = useState(props.patient.wantToBeAssignedToDoctor);

  const [doctorList, fetchDoctorList] = useFetch([], `admin/${props.currentUser.user.uid}/doctors`);

  const handleDoctorListClose = useCallback(() => {
    setDoctorInfo(initialDoctorInfo);
    setShowDoctorList(false);
  }, []);

  const handlePatientInfoClose = () => {
    setShowPatientInfo(false);
  };

  const handlePatientInfoShow = () => {
    setShowPatientInfo(true);
  };

  const openDoctorList = () => {
    setShowDoctorList(true);
    fetchDoctorList();
  };

  useEffect(() => {
    const flagValue = {
      doctor: props.patient?.doctorFlagInfo?.isFlagged || false,
      immigrationOfficial: props.patient?.immigrationOfficerFlagInfo?.isFlagged || false,
      healthOfficial: props.patient?.healthOfficialFlagInfo?.isFlagged || false,
    };
    setIsFlagged(flagValue[localStorage.getItem('userType')] || false);
  }, [props.patient]);

  const assignDoctorToPatient = useCallback(() => {
    const pair = {
      patient: props.patient.uid,
      doctor: doctorInfo.id,
      adminID: props.currentUser.uid,
      doctorName: doctorInfo.name,
    };
    try {
      axios.post(`admin/${props.currentUser.user.uid}/patient`, pair);
    } catch (error) {
      console.log(error);
    }
    setAssignedDoctor(doctorInfo.name);
    handleDoctorListClose();
  }, [
    doctorInfo.id,
    doctorInfo.name,
    handleDoctorListClose,
    props.currentUser.uid,
    props.currentUser.user.uid,
    props.patient.uid,
  ]);

  function isValidAdmin(currentUserType) {
    return currentUserType === 'administrator';
  }

  function isValidUserForPatientInfo(currentUserType) {
    switch (currentUserType) {
      case 'administrator':
      case 'healthOfficial':
      case 'immigrationOfficial':
      case 'doctor':
        return true;
      default:
        return false;
    }
  }

  return (
    <div className={styles['card-container']}>
      <Accordion.Item eventKey={props.eventKey} className={styles['patient-box']}>
        <Accordion.Header data-testid='patient-name' closeButton>
          <h5>{props.patient.name}</h5>
          <div className={styles['patient-box-header-badge']}>
            {currentUser.dbData.userType === 'administrator' &&
              displayRequestBadge &&
              assignedDoctor === '' && (
                <Badge pill bg='warning' text='dark'>
                  Wants to be assigned a doctor
                </Badge>
              )}
          </div>
          <div className={styles['patient-box-header-badge']}>
            {isFlagged && (
              <Badge bg='danger' text='light'>
                flagged
              </Badge>
            )}
          </div>
          <div className={styles['patient-box-header-badge']}>
            <Badge bg='danger' text='light'>
              {isFlagged && 'flagged'}
            </Badge>
          </div>
        </Accordion.Header>
        <AccordionBody>
          <h6 data-testid='patient-dob'>Date of Birth: {props.patient.dob}</h6>
          <h6>Assigned Doctor: {assignedDoctor === '' ? 'No Doctor Assigned' : assignedDoctor}</h6>

          {isValidAdmin(props.userType) && (
            <Button variant='primary' onClick={openDoctorList}>
              Assign Doctor
            </Button>
          )}
          {isValidUserForPatientInfo(props.userType) && (
            <Button variant='primary' onClick={handlePatientInfoShow}>
              Patient Information
            </Button>
          )}
        </AccordionBody>
      </Accordion.Item>

      <Modal
        className={styles['doctor-list-modal']}
        data-testid='doctor-list-modal'
        show={showDoctorList}
        onHide={handleDoctorListClose}
        animation={true}
        centered
      >
        <Modal.Header>
          <Modal.Title>Doctors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {doctorList.map((doctor) => (
              <DoctorListItem
                doctor={doctor}
                setDoctorInfo={setDoctorInfo}
                selected={doctorInfo.id === doctor.uid}
              />
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleDoctorListClose}>
            Close
          </Button>
          <Button variant='primary' onClick={assignDoctorToPatient}>
            Assign to {props.patient.name}
          </Button>
        </Modal.Footer>
      </Modal>

      {/*This is the modal for the doctor */}
      <PatientModal
        patient={props.patient}
        currentUser={props.currentUser}
        showPatientInfo={showPatientInfo}
        handlePatientInfoClose={handlePatientInfoClose}
        openDoctorList={openDoctorList}
      />
    </div>
  );
}

export default PatientBox;
