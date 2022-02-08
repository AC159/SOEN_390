import { Navigate } from "react-router-dom";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

function PrivateRoute(props) {
    // This function determines if a user is authenticated to be able to access a guarded route. If unauthenticated, we redirect to login page
    let { currentUser } = useAuth();
    const requestedRoute = props.requestedRoute;
    sessionStorage.setItem('requestedRoute', requestedRoute); // store the requested data in the local storage to be able to redirect after login
    return currentUser.user !== undefined ? props.children : <Navigate to="/" />
}

export default PrivateRoute;
