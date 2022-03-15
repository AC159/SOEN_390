import React from 'react';

import Dashboard from '../../features/Dashboard/Dashboard';
import Home from '../../components/Tabs/Home';

const tabs = [
  {
    eventKey: 'home',
    title: 'Home',
    element: <Home />
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