import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MonitorPatients.module.css";
import "./CommonPageStyling.css";
import axios from "axios";

import PatientBox from "../AdminComponents/PatientBox";

import { Accordion } from "react-bootstrap";

function MonitorPatients(props) {

    const [patientList, setPatientList] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
            console.log(patientList);
        } catch (error) {
            console.log(error.response);
        }
    }

    const getCurrentUserInfo = async () => {
        try {
            const response = await axios.get(`/user/${currentUser.user.uid}/getTypeAndStatus`);
            setUserInfo(response.data);
            console.log('Here is the current user');
            console.log(userInfo);
        } catch (error) {
            console.log(error.response);
        }
    }
    
    let {currentUser} = useAuth();

    const renderPatientList = () => {
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

    useEffect(() => {
        getPatientArray();
        getCurrentUserInfo();
    }, [patientList.length]);

  return (
    <div>
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
