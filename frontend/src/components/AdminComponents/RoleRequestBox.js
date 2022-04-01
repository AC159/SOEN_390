import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './RoleRequestBox.module.css';
import {Button} from 'react-bootstrap';
import {Card} from 'react-bootstrap';
import axios from 'axios';
import {useState} from 'react';

function RoleRequestBox({uID, adminID, userEmail, RequesterUsername, RequestType}) {
  function makeTitle(RequestType) {
    return RequestType + ' Request';
  }

  const [displayRequestBox, setDisplayRB] = useState(true);

  const approveUser = async () => {
    const approveInfo = {
      userId: uID,
      adminId: adminID,
      userEmail: userEmail,
      message: `Hi ${RequesterUsername}, \nThis email is to let you know that your account has been approved!`, // email can be plain text or html
    };

    axios
      .post(`admin/${adminID}/approve-user`, approveInfo)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });

    setDisplayRB(false);
  };

  const rejectUser = () => {
    const rejectInfo = {
      userId: uID,
      adminId: adminID,
    };

    axios
      .post(`admin/${adminID}/reject-user`, rejectInfo)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
    setDisplayRB(false);
  };

  return (
    <div className={styles['card-container']}>
      {displayRequestBox ? (
        <Card className={styles['card']}>
          <Card.Body>
            <Card.Title>{makeTitle(RequestType)}</Card.Title>
            <Card.Text>
              {RequesterUsername} wants to join as a {RequestType}
            </Card.Text>
            <Button variant='primary' onClick={approveUser}>
              Approve
            </Button>{' '}
            <Button variant='danger' onClick={rejectUser}>
              Reject
            </Button>{' '}
            <Button variant='info'>More Info</Button>{' '}
          </Card.Body>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default RoleRequestBox;
