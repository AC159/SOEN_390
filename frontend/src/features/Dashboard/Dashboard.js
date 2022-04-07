import React from 'react';
import {Tab, Tabs} from 'react-bootstrap';

import Navbar from '../../components/Navbar/Navbar';
import styles from './Dashboard.module.css';
import './common.css';

const Dashboard = ({defaultActiveKey, tabsList}) => {
  return (
    <div>
      <Navbar />
      <div className={styles['admin-main-container']}>
        <div className={styles['tabs-box']}>
          <Tabs
            className='tabStyle'
            defaultActiveKey={defaultActiveKey}
            unmountOnExit={true}
            mountOnEnter={true}
          >
            {tabsList.map((tab, index) => (
              <Tab key={index} eventKey={tab.eventKey} title={tab.title}>
                <div className={styles['tab-page']}>{tab.element}</div>
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
