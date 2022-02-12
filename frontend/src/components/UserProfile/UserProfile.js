import React from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import { useState } from 'react';
import styles from './UserProfile.module.css';
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";


function UserProfile(props) {
    let {currentUser} = useAuth();
    
    let [phoneNumber, setPhoneNumber] = useState('');
    let [name, setName] = useState('');
    let [address, setAddress] = useState('');
    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');

    const submitPhoneForm = async() => {
        console.log(`PhoneNumber: ${phoneNumber}`);
        axios.post(`/user/update-profile/${currentUser.uid}`, {userAttributes: {phoneNumber}}).then(function (response) {
            console.log(response);
          }).catch(function (error) {
            console.log(error);
          });
    }
    const submitAddressForm = async() => {
        console.log(`Address: ${address}`);
        axios.post(`/user/update-profile/${currentUser.uid}`, {userAttributes: {address}}).then(function (response) {
            console.log(response);
          }).catch(function (error) {
            console.log(error);
          });
    }
    const submitNameForm = async() => {
        console.log(`firstName: ${firstName}`);
        console.log(`lastName: ${lastName}`);

        axios.post(`/user/update-profile/${currentUser.uid}`, {userAttributes: {firstName}}).then(function (response) {
            console.log(response);
          }).catch(function (error) {
            console.log(error);
          });
        
          axios.post(`/user/update-profile/${currentUser.uid}`, {userAttributes: {lastName}}).then(function (response) {
            console.log(response);
          }).catch(function (error) {
            console.log(error);
          });
    }

    const [showModalOne, setShowOne] = useState(false);
    const handleShowOne = () => setShowOne(true);
    const handleCloseOne = () => setShowOne(false);

    const [showModalTwo, setShowTwo] = useState(false);
    const handleShowTwo = () => setShowTwo(true);
    const handleCloseTwo = () => setShowTwo(false);

    const [showModalName, setShowName] = useState(false);
    const handleShowName = () => setShowName(true);
    const handleCloseName = () => setShowName(false);
    
    
    return (
        <div className={styles['container']}>

        <div className={styles['userInfo']}>
                <div className={styles['internalCard']}>
                    <div>Email: {currentUser.user.email}</div>
                </div>

                {/* SET UP phoneNumber PATH:  */}
                <div className={styles['internalCard']}>
                    <div>Phone Number: {currentUser.dbData.phoneNumber}</div>
                    <button onClick={handleShowOne}>Change Phone Number</button>
                    <Modal show={showModalOne} onHide={handleCloseOne}>
                        <Modal.Header closeButton>
                          <Modal.Title>Change Phone Number</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label>Enter new phone number : &nbsp;</label>
                            <input type="text" placeholder="e.g. 5145145145" maxLength={"10"} value={phoneNumber} onChange={(event)=> setPhoneNumber(event.target.value)} />
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleCloseOne}>
                                Close
                            </button>
                            <button onClick={() => {handleCloseOne(); submitPhoneForm();}}>
                                Save Changes
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
                
                {/* SET UP address PATH */}
                <div className={styles['internalCard']}>
                    <div>Address: {currentUser.dbData.address}</div>
                    <button onClick={handleShowTwo}>Change Address</button>
                    <Modal show={showModalTwo} onHide={handleCloseTwo}>
                        <Modal.Header closeButton>
                          <Modal.Title>Change Address</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label>Enter new address: &nbsp;</label>
                            <input type="text" placeholder=""  value={address} onChange={(event)=> setAddress(event.target.value)} />
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleCloseTwo}>
                                Close
                            </button>
                            <button onClick={() => {handleCloseTwo(); submitAddressForm();}}>
                                Save Changes
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>


                {/* Make following dynamic, based on user type will generate Patient Status/Medical License info */}
                <div className={styles['internalCard']}>
                    <div>Patient status:
                        <div>
                            This patient will never give you up
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['profile']}>
                {/* SET UP PROFILE PIC PATH:  */}
                    <img className={styles['profilePic']} src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"/>   
                <div className={styles['nameCard']}>
                    {/* SET UP NAME + DESIGNATION (Dr. Mr. Ms. etc) + */}
                    <div>{currentUser.dbData.name}</div>
                    <button onClick={handleShowName}>Edit Name</button>
                    <Modal show={showModalName} onHide={handleCloseName}>
                        <Modal.Header closeButton>
                          <Modal.Title>Edit Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label>Enter edited name: &nbsp;</label>
                            <input type="text" placeholder="first name"  value={firstName} onChange={(event)=> setFirstName(event.target.value)} />
                            <input type="text" placeholder="last name" value={lastName} onChange={(event)=> setFirstName(event.target.value)}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={handleCloseName}>
                                Close
                            </button>
                            <button onClick={() => {handleCloseName(); submitNameForm();}}>
                                Save Changes
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>

        </div>
    );
}

export default UserProfile;