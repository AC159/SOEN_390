import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Authentication/login/Login";
import SignUp from "./components/Authentication/SignUp/SignUp";
import PatientDashboard from "./components/Dashboards/PatientDashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard/DoctorDashboard";
import AdminDashboard from "./components/Dashboards/Admin Dashboard/AdminDashboard";
import HODashboard from "./components/Dashboards/Health Official Dashboard/HODashboard";
import IODashboard from "./components/Dashboards/Immigration Officer Dashboard/IODashboard";
import GeneralDashboard from "./components/Dashboards/GeneralDashboard/GeneralDashboard";

import "./components/Authentication/FirebaseAuth/FirebaseConfig";
import PrivateRoute from "./components/RouteHandler/PrivateRoute";
import UserProfile from "./components/UserProfile/UserProfile";

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/patient-dashboard"
            element={
              <PrivateRoute requestedRoute={"/patient-dashboard"}>
                <PatientDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <PrivateRoute requestedRoute={"/doctor-dashboard"}>
                <DoctorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <PrivateRoute requestedRoute={"/admin-dashboard"}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/health-official-dashboard"
            element={
              <PrivateRoute requestedRoute={"/health-official-dashboard"}>
                <HODashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/immigration-officer-dashboard"
            element={
              <PrivateRoute
                requestedRoute={"/immigration-officer-dashboard"}
              >
                <IODashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/general-dashboard"
            element={
              <PrivateRoute requestedRoute={"/general-dashboard"}>
                <GeneralDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <PrivateRoute requestedRoute={"/user-profile"}>
                <UserProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
