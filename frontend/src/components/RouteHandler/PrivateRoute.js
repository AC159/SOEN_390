import { Navigate } from "react-router-dom";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

function PrivateRoute({children}) {
    // This function determines if a user is authenticated to be able to access a guarded route. If unauthenticated, we redirect to login page
    let { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/" />
}

export default PrivateRoute;
