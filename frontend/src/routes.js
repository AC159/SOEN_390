import Login from "./components/Authentication/login/Login";
import SignUp from "./components/Authentication/SignUp/SignUp";

import UserProfile from "./components/UserProfile/UserProfile";
import {
  PatientDashboard, DoctorDashboard, AdminDashboard,
  HODashboard, IODashboard, GeneralDashboard
} from './pages'

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
