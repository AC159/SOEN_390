import React from "react";
import Navbar from "../../Navbar/Navbar";
import { Tabs } from "react-bootstrap";
import { Tab } from "react-bootstrap";
import Home from "../../Tabs/Home";
import RoleRequest from "../../Tabs/AdminTabs/RoleRequest";

import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AdminDashboard.module.css";
import "../DashboardCommonStyles.css";

import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import NotificationBox from "../../NotificationBox/NotificationBox";

function AdminDashboard(props) {
  let { currentUser } = useAuth();

  return (
    <div>
      <Navbar />
      <div className={styles["admin-main-container"]}>
        <div className={styles["tabs-box"]}>
          <Tabs className="tabStyle" defaultActiveKey="home">
            <Tab eventKey="home" title="Home">
              <div className={styles["tab-page"]}>
                <Home />
              </div>
            </Tab>
            <Tab eventKey="account-requests" title="Account Requests">
              <div className={styles["tab-page"]}>
                <RoleRequest />
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

export default AdminDashboard;
