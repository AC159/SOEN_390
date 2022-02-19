import React from "react";
import Navbar from "../../Navbar/Navbar";
import { Tabs } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import Home from "../../Tabs/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./DoctorDashboard.module.css";
import "../DashboardCommonStyles.css";
import NotificationBox from "../../NotificationBox/NotificationBox";

function DoctorDashboard(props) {

  //the following const's are temporary to test out the UI without the backend
  //creating three Patient objects, then populating an array with these patients
  const Patient = function(pName, pStatus, pDob, pEmail, pPhoneNumber)
  {
      const name = pName;
      const status = pStatus;
      const dob = pDob;
      const email = pEmail;
      const phoneNumber = pPhoneNumber;

      return {name, status, dob, email, phoneNumber};
  };
  const patientOne = Patient("First Patient", "POSITIVE", "02/05/1999", "Patient1@gmail.com", "514-514-5145");
  const patientTwo = Patient("Second Patient", "PENDING", "14/02/2014", "iAmPatient2@gmail.com", "438-438-4384");
  const patientThree = Patient("Third Patient", "NEGATIVE", "17/08/1984", "patientTHREE@gmail.com", "514-438-5145");
  const patients = [patientOne, patientTwo, patientThree];

  return (
    <div>
      <Navbar />
      <div className={styles["main-container"]}>
        <div className={styles["tabs-box"]}>
          <Tabs className="tabStyle" defaultActiveKey="home">
            <Tab eventKey="home" title="Home">
              <div className={styles["tab-page"]}>
                <Home />
              </div>
            </Tab>
            <Tab eventKey="monitor-patient" title="Monitor Patients">
            <div className={styles["tab-page"]}>
              <div>
                {patients.map(patient =>
                <div className={styles["patientInfoCard"]}>
                  <div>
                    <h6>Name:</h6>
                    <p>{patient.name}</p>
                  </div>
                  <div>
                    <h6>Status:</h6>
                    <p>{patient.status}</p> 
                  </div>
                  <div>
                    <h6>Date of Birth:</h6>
                    <p>{patient.dob}</p> 
                  </div>
                  <div>
                    <h6>Email:</h6>
                    <p>{patient.email}</p> 
                  </div>
                  <div>
                    <h6>Phone Number:</h6>
                    <p>{patient.phoneNumber}</p>
                  </div>
                </div>
                )}
              </div>
            </div>
            </Tab>
            <Tab eventKey="contact" title="Contact"></Tab>
          </Tabs>
        </div>

        <div className={styles["notification-outer-box"]}>
          <NotificationBox />
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
