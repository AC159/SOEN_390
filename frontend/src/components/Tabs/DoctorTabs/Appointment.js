import { useEffect, useState } from "react";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Appointment.module.css";
import "../CommonPageStyling.css";
import axios from "axios";
import {Button} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";



function Appointment(props) {
     
    let {currentUser} = useAuth();
    const [patientList, setPatientList] = useState([]);
    const [appointments, setAppointments] = useState([]);

    let [patientId, setPatientId] = useState('');
    let [patientName, setPatientName] = useState('');
    let [dateAndTime, setDateAndTime] = useState(new Date);
    let [title, setTitle] = useState('')
    let [information, setInformation] = useState('');
    
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
            console.log('Patient Array received!');
            console.log(patientList);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPatientArray();
    }, [patientList.length]);

    const submitAppointment = async () => {
        try {
            const userAttributes = {
                doctorId: currentUser.user.uid,
                patientId: patientId,
                patientName: patientName,
                dateAndTime: dateAndTime,
                title: title,
                information: information
            };
            axios.post(`doctor/${currentUser.user.uid}/appointment`, userAttributes)
                .then(function (response) {
                    console.log(response);
                })
        } catch (error) {
            console.log('Submit error: ', error);
        }
    }

    const renderPatientList = () => {
        let optionPatient = patientList.map((patient) =>
                <option data-testid="patient-name" value={patient.uid}>{patient.name}</option> 
            );

        return (
            <div>
                <select onChange={(event) => {setPatientId(event.target.value);}}>
                    {optionPatient}
                </select>
            </div>
        )
    }

    const getAppointments = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/appointments`);
            console.log('Appointments received!');
            console.log(response.data.data.length);
            setAppointments(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAppointments();
    }, [appointments.length]);


    const renderAppointments = () => {
        return <div className={styles["noAppointmentsMessage"]}>
        {appointments.length === 0 ? <div>You have no appointments at this time.</div> : 
        
        appointments.map((appointments, index) =>
            <div key = {index} className={styles["appointmentList"]}>
                <div>
                    <h6>Patient:</h6>
                    <p data-testid="appointment-name">{appointments.patientName}</p>
                </div>
                <div>
                    <h6>Title:</h6>
                    <p data-testid="appointment-title">{appointments.title}</p>
                </div>
                <div>
                    <h6>Info:</h6>
                    <p data-testid="appointment-info">{appointments.information}</p>
                </div>
                <div>
                    <h6>Date and Time:</h6>
                    <p data-testid="appointment-dateTime">{appointments.dateAndTime}</p>
                </div>
            </div>
            )}
        </div>
    }

    return (
        <div>
            <h4>Scheduled Appointments</h4>
            {renderAppointments()}
            <br></br>
            <h4>Add Appointment</h4>
            <form>
                <p>Select Patient:</p>
                {renderPatientList()}
                <div>
                    <p>Select Date & Time: </p>
                    <DatePicker 
                        selected={dateAndTime} 
                        onChange={(dateAndTime) => setDateAndTime(dateAndTime)} 
                        inline
                        showTimeSelect
                        timeIntervals={30}
                        minTime={setHours(setMinutes(new Date(), 0), 7)}
                        maxTime={setHours(setMinutes(new Date(), 0), 20)}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        popperPlacement="top-end"
                    />
                </div>
                <p>Meeting Title:</p>
                <textarea rows="1" cols="50" onChange={(event) => setTitle(event.target.value)}/>
                <p>More Info:</p>
                <textarea rows="4" cols="50" onChange={(event) => setInformation(event.target.value)}/>
                <Button onClick={event => { submitAppointment(); }}>
                    Submit
                </Button>
            </form>
        </div>
    );
}
export default Appointment;