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
            <Tab eventKey="monitor-patient" title="Monitor Patients"></Tab>
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
