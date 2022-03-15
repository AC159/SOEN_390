import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import CovidFile from '../../components/Tabs/PatientSymptoms/CovidFile';
import RequestDoctorPage from '../../components/Tabs/PatientSymptoms/RequestDoctorPage';

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
    eventKey: 'contact',
    title: 'Contact',
    element: () => (<div>Contact</div>)
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
