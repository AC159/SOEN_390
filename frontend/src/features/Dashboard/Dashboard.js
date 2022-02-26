import React from "react";
import {Tabs} from "react-bootstrap";
import {Tab} from "react-bootstrap";

import NotificationBox from '../../components/NotificationBox/NotificationBox';
import Navbar from "../../components/Navbar/Navbar";
import styles from './Dashboard.module.css';
import './common.css'


const Dashboard = ({defaultActiveKey, tabsList}) => {

  return (
    <div>
      <Navbar />
      <div className={styles["admin-main-container"]}>
        <div className={styles["tabs-box"]}>
          <Tabs 
            className="tabStyle" 
            defaultActiveKey={defaultActiveKey}
            unmountOnExit={true} 
            mountOnEnter={true}
          >
            {tabsList.map(tab => (
              <Tab eventKey={tab.eventKey} title={tab.title}>
                <div className={styles["tab-page"]}>
                  {tab.element}
                </div>
              </Tab>
            ))}
          </Tabs>
        </div>
        <div className={styles["notification-outer-box"]}>
          <NotificationBox />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;