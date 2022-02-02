import React from 'react';
import Navbar from "../../Navbar/Navbar";
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Home from '../../Tabs/Home';
import "../../Navbar/Navbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './IODashboard.css';
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import NotificationBox from '../../NotificationBox/NotificationBox';

function IODashboard(props) {

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
                    <Tab eventKey="monitor-patient" title="Monitor Patients">
                        
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

export default IODashboard;
