import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import "./NotificationBox.css";
import { Alert } from "react-bootstrap";


function NotificationBox(props) {
    let { currentUser } = useAuth();
    [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'light',
        'dark',
      ].map((variant, idx) => (
        <Alert key={idx} variant={variant}>
          This is a {variant} alert—check it out!
        </Alert>
      ));

    return (
        <div className="outer-container">
            <div className="notification-title">Notifications</div>
            <div className="notification-container">
            
            <div className="notification-box">
            <Alert variant="warning">
                <Alert.Heading>You haven't updated your COVID Status</Alert.Heading>
                <p>
                    It is very important that you update your COVID symptoms before 11:59PM today.
                </p>
                    <hr />
                <p className="mb-0">
                    You can do so by clicking the "Update COVID Symptoms" tab to the left this page.
                </p>
            </Alert>
            <Alert variant="info">
                <Alert.Heading>Changes in Government Guidelines</Alert.Heading>
               <p>
                    The Government of Quebec announced today that from Monday, 11th January 2021 onwards......
                </p>
            </Alert>
            <Alert variant="success">
                <Alert.Heading>Good news!</Alert.Heading>
                <p>
                    Your doctor has decided that your symptoms are not serious.
                </p>
                    <hr />
                <p className="mb-0">
                    You can do so by clicking the "Update COVID Symptoms" tab to the left this page.
                </p>
            </Alert>
            <Alert variant="warning">
                <Alert.Heading>You haven't updated your COVID Status</Alert.Heading>
                <p>
                    It is very important that you update your COVID symptoms before 11:59PM today.
                </p>
                    <hr />
                <p className="mb-0">
                    You can do so by clicking the "Update COVID Symptoms" tab to the left this page.
                </p>
            </Alert>
            </div>
        </div>
        </div>
        
    );
}

export default NotificationBox;