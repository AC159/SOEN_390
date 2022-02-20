import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./RoleRequestBox.module.css";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";

import axios from "axios";

import { useState } from "react";

const uID = "";
const adminID = "";

function RoleRequestBox(props) {
  function makeTitle(RequestType) {
    return RequestType + " Request";
  }

  const [displayRequestBox, setDisplayRB] = useState(true);

  const approveUser = () => {
    const approveInfo = {
      userId: props.uID,
      adminId: props.adminID
    }

    axios.post(`admin/${props.adminID}/approve-user`, approveInfo)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error.response);
    })

    setDisplayRB(false);
  }

  const rejectUser = () => {
    const approveInfo = {
      userId: props.uID,
      adminId: props.adminID
    }

    axios.post(`admin/${props.adminID}/reject-user`, approveInfo)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error.response);
    })
    setDisplayRB(false);
  }

  return (
    <div className={styles["card-container"]}>
      {
        (displayRequestBox) ? 
        
          <Card className={styles["card"]}>
          <Card.Body>
          <Card.Title>{makeTitle(props.RequestType)}</Card.Title>
          <Card.Text>
            {props.RequesterUsername} wants to join as a {props.RequestType}
          </Card.Text>
          <Button variant="primary" onClick={approveUser}>Approve</Button>{" "}
          <Button variant="danger" onClick={rejectUser}>Reject</Button>{" "}
          <Button variant="info">More Info</Button>{" "}
        </Card.Body>
      </Card> 
          : <div></div>
      }
    </div>
  );
}

export default RoleRequestBox;
