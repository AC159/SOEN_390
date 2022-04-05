import React, {useEffect, useState} from 'react';
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import axios from 'axios';
import {Button, Badge, Spinner} from 'react-bootstrap';
import {io} from "socket.io-client";
import {Tab, Row, Col, Nav, Form} from "react-bootstrap";

import styles from "./ContactPatients.module.css";

function ContactPatients(props) {

    let {currentUser} = useAuth();
    let [chats, setChats] = useState([]);
    let [patients, setPatients] = useState([]);
    let [messageInput, setMessageInput] = useState('');
    let [selectedChatIndex, setSelectedChatIndex] = useState(-1);
    let [socket, setSocket] = useState(null);
    let [isPriority, setIsPriority] = useState(false);

    const togglePriority = () => {
        if(isPriority)
        setIsPriority(false);
        else setIsPriority(true);

    }

    useEffect(() => {
        if (selectedChatIndex !== -1) {

            let socket = io("ws://localhost:3000");
            socket.on("connect", () => {
                console.log('Connected client socket: ', socket.connected);
            });

            const patientId = patients[selectedChatIndex].uid;
            const doctorId = currentUser.user.uid;
            const chatId = patientId + '_' + doctorId;
            socket.emit('join-chat-room', chatId);
            setSocket(socket);

            // close previous socket before creating another one
            return () => {
                socket.close();
                console.log('client socket has disconnected');
            };
        }
    }, [selectedChatIndex])

    useEffect(() => {
        if (socket !== null) {
            socket.on('private-message', (msg) => {
                console.log('Received new message from patient: ', msg);
                setChats([...chats, msg]);
            });
        }
    })

    useEffect(async () => {
        try {
            const res = await axios.get(`/doctor/${currentUser.user.uid}/patientArray`);
            console.log('Patients: ', res.data.data);
            setPatients([...res.data.data]);
        } catch (error) {
            console.log('Error fetching list of patients: ', error);
        }
    }, [])

    const fetchChatMessages = async (patientIndex) => {
        try {
            const response = await axios.get(`/user/chats/${patients[patientIndex].uid}/${currentUser.user.uid}`);
            console.log('Received patient chats: ', response.data);
            setChats([...response.data]);
            setSelectedChatIndex(patientIndex);
            setIsPriority(false);
        } catch (error) {
            console.log('Error fetching chat messages: ', error);
        }
    }

    const sendMessage = () => {
        const patientId = patients[selectedChatIndex].uid;
        const doctorId = currentUser.user.uid;
        const chatId = patientId + '_' + doctorId;
        const msg = {chatId: chatId, message: messageInput, senderId: doctorId, receiverId: patientId, priority: isPriority};
        console.log('Is socket connected: ', socket.connected);
        socket.emit('private-message', msg);
        setChats([...chats, msg]);
        setMessageInput('');
    }

    patients.map((patient, index) => {
        return <Tab.Content onClick={() => fetchChatMessages(index)}>
                <Tab.Pane eventKey={index}></Tab.Pane>
                {patient.name}
               </Tab.Content>
        }
    )
    return (
        <div className={styles["overall-container"]}>
            <div className="select-patient-container">
            <Tab.Container id="left-tabs-example" defaultActiveKey="-1">
                {patients.length > 0 ? 
                <Row>
                <Col>
                {patients.map((patient, index) => {
                return <Nav variant="pills" className="flex-column" onClick={() => fetchChatMessages(index)}>
                    <Nav.Item>
                        <Nav.Link eventKey={index}>{patient.name}</Nav.Link>
                    </Nav.Item>
               </Nav>
                })}
                </Col>
                <Col sm={9}>
                {selectedChatIndex === -1 ? 'Select a patient chat' : 
                <div className={styles["right-side-container"]}>
                    <div className={styles["chat-box-title"]}>
                        <h3><strong>{patients[selectedChatIndex].name}</strong></h3>
                        <p>{"PatientID: "+patients[selectedChatIndex].uid}</p>
                        {patients[selectedChatIndex].doctorFlagInfo.isFlagged == true 
                        ? <Badge bg={"danger"} >FLAGGED</Badge> 
                        : null}
                    </div>
                    <div className={styles["chat-container"]}>
                        <div>
                            <div className={styles["chats-container"]}>
                            {chats.length > 0 ? chats.map((chat, index) => {
                                return <div className={(chat.senderId === currentUser.user.uid) 
                                ? chat.priority ? styles["my-message-priority"] : styles["my-message"] 
                                : chat.priority ? styles["their-message-priority"] : styles["their-message"]} 
                                key={index}>
                                        {chat.message}
                                    </div>
                            }) : <p className={styles["empty-message"]}>
                                You don't have any messages to and from {patients[selectedChatIndex].name}
                                </p>}
                            </div>
                        </div>
                        <div className={styles["chat-text-box"]}>
                        <Form.Control bsPrefix={styles["input-message"]} placeholder={'message'} type='text' value={messageInput} onChange={(event) => setMessageInput(event.target.value)}/>
                        <Button 
                        disabled={selectedChatIndex === -1 || messageInput === ''} 
                        onClick={sendMessage} 
                        className={styles["button"]} 
                        variant={isPriority ? "danger" : "success"}>
                            Send
                        </Button>
                        </div>
                        <div className={styles["priority-box"]}>
                            <Form.Check type="switch" id="custom-switch" label="Priority Message?" onClick={togglePriority}/>
                        </div>
                    
                    </div>
                </div>
                }
                </Col>
                </Row> 
                : <Spinner animation="border" variant="primary" />}
                
            </Tab.Container>
            
            </div>
            
        </div>
    );
}

export default ContactPatients;
