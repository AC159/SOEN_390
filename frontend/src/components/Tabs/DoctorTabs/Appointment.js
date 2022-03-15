import { useEffect, useState } from "react";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Appointment.module.css";
import "../CommonPageStyling.css";
import axios from "axios";
import {Button, Container, Row, Col} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import moment from "moment";


function Appointment(props) {
     
    let {currentUser} = useAuth();
    const [patientList, setPatientList] = useState([]);
    const [appointments, setAppointments] = useState([]);

    let [patientId, setPatientId] = useState('');
    let [patientName, setPatientName] = useState('');
    let [dateAndTime, setDateAndTime] = useState(new Date);
    let [title, setTitle] = useState('')
    let [information, setInformation] = useState('');
    let dateArr = [];
    let arrExcludedTimes = [];
    
    //Get array of patients assigned to specific doctor.
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPatientArray();
    }, []);

    //Returns patient ID based on selected patient name.
    function id(pName){
        let patientArr = [];
        let uName = pName;
        for(var i of patientList)
        {
            patientArr.push(i);
        }

        var index = patientArr.findIndex(item => item.name === uName);
        let patient = patientArr[index];
        let pId = patient["uid"];

        return(
            pId
        )
    }

    //Dropdown including all patients assigned to a doctor.
    const renderPatientList = () => {
        let optionPatient = patientList.map((patient, index) =>
                <option data-testid="select-patient-name" key={index}>{patient.name}</option> 
            );

        return (
            <div>
                <select data-testid="select-patient" onChange={(event) => {setPatientId(id(event.target.value)); setPatientName(event.target.value);}}>
                    {optionPatient}
                </select>
            </div>
        )
    }

    //Submit appointment information into database.
    const submitAppointment = async () => {
        try {
            const userAttributes = {
                doctorId: currentUser.user.uid,
                patientId: patientId,
                patientName: patientName,
                dateAndTime: dateAndTime.getTime(),
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

    //Retrieve appointment information from database.
    const getAppointments = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/appointments`);
            setAppointments(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAppointments();
    }, [appointments.length]);

    //Change timestamp into readable date and time.
    //Also get appointment times already booked to exclude them from possible future bookings.
    function showTimeStamp(timeStamp) {
        const fullDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(timeStamp)

        var year = parseInt(fullDate.slice(6,10));
        var month = parseInt(fullDate.slice(0,2))-1;
        var day = parseInt(fullDate.slice(3,5));
        var hour = parseInt(fullDate.slice(12,14));
        var minute = parseInt(fullDate.slice(15,17));
        var ampm = fullDate.slice(18);

        if (ampm === 'PM')
        {
            hour = hour + 12;
        }

        var newDate = new Date(year, month, day, hour, minute);
        dateArr.push(newDate);
        
        let arrSpecificDates = [];
        for (let i = 0; i < dateArr.length; i++) {
            if (
                moment(dateAndTime, moment.ISO_8601).format("YYYY/MM/DD") ===
                moment(dateArr[i], moment.ISO_8601).format("YYYY/MM/DD")
            ) {
                arrSpecificDates.push(moment(dateArr[i], moment.ISO_8601).toObject());
            }
        }

        for (let i = 0; i < arrSpecificDates.length; i++) {
            arrExcludedTimes.push(
                setHours(
                setMinutes(new Date(), arrSpecificDates[i].minutes),
                arrSpecificDates[i].hours
                )
            );
        }

        return(
            fullDate
        );
    }

    //Show list of existing appointments.
    const renderAppointments = () => {
        return <div data-testid="appointment-list" className={styles["noAppointmentsMessage"]}>
        {appointments.length === 0 ? <div>You have no appointments at this time.</div> : 
        
        appointments.map((appointments, index) =>
            <div key = {index} className={styles["appointmentList"]}>
                <div>
                    <h6>Patient:</h6>
                    <p>{appointments.patientName}</p>
                </div>
                <div>
                    <h6>Title:</h6>
                    <p>{appointments.title}</p>
                </div>
                <div>
                    <h6>Info:</h6>
                    <p>{appointments.information}</p>
                </div>
                <div>
                    <h6>Date and Time:</h6>
                    <p>{showTimeStamp(appointments.dateAndTime)}</p>
                </div>
            </div>
            )}
        </div>
    }

    return (
        <div data-testid="appointment-1">
            <h4 className={styles["scheduleAppointment"]}>Scheduled Appointments</h4>
            {renderAppointments()}
            <br></br>
            
            <div className={styles["addAppointment"]}>
                <h4>Add Appointment</h4>
                <div className={styles["form-group"]}>
                    <form className={styles["bookAppointmentForm"]}> 
                        <div className={styles["selectPatient"]}>
                            <p>Select Patient:</p>
                            {renderPatientList()}
                        </div>
                        <Container>
                            <Row>
                                <Col sm={4}>
                                    <div className={styles["datePicker"]}>
                                        <p>Select Date & Time: </p>
                                        <DatePicker 
                                            selected={dateAndTime} 
                                            excludeTimes={arrExcludedTimes}
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
                                </Col>
                                <Col sm={8}>
                                    <div className={styles["appointmentInfo"]}>
                                        <p>Meeting Title:</p>
                                        <textarea onChange={(event) => setTitle(event.target.value)}/>
                                        <p>More Info:</p>
                                        <textarea className={styles["moreInfo"]} onChange={(event) => setInformation(event.target.value)}/>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <br></br>

                        <div class="col-md-12 text-center">
                            <Button data-testid="viewBookAppointmentBtn" class="btn btn-outline-dark justify-content-center" variant="secondary" onClick={event => { submitAppointment(); }}>
                                Book Appointment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Appointment;