import React from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import { useState } from "react";
import styles from "./UserProfile.module.css";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

function UserProfile(props) {
  let { currentUser } = useAuth();
  let [phoneNumber, setPhoneNumber] = useState("");
  let [address, setAddress] = useState("");

  const [state, setState] = React.useState({
    phoneNumber: `${currentUser.dbData.phoneNumber}`,
    address: `${currentUser.dbData.address}`,
  });
  const userType = `${currentUser.dbData.userType
    .charAt(0)
    .toUpperCase()}${currentUser.dbData.userType.slice(1)}`;

  const submitPhoneForm = async () => {
    console.log(`PhoneNumber: ${phoneNumber}`);
    console.log(`Current User ID: ${currentUser.user.uid}`);
    axios
      .post(`/user/update-profile/${currentUser.user.uid}`, {
        userAttributes: { phoneNumber },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const submitAddressForm = async () => {
    console.log(`Address: ${address}`);
    axios
      .post(`/user/update-profile/${currentUser.user.uid}`, {
        userAttributes: { address },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [showModalOne, setShowOne] = useState(false);
  const handleShowOne = () => setShowOne(true);
  const handleCloseOne = () => setShowOne(false);

  const [showModalTwo, setShowTwo] = useState(false);
  const handleShowTwo = () => setShowTwo(true);
  const handleCloseTwo = () => setShowTwo(false);

  return (
    <div>
      {" "}
      <Navbar />
      <div className={styles["container"]}>
        <div className={styles["userInfo"]}>
          <div className={styles["internalCard"]}>
            <div>Email: {currentUser.user.email}</div>
          </div>

          {/* SET UP phoneNumber PATH:  */}
          <div className={styles["internalCard"]}>
            <div>Phone Number: {state.phoneNumber}</div>
            <button onClick={handleShowOne}>Change Phone Number</button>
            <Modal show={showModalOne} onHide={handleCloseOne}>
              <Modal.Header closeButton>
                <Modal.Title>Change Phone Number</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Enter new phone number : &nbsp;</label>
                <input
                  type="text"
                  placeholder="e.g. 5145145145"
                  maxLength={"10"}
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <button onClick={handleCloseOne}>Close</button>
                <button
                  onClick={() => {
                    handleCloseOne();
                    submitPhoneForm();
                    setState({ ...state, phoneNumber: phoneNumber });
                  }}
                >
                  Save Changes
                </button>
              </Modal.Footer>
            </Modal>
          </div>

          {/* SET UP address PATH */}
          <div className={styles["internalCard"]}>
            <div>Address: {state.address}</div>
            <button onClick={handleShowTwo}>Change Address</button>
            <Modal show={showModalTwo} onHide={handleCloseTwo}>
              <Modal.Header closeButton>
                <Modal.Title>Change Address</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label>Enter new address: &nbsp;</label>
                <input
                  type="text"
                  placeholder=""
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </Modal.Body>
              <Modal.Footer>
                <button onClick={handleCloseTwo}>Close</button>
                <button
                  onClick={() => {
                    handleCloseTwo();
                    submitAddressForm();
                    setState({ ...state, address: address });
                  }}
                >
                  Save Changes
                </button>
              </Modal.Footer>
            </Modal>
          </div>

          {/* Make following dynamic, based on user type will generate Patient Status/Medical License info */}
          <div className={styles["internalCard"]}>
            <div>
              {userType} status: &nbsp;
              <div>
                {/* Enter patient status here */}
                {currentUser.dbData.userStatus}
              </div>
            </div>
          </div>
        </div>

        <div className={styles["profile"]}>
          <div>{userType} Profile</div>
          {/* SET UP PROFILE PIC PATH:  */}
          <img
            className={styles["profilePic"]}
            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
          />
          <div className={styles["nameCard"]}>
            {/* SET UP NAME + DESIGNATION (Dr. Mr. Ms. etc) + */}
            <div>{currentUser.dbData.name}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
