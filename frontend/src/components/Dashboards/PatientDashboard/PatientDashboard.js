import React from 'react';
import Navbar from "../../Navbar/Navbar";
import './PatientDashboard.css';
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";

function PatientDashboard(props) {

    let { currentUser } = useAuth();

    return (
        <React.Fragment>
            <Navbar />
            <div>Hello {currentUser.email}!</div>
        </React.Fragment>
    );

}

export default PatientDashboard;
