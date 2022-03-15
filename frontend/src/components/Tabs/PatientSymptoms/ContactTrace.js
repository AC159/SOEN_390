import React, {useEffect, useState, useCallback} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import styles from "./ContactTrace.module.css";
import {Accordion, Button} from "react-bootstrap";

function ContactTrace(props) {
    let {currentUser} = useAuth();
    let [locationDescription, setLocationDescription] = useState('');
    let [emailList, setEmailList] = useState([{email: ''}]);
    // let [emailListDB, setEmailListDB] = useState([{email: ''}]);
    let [date, setDate] = useState('');
    let [showModal, setShowModal] = useState(false);
    let [patientTracing, setTracing] = useState();
    let [timeStamp, setTimeStamp] = useState('');
    let [update, setUpdate] = useState(false);

    const submitContactTracingForm = async () => {
        try {
            const list1 = emailList.filter(email => email.email!== null);
            const list = list1.map(email => email.email);
            const userAttributes = {
                patientUid: currentUser.user.uid,
                emailList: list,
                date: date,
                locationDescription: locationDescription

            };
            const response = await axios.post(`/patient/submit-contact-tracing`, userAttributes);
            console.log(response);
        } catch (error) {
            console.log('Submit error: ', error);
        }
    }

    const updatePatientForm = async () => {
        const list1 = emailList.filter(email => email.email!== null);
        const list = list1.map(email => email.email);
        const userAttributes = {

            emailList: list,
            date: date,
            locationDescription: locationDescription
        };
        console.log(userAttributes);
        axios.post(`/patient/update-contact-tracing/${currentUser.user.uid}&timeStamp=${timeStamp}`, userAttributes)
            .then(function (response) {
                console.log(response);
            }).catch(function (error) {
            console.log(error);
        });

    }

    const fetchPatientContactTracing = async () => {
        try {
            const response = await axios.get(`/patient/get-contact-tracing/${currentUser.user.uid}`);
            console.log(response);
            setTracing(response.data);
        } catch (error) {
            console.log('Unable to fetch patient status forms: ', error);
        }
    }

    useEffect(() => {
        fetchPatientContactTracing();
    }, []);

    const handleAddEmailInput = () => {
        setEmailList([...emailList, {email: ""}]); //pushing new input field to list each time this is called
    }

    const handleDeleteInput = index => {
        const list = [...emailList];
        list.splice(index, 1);
        setEmailList(list);
    }
    const handleEmailInputChange = (event, index) => {
        const {name, value} = event.target;
        const list = [...emailList];
        list[index][name] = value; //updates list based on the index
        setEmailList(list);
    }

    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);


    const showModalForTracingFormUpdate = (formIndex) => {
        setUpdate(true);
        if (patientTracing[formIndex].emailList !== null) {
            setEmailList(patientTracing[formIndex].emailList);
        }
        if (patientTracing[formIndex].date) {
            setDate(patientTracing[formIndex].date);
            setTimeStamp(patientTracing[formIndex].timeStamp)
        }
        if (patientTracing[formIndex].locationDescription) {
            setLocationDescription(patientTracing[formIndex].locationDescription);
        }


        openModal();
    }

    return (
        <div>
            <Button variant="info"  className = {styles["submit-button-trace"]} onClick={() => {
                openModal();
                setUpdate(false);
                setEmailList([{email: ''}]);
            }}>New Contact Tracing from</Button>
            {patientTracing ? <Accordion defaultActiveKey="0">
                {patientTracing.map((element, index) => {
                    let date = new Date(element.timeStamp);
                    return <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>Created
                            on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(element).map(([key, value], index) => {
                                if (key === 'timeStamp') {
                                    // setTimeStamp({value})
                                }
                                if (!value || key === '_id' || key === 'patientUid' || key === 'timeStamp' || value.length === 0) return null;

                                if (Array.isArray(value)) {
                                    return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li
                                        key={i}>{element}</li>)}</ul></div>;
                                } else return <div key={index}><strong>{key}</strong>: {value}</div>;
                            })}
                            {/*<Button variant="info" onClick={() => {*/}
                            {/*    showModalForTracingFormUpdate(index);*/}

                            {/*}}>Update</Button>*/}
                        </Accordion.Body>
                    </Accordion.Item>;
                })} </Accordion> : null}


            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title> Contact Tracing from</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>The date you came in contact with them</label>
                    <input

                        type="date"
                        defaultValue={update ? date : null}
                        onChange={(event) => setDate(event.target.value)}
                    />
                     <label>Enter the location info</label>
                    <input type="text"
                           defaultValue={update ? locationDescription : null}
                           onChange={(event) => setLocationDescription(event.target.value)}/>
                    <label>Enter all the people's email</label>
                    {emailList.map((value, index) => {
                        return (
                            <div key={index}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="email"
                                    value={value.email}
                                    className={styles[emailList.length !== 1 && "email-input-trace"]}
                                    // defaultValue={update === true ? emailList[index] : null}
                                    onChange={event => handleEmailInputChange(event, index)}
                                />
                                {emailList.length !== 1 && <input
                                    type="button"
                                    value="X"
                                    className = {styles["delete-button-trace"]}
                                    onClick={() => handleDeleteInput(index)}
                                />}
                            </div>)
                    })}

                    <div>
                        <Button
                            value="Add email"
                            onClick={handleAddEmailInput}>Add email</Button>

                        <Button onClick={(event) => {
                            // setEmailList(emailListDB);
                            submitContactTracingForm();
                            fetchPatientContactTracing();
                            closeModal();
                        }}>Submit</Button>
                        {/*<Button onClick={(event) => {*/}
                        {/*    updatePatientForm();*/}
                        {/*    fetchPatientContactTracing();*/}
                        {/*    closeModal();*/}
                        {/*}}>Update</Button>*/}
                    </div>
                </Modal.Body>
            </Modal>
        </div>

    );
}

export default ContactTrace;
