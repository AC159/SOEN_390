import styles from "./Notification.module.css";
import { Alert } from "react-bootstrap";

function Notification(props) {
  [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
  ].map((variant, idx) => (
    <Alert key={idx} variant={variant}>
      This is a {variant} alert—check it out!
    </Alert>
  ));

  return (
    <div className={styles["notification-box"]}>
      <Alert variant={props.alertType}>
        <Alert.Heading>{props.alertHeading}</Alert.Heading>
        <p>{props.alertMainText}</p>
        <hr />
        <p className="mb-0">{props.alertSubText}</p>
      </Alert>
    </div>
  );
}

export default Notification;
