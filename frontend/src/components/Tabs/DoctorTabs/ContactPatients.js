import React, {useEffect, useState} from 'react';
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import axios from 'axios';
import {Button, ListGroup, Spinner} from 'react-bootstrap';
import {io} from "socket.io-client";

function ContactPatients(props) {

    let {currentUser} = useAuth();
    let [chats, setChats] = useState([]);
    let [patients, setPatients] = useState([]);
    let [messageInput, setMessageInput] = useState('');
    let [selectedChatIndex, setSelectedChatIndex] = useState(-1);
    let [socket, setSocket] = useState(null);

    useEffect(() => {
        let socket = io("ws://localhost:3000");
        socket.on("connect", () => {
            console.log('Connected client socket: ', socket.connected);
        });

        socket.on('private-message', (otherSocketId, msg) => {
            console.log(`Received new message from doctor on socket ${otherSocketId}: `, msg);
            setChats([...chats, msg]);
        });

        setSocket(socket);

        // close previous socket before creating another one
        return () => {
            socket.close();
            console.log('Disconnected client socket');
        };
    }, [])

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
        } catch (error) {
            console.log('Error fetching chat messages: ', error);
        }
    }

    const sendMessage = async () => {
        const patientId = patients[selectedChatIndex].uid;
        const doctorId = currentUser.user.uid;
        const chatId = patientId + '_' + doctorId;
        const msg = {chatId: chatId, message: messageInput, patientId: patientId, doctorId: doctorId};
        console.log('Is socket connected: ', socket.connected);
        socket.emit('private-message', chatId, msg);
        setChats([...chats, msg]);
        setMessageInput('');
    }

    return (
        <div>
            <ListGroup defaultActiveKey="#link1">
                {patients.length > 0 ? patients.map((patient, index) => {
                    return <ListGroup.Item key={index} action onClick={() => fetchChatMessages(index)}>
                            {patient.name}
                           </ListGroup.Item>
                    }
                ) : <Spinner animation="border" variant="primary" />}
            </ListGroup>
            {selectedChatIndex === -1 ? 'Select a patient chat' :
                <div>
                    <div>
                        <div>Chat Box</div>
                        {chats.length > 0 ? chats.map((chat, index) => {
                            return <div key={index}>{chat.message}</div>
                        }) : 'No messages!'}
                    </div>
                    <input placeholder={'message'} type='text' value={messageInput} onChange={(event) => setMessageInput(event.target.value)}/>
                    <Button disabled={selectedChatIndex === -1 || messageInput === ''} onClick={sendMessage}>Send</Button>
                </div>}
        </div>
    );
}

export default ContactPatients;
