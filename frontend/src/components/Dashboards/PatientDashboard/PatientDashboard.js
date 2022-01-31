import React from 'react';
import Navbar from "../../Navbar/Navbar";
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Home from '../../PatientTabs/Home';
import "../../Navbar/Navbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './PatientDashboard.css';
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import NotificationBox from '../../NotificationBox/NotificationBox';

function PatientDashboard(props) {

    let { currentUser } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="main-container">
                <div className="tabs-box">
                <Tabs className="tabStyle" defaultActiveKey="home">
                    <Tab eventKey="home" title="Home">
                        <div className="tab-page">
                            <Home />
                        </div>
                        
                    </Tab>
                    <Tab eventKey="updateCovidStatus" title="Update COVID Symptoms">
                        
                    </Tab>
                    <Tab eventKey="contact" title="Contact">
                        
                    </Tab>
                </Tabs>
                </div>

                <div className="notification-outer-box">
                <NotificationBox />
                </div>
            </div>

        </div>
    );

}

export default PatientDashboard;
