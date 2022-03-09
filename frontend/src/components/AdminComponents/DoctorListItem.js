import React from 'react';
import { ListGroup, Button } from "react-bootstrap";

import styles from './PatientBox.module.css';

const DoctorListItem = ({doctor, setDoctorInfo, selected }) => {
  console.log(doctor.name, selected);
  return (
    <ListGroup.Item
      variant={selected ? 'primary' : ''}
    >
      {doctor.name}
      <div className={styles["doctor-side"]}>
      <div className={styles["doctor-patient-count"]}>{"Patients Assigned: " + doctor.patientCount}</div>
      <Button 
        variant={selected ? "outline-secondary" : "outline-primary"} 
        onClick={() => setDoctorInfo({id: doctor.uid, name: doctor.name })}
        className={styles["doctor-select-button"]}
        disabled={selected}
      >
        {selected ? 'Selected' : 'Select'}
      </Button>
      </div>
    </ListGroup.Item>
  );
}

export default DoctorListItem;