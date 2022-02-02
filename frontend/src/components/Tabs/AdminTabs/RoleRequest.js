import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";

import { Accordion } from "react-bootstrap";

import RoleRequestBox from "../../AdminComponents/RoleRequestBox";

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./RoleRequest.css";

function RoleRequest(props) {

    function alertClicked() {
        alert('Boo');
      }

    return (
        <div className="role-outer-container">
            <div className="todays-new-title">
                Role Requests
            </div>
            <hr />

            <div className="request-container">
                <RoleRequestBox 
                    RequesterUsername="Captain America"
                    RequestType="Patient"
                />
                 <RoleRequestBox 
                    RequesterUsername="Josiah Mercury"
                    RequestType="Doctor"
                />
                 <RoleRequestBox 
                    RequesterUsername="Perry Kingston"
                    RequestType="Health Official"
                />
                 <RoleRequestBox 
                    RequesterUsername="Django Unchained"
                    RequestType="Patient"
                />
            </div>
            
                
        </div>
        
    );
}

export default RoleRequest;