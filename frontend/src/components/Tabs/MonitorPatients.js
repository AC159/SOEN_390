import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MonitorPatients.module.css";
import "./CommonPageStyling.css";
import axios from "axios";

import PatientBox from "../GeneralComponents/PatientBox";

import { Accordion } from "react-bootstrap";
import CovidData from "../GeneralComponents/CovidData";

function MonitorPatients(props) {
  const [patientList, setPatientList] = useState([]);

  const getPatientArray = async () => {
    try {
      const response = await axios.get(
        `doctor/${currentUser.user.uid}/patientArray`
      );
      setPatientList(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  let { currentUser } = useAuth();

  const renderPatientList = () => {
    return (
      <Accordion>
        {patientList.map((patient, index) => (
          <PatientBox
            key={index}
            eventKey={index}
            patient={patient}
            doctorName={patient.patientInfo.doctor}
            currentUser={currentUser}
            userType={localStorage.getItem("userType")}
            className={styles["patient-box"]}
          />
        ))}
      </Accordion>
    );
  };

  useEffect(() => {
    getPatientArray();
  }, [patientList.length]);

  return (
    <div>
      <h3>Patients COVID Data</h3>
          <CovidData/>
      <br/>
      <div className={styles["page-top-text"]}>
          <h3>Your Patients</h3>
          <hr/>
      </div>
      <div>
          {renderPatientList()}
      </div>
    </div>
  );
}

export default MonitorPatients;
