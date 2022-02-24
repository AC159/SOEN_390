import RoleRequestBox from "../../AdminComponents/RoleRequestBox";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./RoleRequest.module.css";
import {useEffect, useState} from "react";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import axios from "axios";

function RoleRequest(props) {

  let {currentUser} = useAuth();

  const [patientList, setPatientList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [healthOfficialList, setHOList] = useState([]);
  const [immigrationOfficerList, setIOList] = useState([]);
 

  useEffect(() => {
    console.log("Patient List is Loaded!");
    axios.get(`admin/${currentUser.user.uid}/pending-patients`)
        .then((response) => {
          setPatientList(response.data.users);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        })

    axios.get(`admin/${currentUser.user.uid}/pending-doctors`)
        .then((response) => {
          setDoctorList(response.data.doctors);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        })

    axios.get(`admin/${currentUser.user.uid}/pending-health-officer`)
        .then((response) => {
          setHOList(response.data.users);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        })

    axios.get(`admin/${currentUser.user.uid}/pending-immigration-officer`)
        .then((response) => {
          setIOList(response.data.users);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error.response);
        })
    }, []);

  function renderPendingPatientList() {
    if (patientList === null) return;
    return <div>
    {patientList.map((patient, index) => <RoleRequestBox
        key={index}
    RequesterUsername={patient.name}
    RequestType={patient.userType}
    uID={patient.uid}
    adminID={currentUser.user.uid}
    userEmail={patient.email}
    />)}
  </div>;  
  }

  function renderPendingDoctorList() {
    if(doctorList !== null) {
      return <div>
    {doctorList.map((doctor, index) => <RoleRequestBox
        key={index}
    RequesterUsername={doctor.name}
    RequestType={doctor.userType}
    uID={doctor.uid}
    adminID={currentUser.user.uid}
    userEmail={doctor.email}
    />)}
  </div>; 
    }
     
  }

  function renderPendingHOList() {
    if (healthOfficialList !== null) {
      return <div>
    {healthOfficialList.map((officer, index) => <RoleRequestBox
        key={index}
    RequesterUsername={officer.name}
    RequestType={officer.userType}
    uID={officer.uid}
    adminID={currentUser.user.uid}
    userEmail={officer.email}
    />)}
  </div>; 
    }
     
  }

  function renderPendingIOList() {
    if (immigrationOfficerList.users !== null) {
      return <div>
      {immigrationOfficerList.map((officer, index) => <RoleRequestBox
          key={index}
      RequesterUsername={officer.name}
      RequestType={officer.userType}
      uID={officer.uid}
      adminID={currentUser.user.uid}
      userEmail={officer.email}
    />)}
  </div>;  
    }
    
  }


  return (
    <div className={styles["role-outer-container"]}>
      <div className={styles["todays-new-title"]}>Role Requests</div>
      <hr />

      <div className={styles["request-container"]}>
        <div className={styles["user-category"]}>Patient Requests</div>
        <hr />
        {renderPendingPatientList()}
        <hr />
        <div className={styles["user-category"]}>Doctor Requests</div>
        <hr />
        {renderPendingDoctorList()}
        <hr />
        <div className={styles["user-category"]}>Admin Requests</div>
        <hr />

        <hr />
        <div className={styles["user-category"]}>Health Official Requests</div>
        <hr />
        {renderPendingHOList}
        <hr />
        <div className={styles["user-category"]}>Immigration Officer Requests</div>
        <hr />
        {renderPendingIOList}
        <hr />
      </div>
    </div>
  );
}

export default RoleRequest;
