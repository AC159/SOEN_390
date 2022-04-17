import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';
import RoleRequest from '../../components/Tabs/AdminTabs/RoleRequest';
import PatientList from '../../components/Tabs/AdminTabs/PatientList';
import AdminDoctorList from '../../features/Tabs/AdminDoctorList';
import NotificationBox from '../../components/NotificationBox/NotificationBox';

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />,
  },
  {
    eventKey: 'account-requests',
    title: 'Account Request',
    element: <RoleRequest />,
  },
  {
    eventKey: 'patient-list',
    title: 'Patient List',
    element: <PatientList />,
  },
  {
    eventKey: 'doctor-list',
    title: 'Doctor List',
    element: <AdminDoctorList />,
  },
  {
    eventKey: 'notification',
    title: 'Notification',
    element: <NotificationBox />,
  },
  {
    eventKey: 'contact',
    title: 'Contact',
    element: <div>Contacts</div>,
  },
];

const AdminDashboard = () => {
  return <Dashboard defaultActiveKey='home' tabsList={tabs} />;
};

export default AdminDashboard;
