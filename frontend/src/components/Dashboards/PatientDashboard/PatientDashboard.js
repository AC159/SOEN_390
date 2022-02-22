import React from "react";
import Navbar from "../../Navbar/Navbar";
import { Tabs } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import Home from "../../Tabs/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PatientDashboard.module.css";
import "../DashboardCommonStyles.css";
import NotificationBox from "../../NotificationBox/NotificationBox";

function PatientDashboard(props) {

    return (
        <div>
            <Navbar />
            <div className={styles["patient-main-container"]}>
                <div className={styles["tabs-box"]}>
                <Tabs className={styles["tabStyle"]} defaultActiveKey="home">
                    <Tab className={styles} eventKey="home" title="Home">
                        <div className={styles["tab-page"]}>
                            <Home />
                        </div>
                    </Tab>
                    <Tab className={styles} eventKey="updateCovidStatus" title="Update COVID Symptoms">
                        <div className={styles["tab-page"]}>
                            <CovidFile />
                        </div>
                    </Tab>
                    <Tab className={styles} eventKey="contact" title="Contact">
                    </Tab>
                </Tabs>
                </div>

        <div className={styles["notification-outer-box"]}>
          <NotificationBox />
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
