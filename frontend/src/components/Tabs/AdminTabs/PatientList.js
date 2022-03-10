import React from "react";

import PatientBox from "../../GeneralComponents/PatientBox";
import { PatientList as PList } from '../../../features/List/List'
import styles from "./PatientList.module.css";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";

function PatientList(props) {
  let {currentUser} = useAuth();

  return <PList 
    listUrl={`admin/${currentUser.user.uid}/patients`}
    render={(patient, index) => 
      <PatientBox
      key={index}
      eventKey={index}
      patient={patient}
      doctorName={patient.patientInfo.doctor}
      currentUser={currentUser}
      userType={localStorage.getItem("userType")}
      className={styles["patient-box"]}
      />}
  />
}

export default PatientList;
