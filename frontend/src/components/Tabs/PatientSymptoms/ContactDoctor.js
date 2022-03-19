import React, {useEffect, useState} from 'react';
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import axios from 'axios';
import {Button} from 'react-bootstrap';
import clientSocket from 'socket.io-client';

function ContactDoctor(props) {

    let {currentUser} = useAuth();
    let [chats, setChats] = useState([]);
    let socket;

    useEffect(() => {
        socket = clientSocket("ws://localhost:3000");
    })

    useEffect(async () => {
        try {
            const response = await axios.get(`/user/chats/${currentUser.user.uid}/${currentUser.dbData.patientInfo.doctorId}`);
            console.log('Received patient chats: ', response.data);
            setChats([...response.data]);
        } catch (error) {
            console.log('Error fetching chat messages: ', error);
        }
    }, [])

    const sendMessage = async () => {
        const patientId = currentUser.user.uid;
        const doctorId = currentUser.dbData.patientInfo.doctorId;
        const chatId = patientId + '_' + doctorId;
        const msg = {chatId: chatId, message: "Hello world", patientId: patientId, doctorId: doctorId};
        socket.emit('private-message', chatId, msg);
        setChats([...chats, msg]);
    }

    return (
        <div>
            <div>{chats.length > 0 ? chats.map(msg => <div key={msg.timestamp}>{msg.message}</div>) : 'No chats'}</div>
            <Button onClick={sendMessage}>Send</Button>
        </div>
    );
}

export default ContactDoctor;