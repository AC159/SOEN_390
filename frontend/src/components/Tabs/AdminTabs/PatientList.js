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
 

  useEffect(() => {
    console.log("Patient List Tab is Loaded!");
    fetchListOfPatients();
  }, [patientList.length]);

  const fetchListOfPatients = async () => {
    
    axios.get(`admin/${currentUser.user.uid}/patients`)
    .then((response) => {
      setPatientList(response.data.data);
      console.log(patientList);
    })
    .catch((error) => {
      console.log(error.response);
    })
  }

  function renderPatientList()
  {
    return <Accordion>
      {patientList.map((patient, index) => 
      <PatientBox 
      eventKey={`${index}`}
      patient={patient}
      currentUser={currentUser}
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
