import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import NotificationBox from "../../components/NotificationBox/NotificationBox";

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />
  },
    {
    eventKey: 'notification',
    title: 'Notification',
    element: <NotificationBox />
  }
]

const GeneralDashboard = () => {

  return (
    <Dashboard
      defaultActiveKey="home"
      tabsList={tabs}
    />
  )
}

export default GeneralDashboard
