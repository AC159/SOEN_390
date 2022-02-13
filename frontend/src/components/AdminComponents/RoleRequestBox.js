import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "./RoleRequestBox.module.css";

import { Button } from 'react-bootstrap';
import { Accordion } from 'react-bootstrap';
import { Card } from 'react-bootstrap';


let RequesterUsername = '';
let RequestType = '';

function RoleRequestBox(props){

    function makeTitle(RequestType)
    {
        return RequestType + ' Request';
    }

    return(
        <div className={styles["card-container"]}>
            <Card className={styles["card"]}>
            <Card.Body>
                <Card.Title>{makeTitle(props.RequestType)}</Card.Title>
                <Card.Text>
                {props.RequesterUsername} wants to join as a {props.RequestType}
                </Card.Text>
                <Button variant="primary">Approve</Button>{' '}
                <Button variant="danger">Reject</Button> <Button variant="info">More Info</Button>{' '}
            </Card.Body>
            </Card>
        </div>
    );

}

export default RoleRequestBox;