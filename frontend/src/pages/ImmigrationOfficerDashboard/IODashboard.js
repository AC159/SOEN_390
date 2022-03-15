import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import PatientList from '../../components/Tabs/AdminTabs/PatientList';

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
    eventKey: 'contact',
    title: 'Contact',
    element: () => (<div>Contact</div>)
  },
]

const IODashboard = () => {

  return (
    <Dashboard
      defaultActiveKey="home"
      tabsList={tabs}
    />
  )
}

export default IODashboard;
