import React from 'react';
import Navbar from "../../Navbar/Navbar";
import { Tabs } from 'react-bootstrap';
import { Tab } from 'react-bootstrap';
import Home from '../../Tabs/Home';
import "../../Navbar/Navbar.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './GeneralDashboard.css';
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import NotificationBox from '../../NotificationBox/NotificationBox';

function GeneralDashboard(props) {

    let { currentUser } = useAuth();

    return (
        <div>
            <Navbar />
            <div className="general-main-container">
                <div className="tabs-box">
                <Tabs className="tabStyle" defaultActiveKey="home">
                    <Tab eventKey="home" title="Home">
                        <div className="tab-page">
                            <Home />
                        </div>
                    </Tab>
                </Tabs>
                </div>
            </div>

        </div>
    );
}

export default GeneralDashboard;
