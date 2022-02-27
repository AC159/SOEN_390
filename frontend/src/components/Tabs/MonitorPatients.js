import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MonitorPatients.module.css";
import "./CommonPageStyling.css";
import axios from "axios";

function MonitorPatients(props) {

    const [patientList, setPatientList] = useState([]);
    
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }
    
    let {currentUser} = useAuth();

    const renderPatientList = () => {
        return <div className={styles["noPatientsMessage"]}>
        {patientList.length === 0 ? <div>You have no patients assigned to you.</div> : 
        
        patientList.map((patient, index) =>
            <div key = {index} className={styles["patientInfoCard"]}>
                <div>
                    <h6>Name:</h6>
                    <p data-testid="patient-name">{patient.name}</p>
                </div>
                <div>
                    <h6>Status:</h6>
                    <p>{patient.status ? patient.status : 'null'}</p> 
                </div>
                <div>
                    <h6>Date of Birth:</h6>
                    <p>{patient.dob ? patient.dob : 'null'}</p> 
                </div>
                <div>
                    <h6>Email:</h6>
                    <p>{patient.email}</p> 
                </div>
                <div>
                    <h6>Phone Number:</h6>
                    <p>{patient.phoneNumber ? patient.phoneNumber.phoneNumber || patient.phoneNumber : 'null'}</p>
                </div>
            </div>
            )}
        </div>
    }

    useEffect(() => {
        getPatientArray();
    }, [patientList.length]);

  return (
    <div>
        {renderPatientList()}
    </div>
  );
}

export default MonitorPatients;
