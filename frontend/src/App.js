import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Authentication/login/Login';
import SignUp from "./components/Authentication/SignUp/SignUp";
import PatientDashboard from "./components/Dashboards/PatientDashboard/PatientDashboard";
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
                      </Routes>
                  </main>
              </div>
          </FirebaseAuthProvider>
      </BrowserRouter>
  );
}

export default App;
