import photo1 from "../../assets/HomePhotos/doctor_sitting.jpg";
import photo3 from "../../assets/HomePhotos/closed.jpg";
import { Accordion } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./MonitorPatients.module.css";
import "./CommonPageStyling.css";
import axios from "axios";
import { ListGroup } from "react-bootstrap";

function MonitorPatients(props) {

    // //the following 5 const's are to test the ui without the backend:
    // const Patient = function(pName, pStatus, pDob, pEmail, pPhoneNumber)
    // {
    //     const name = pName;
    //     const status = pStatus;
    //     const dob = pDob;
    //     const email = pEmail;
    //     const phoneNumber = pPhoneNumber;
  
    //     return {name, status, dob, email, phoneNumber};
    // };
    // const patientOne = Patient("First Patient", "POSITIVE", "02/05/1999", "Patient1@gmail.com", "514-514-5145");
    // const patientTwo = Patient("Second Patient", "PENDING", "14/02/2014", "iAmPatient2@gmail.com", "438-438-4384");
    // const patientThree = Patient("Third Patient", "NEGATIVE", "17/08/1984", "patientTHREE@gmail.com", "514-438-5145");
    // const patients = [patientOne, patientTwo, patientThree];

    const [patientList, setPatientList] = useState([]);
    const [status, setPatientStatus] = useState([]);
    
    const getPatientArray = () => {
        axios.get( `doctor/${currentUser.user.uid}/patientArray` )
        .then((response) => {
        const newData = response.data.data.map(
            (patient) => ({
                ...patient,
                status: 'Negative'
            })
        )
        setPatientList(newData);
        console.log(patientList);
        console.log(response);
        })
        .catch((error) => {
        console.log(error.response);
        })
    }
    
    let {currentUser} = useAuth();

    const renderPatientList = () => {
        return <div>
          {patientList.map(patient =>
            <div className={styles["patientInfoCard"]}>
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
