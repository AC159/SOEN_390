import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import PatientList from '../../components/Tabs/AdminTabs/PatientList';

import NotificationBox from '../../components/NotificationBox/NotificationBox';

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />
  },
  {
    eventKey: 'monitor-patient',
    title: 'Monitor Patients',
    element: <PatientList />
  },
    {
    eventKey: 'notification',
    title: 'Notification',
    element: <NotificationBox />
  },
  {
    eventKey: 'contact',
    title: 'Contact',
    element: () => (<div>Contact</div>)
  },
]

const HODashboard = () => {

  return (
    <Dashboard
      defaultActiveKey="home"
      tabsList={tabs}
    />
  )
}

export default HODashboard;
