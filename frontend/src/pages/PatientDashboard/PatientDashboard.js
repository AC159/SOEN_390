import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import CovidFile from '../../components/Tabs/PatientSymptoms/CovidFile';
import RequestDoctorPage from '../../components/Tabs/PatientSymptoms/RequestDoctorPage';
import ContactTrace from '../../components/Tabs/PatientSymptoms/ContactTrace';
import TravelInfo from '../../components/Tabs/PatientSymptoms/TravelInfo';
import NotificationBox from '../../components/NotificationBox/NotificationBox';
import ContactDoctor from '../../components/Tabs/PatientSymptoms/ContactDoctor';

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />,
  },
  {
    eventKey: 'updateCovidStatus',
    title: 'Update COVID Symptoms',
    element: <CovidFile />,
  },
  {
    eventKey: 'RequestDoctor',
    title: 'Request Doctor',
    element: <RequestDoctorPage />,
  },
  {
    eventKey: 'ContactTracing',
    title: 'Contact Tracing',
    element: <ContactTrace />,
  },
  {
    eventKey: 'traveling',
    title: 'Traveling',
    element: <TravelInfo />,
  },
  {
    eventKey: 'notification',
    title: 'Notification',
    element: <NotificationBox />,
  },
  {
    eventKey: 'contact',
    title: 'Contact',
    element: <ContactDoctor />,
  },
];

const PatientDashboard = () => {
  return <Dashboard defaultActiveKey='home' tabsList={tabs} />;
};

export default PatientDashboard;
