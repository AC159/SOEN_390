import React, {useEffect, useState} from 'react';
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import axios from 'axios';
import {Button} from 'react-bootstrap';
import {io} from 'socket.io-client';

function ContactDoctor(props) {

    let {currentUser} = useAuth();
    let [chats, setChats] = useState([]);
    let [messageInput, setMessageInput] = useState('');
    let [socket, setSocket] = useState(null);

    useEffect(() => {
        let socket = io("ws://localhost:3000");
        socket.on("connect", () => {
            console.log('Connected client socket: ', socket.connected);
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
        const msg = {chatId: chatId, message: messageInput, patientId: patientId, doctorId: doctorId};
        socket.emit('private-message', chatId, msg);
        setChats([...chats, msg]);
        setMessageInput('');
    }

    return (
        <div>
            <div>{chats.length > 0 ? chats.map((msg, index) => <div key={index}>{msg.message}</div>) : 'No chats'}</div>
            <input placeholder={'message'} type='text' value={messageInput} onChange={(event) => setMessageInput(event.target.value)}/>
            <Button disabled={messageInput === ''} onClick={sendMessage}>Send</Button>
        </div>
    );
}

export default ContactDoctor;
