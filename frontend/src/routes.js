import Login from "./components/Authentication/login/Login";
import SignUp from "./components/Authentication/SignUp/SignUp";
import PatientDashboard from "./components/Dashboards/PatientDashboard/PatientDashboard";
import DoctorDashboard from "./components/Dashboards/DoctorDashboard/DoctorDashboard";
import AdminDashboard from "./components/Dashboards/Admin Dashboard/AdminDashboard";
import HODashboard from "./components/Dashboards/Health Official Dashboard/HODashboard";
import IODashboard from "./components/Dashboards/Immigration Officer Dashboard/IODashboard";
import GeneralDashboard from "./components/Dashboards/GeneralDashboard/GeneralDashboard";
import UserProfile from "./components/UserProfile/UserProfile";

const routes = [
  {
    path: '/',
    element: <Login />,
    isPrivate: false,
  },
  {
    path: '/signup',
    element: <SignUp />,
    isPrivate: false,
  },
  {
    path: '/patient-dashboard',
    element: <PatientDashboard />,
    isPrivate: true,
  },
  {
    path: '/doctor-dashboard',
    element: <DoctorDashboard />,
    isPrivate: true,
  },
  {
    path: '/admin-dashboard',
    element: <AdminDashboard />,
    isPrivate: true,
  },
  {
    path: '/health-official-dashboard',
    element: <HODashboard />,
    isPrivate: true,
  },
  {
    path: '/immigration-officer-dashboard',
    element: <IODashboard />,
    isPrivate: true,
  },
  {
    path: '/general-dashboard',
    element: <GeneralDashboard />,
    isPrivate: true,
  },
  {
    path: '/user-profile',
    element: <UserProfile />,
    isPrivate: true,
  },
]

export default routes;
