import React from 'react';
import Navbar from "../../Navbar/Navbar";
import "../../Navbar/Navbar.css"
import './PatientDashboard.css';
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";

function PatientDashboard(props) {

    let { currentUser } = useAuth();

    return (
        <React.Fragment>
            <Navbar />
            <span className="dashboard-main">
                afasfasfas
            </span>
            <span className="notifications">
                afasfasfas
            </span>
        </React.Fragment>
    );

}

export default PatientDashboard;
