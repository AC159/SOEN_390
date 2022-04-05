import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import MonitorPatients from '../../components/Tabs/MonitorPatients';
import Appointment from '../../components/Tabs/DoctorTabs/Appointment';
import ContactPatients from "../../components/Tabs/DoctorTabs/ContactPatients";

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
    eventKey: 'appointment',
    title: 'Book Appointment',
    element: <Appointment />
  },
  {
    eventKey: 'contact',
    title: 'Contact',
    element: <ContactPatients/>
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
