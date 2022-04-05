import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import CovidFile from '../../components/Tabs/PatientSymptoms/CovidFile';
import RequestDoctorPage from '../../components/Tabs/PatientSymptoms/RequestDoctorPage';
import ContactTrace from '../../components/Tabs/PatientSymptoms/ContactTrace';
import TravelInfo from '../../components/Tabs/PatientSymptoms/TravelInfo';

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />
  },
  {
    eventKey: 'updateCovidStatus',
    title: 'Update COVID Symptoms',
    element: <CovidFile />
  },
  {
    eventKey: 'RequestDoctor',
    title: 'Request Doctor',
    element: <RequestDoctorPage />
  },
  {
    eventKey: 'ContactTracing',
    title: 'Contact Tracing',
    element: <ContactTrace />
  },
  {
    eventKey: 'traveling',
    title: 'Traveling',
    element: <TravelInfo />
  },
  {
    eventKey: 'contact',
    title: 'Contact',
  },
]

const PatientDashboard = () => {

  return (
    <Dashboard
      defaultActiveKey="home"
      tabsList={tabs}
    />
  )
}

export default PatientDashboard;
