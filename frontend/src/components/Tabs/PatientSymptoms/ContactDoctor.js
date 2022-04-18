import React, {useEffect, useState} from 'react';
import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import axios from 'axios';
import {Button, Spinner} from 'react-bootstrap';
import {io} from 'socket.io-client';

import {Form} from 'react-bootstrap';

import styles from './ContactDoctor.module.css';

function ContactDoctor(props) {
  let {currentUser} = useAuth();
  let [chats, setChats] = useState([]);
  let [messageInput, setMessageInput] = useState('');
  let [socket, setSocket] = useState(null);
  let [isPriority, setIsPriority] = useState(false);

  const togglePriority = () => {
    setIsPriority((prev) => !prev);
  };

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await axios.get(
          `/user/chats/${currentUser.user.uid}/${currentUser.dbData.patientInfo.doctorId}`,
        );
        console.log('Received patient chats: ', response.data);
        setChats([...response.data]);
      } catch (error) {
        console.log('Error fetching chat messages: ', error);
      }
    };
    fetchChat();

    let socket = io();
    socket.on('connect', () => {
      console.log('Connected client socket: ', socket.connected);
    });

    const patientId = currentUser.user.uid;
    const doctorId = currentUser.dbData.patientInfo.doctorId;
    const chatId = patientId + '_' + doctorId;
    socket.emit('join-chat-room', chatId);
    setSocket(socket);

    console.log(socket);

    // close previous socket before creating another one
    return () => {
      socket.close();
      console.log('client socket has disconnected');
    };
  }, []);

  useEffect(() => {
    if (socket !== null) {
      socket.on('private-message', (msg) => {
        console.log('Received new message from patient: ', msg);
        setChats([...chats, msg]);
      });
    }
  });

  const sendMessage = () => {
    const patientId = currentUser.user.uid;
    const doctorId = currentUser.dbData.patientInfo.doctorId;
    const chatId = patientId + '_' + doctorId;
    const msg = {
      chatId: chatId,
      message: messageInput,
      senderId: patientId,
      receiverId: doctorId,
      priority: isPriority,
    };
    socket.emit('private-message', msg);
    setChats([...chats, msg]);
    setMessageInput('');
  };

  return (
    <div>
      <div className={styles['right-side-container']}>
        <div className={styles['chat-box-title']}>
          <div>
            <p>Chat with your Doctor</p>
            <h3>{currentUser.dbData.patientInfo.doctor}</h3>
          </div>
        </div>
        <div className={styles['chat-container']}>
          <div>
            <div className={styles['chats-container']}>
              {socket !== null ? (
                chats.length > 0 ? (
                  chats.map((chat, index) => {
                    return (
                      <div
                        className={
                          chat.senderId === currentUser.user.uid
                            ? chat.priority
                              ? styles['my-message-priority']
                              : styles['my-message']
                            : chat.priority
                            ? styles['their-message-priority']
                            : styles['their-message']
                        }
                        key={index}
                      >
                        {chat.message}
                      </div>
                    );
                  })
                ) : (
                  <p className={styles['empty-message']}>
                    You don't have any messages to and from your Doctor.
                  </p>
                )
              ) : (
                <div>
                  <h4>Loading messages.....</h4>
                  <Spinner data-testid='spinner' animation='grow' variant='primary' />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles['chat-text-box']}>
        <Form.Control
          bsPrefix={styles['input-message']}
          placeholder={'message'}
          type='text'
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
        />
        <Button
          disabled={messageInput === ''}
          onClick={sendMessage}
          className={styles['button']}
          variant={isPriority ? 'danger' : 'success'}
        >
          Send
        </Button>
      </div>
      <div className={styles['priority-box']}>
        <Form.Check
          type='switch'
          id='custom-switch'
          label='Priority Message?'
          onClick={togglePriority}
        />
      </div>
    </div>
  );
}

export default ContactDoctor;
