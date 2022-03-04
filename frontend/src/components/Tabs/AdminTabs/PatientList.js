import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientBox from "../../AdminComponents/PatientBox";

import styles from "./PatientList.module.css";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";

import axios from "axios";
import { Accordion } from "react-bootstrap";

function PatientList(props) {

  let {currentUser} = useAuth();
  const [patientList, setPatientList] = useState([]);
 

  useEffect(() => {fetchListOfPatients(); console.log(localStorage.getItem("userType"))}, [patientList.length]);

  const fetchListOfPatients = async () => {
    try {
        const response = await axios.get(`admin/${currentUser.user.uid}/patients`);
        setPatientList(response.data.data);
    } catch (error) {
        console.log(error);
    }
  }

  function renderPatientList()
  {
    return <Accordion>
      {patientList.map((patient, index) => 
      <PatientBox
      key={index}
      eventKey={index}
      patient={patient}
      doctorName={patient.patientInfo.doctor}
      currentUser={currentUser}
      userType={localStorage.getItem("userType")}
      className={styles["patient-box"]}
      />)}
    </Accordion>;
  }

  return (
    <div className={styles["role-outer-container"]}>
      <div className={styles["todays-new-title"]}>Patient List</div>
      <hr />
      <div>
        {renderPatientList()}
      </div>
        
      <div className={styles["request-container"]}>
        
      </div>
    </div>
  );
}

export default PatientList;
