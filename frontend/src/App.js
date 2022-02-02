import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Authentication/login/Login';
import SignUp from "./components/Authentication/SignUp/SignUp";
import PatientDashboard from "./components/Dashboards/PatientDashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard/DoctorDashboard";
import AdminDashboard from "./components/Dashboards/Admin Dashboard/AdminDashboard";
import HODashboard from "./components/Dashboards/Health Official Dashboard/HODashboard";
import IODashboard from "./components/Dashboards/Immigration Officer Dashboard/IODashboard";
import FirebaseAuthProvider from "./components/Authentication/FirebaseAuth/FirebaseAuth";
import './components/Authentication/FirebaseAuth/FirebaseConfig';
import PrivateRoute from "./components/RouteHandler/PrivateRoute";

//import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
      <BrowserRouter>
          <FirebaseAuthProvider>
              <div className="App">
                  <main>
                      <Routes>
                            <Route path='/' element={<Login/>} />
                            <Route path='/signup' element={<SignUp/>} />
                            <Route path='/patient-dashboard' element={
                                  <PrivateRoute>
                                      <PatientDashboard/>
                                  </PrivateRoute>
                            }/>
                            <Route path='/doctor-dashboard' element={
                                  <PrivateRoute>
                                      < DoctorDashboard/>
                                  </PrivateRoute>
                            }/>
                            <Route path='/admin-dashboard' element={
                                  <PrivateRoute>
                                      <AdminDashboard/>
                                  </PrivateRoute>
                            }/>
                            <Route path='/health-official-dashboard' element={
                                  <PrivateRoute>
                                      <HODashboard/>
                                  </PrivateRoute>
                            }/>
                            <Route path='/immigration-officer-dashboard' element={
                                  <PrivateRoute>
                                      <IODashboard/>
                                  </PrivateRoute>
                            }/>
                      </Routes>
                  </main>
              </div>
          </FirebaseAuthProvider>
      </BrowserRouter>
  );
}

export default App;
