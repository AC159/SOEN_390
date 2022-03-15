import React, {useEffect, useState, useCallback} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import styles from "./CovidFile.module.css";
import {Accordion, Button} from "react-bootstrap";

function ContactTrace(props) {
    let {currentUser} = useAuth();
    let [locationDescription, setLocationDescription] = useState('');
    let [emailList, setEmailList] = useState([{email: ''}]);
    let [date, setDate] = useState('');
    let [showModal, setShowModal] = useState(false);

    const submitContactTracingForm = async () => {
        try {
            const userAttributes = {
                patientUid: currentUser.user.uid,
                emailList: emailList,
                date: date,
                locationDescription: locationDescription

            };
            const response = await axios.post(`/patient/submit-contact-tracing`, userAttributes);
            console.log(response);
        } catch (error) {
            console.log('Submit error: ', error);
        }
    }
    const handleAddQuestionInput = () => {
        setEmailList([...emailList, {email: ""}]); //pushing new input field to list each time this is called
    }

      const handleDeleteInput =  index => {

        console.log(index);
        console.log(emailList);
        const list = [...emailList];
        const list2 = list.splice(index, 1);
        console.log(list);
        setEmailList(list);
        // console.log(list2);
        // console.log(list);
        console.log(emailList)
      }
      const handleQuestionInputChange = (event, index) => {
        const {name, value} = event.target;
        const list = [...emailList];
        list[index][name] = value; //updates list based on the index
        setEmailList(list);
      }

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    return (
        <div>
            <Button variant="info" onClick={openModal}>New Contact Tracing from</Button>
        <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title> Contact Tracing from</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>The date you came in contact with them</label>
                    <input
                    type="date"
                    onChange={(event) =>  setDate(event.target.value)}
                  />
                  <input type="text"
                  onChange={(event) => setLocationDescription(event.target.value)}/>
                  <label>Enter all the people's email</label>
                    {emailList.map((value, index) => {
                        return (
                        <div key ={index}>
                            <input
                          type = "email"
                          name = "email"
                          placeholder = "email"
                          onChange = {event => handleQuestionInputChange(event, index)}
                        />
                        {emailList.length !== 1 && <input
                          type = "button"
                          value = "X"
                          onClick = {() => handleDeleteInput(index)}
                        />}
                    </div>)})}

                  <div>
                      <Button
                        value = "Add email"
                        onClick = {handleAddQuestionInput}>Add email</Button>
                  </div>
                </Modal.Body>
        </Modal>
        </div>

    );
}export default ContactTrace;
