import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import MonitorPatients from '../../components/Tabs/MonitorPatients'

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />
  },
  {
    eventKey: 'monitor-patient',
    title: 'Monitor Patients',
    element: <MonitorPatients />
  },
  {
    eventKey: 'contact',
    title: 'Contact',
    element: () => (<div>Contact</div>)
  },
]

const DoctorDashboard = () => {

  return (
    <Dashboard
      defaultActiveKey="home"
      tabsList={tabs}
    />
  )
}

export default DoctorDashboard;
