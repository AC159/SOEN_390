import {useEffect, useState} from 'react';
import moment from 'moment';
import axios from 'axios';
import {Button, Container, Row, Col} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import {addDays, setHours, setMinutes} from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

import useFetch from '../../../hook/useFetch';
import {useAuth} from '../../Authentication/FirebaseAuth/FirebaseAuth';
import Pagination from '../../../features/Pagination/Pagination';
import styles from './Appointment.module.css';
import '../CommonPageStyling.css';

function Appointment(props) {
  let {currentUser} = useAuth();
  const [patientList, getPatientArray] = useFetch(
    [],
    `doctor/${currentUser.user.uid}/patientArray`,
  );
  const [appointments, getAppointments] = useFetch(
    [],
    `doctor/${currentUser.user.uid}/appointments`,
  );

  let [patientId, setPatientId] = useState('');
  let [patientName, setPatientName] = useState('');
  let [dateAndTime, setDateAndTime] = useState('');
  let [title, setTitle] = useState('');
  let [information, setInformation] = useState('');
  let [meetingLink, setMeetingLink] = useState('');
  let dateArr = [];
  let arrExcludedTimes = [];

  useEffect(() => {
    getPatientArray();
  }, []);

  //Dropdown including all patients assigned to a doctor.
  const renderPatientList = () => {
    let optionPatient = patientList.map((patient, index) => (
      <option
        data-testid='select-patient-name'
        key={index}
        value={`${patient.uid}|${patient.name}`}
      >
        {patient.name}
      </option>
    ));

    return (
      <div>
        <select
          data-testid='select-patient'
          onChange={(event) => {
            const values = event.target.value.split('|');
            setPatientId(values[0]);
            setPatientName(values[1]);
          }}
        >
          {optionPatient}
        </select>
      </div>
    );
  };

  //Submit appointment information into database.
  const submitAppointment = async () => {
    if (patientName === '') {
      alert('Patient is required');
      return;
    }
    if (title === '') {
      alert('Meeting Title is required');
      return;
    }
    if (information === '') {
      alert('Meeting Details is required');
      return;
    }
    if (dateAndTime === '') {
      alert('Date & Time is required');
      return;
    }
    if (meetingLink === '') {
      alert('Meeting Link is required');
      return;
    }
    try {
      const userAttributes = {
        doctorId: currentUser.user.uid,
        patientId: patientId,
        patientName: patientName,
        dateAndTime: dateAndTime.getTime(),
        title: title,
        information: information,
        meetingLink: meetingLink,
      };
      axios
        .post(`doctor/${currentUser.user.uid}/appointment`, userAttributes)
        .then(function (response) {
          console.log(response);
          setDateAndTime('');
          setTitle('');
          setInformation('');
          setMeetingLink('');
          getAppointments();
        });
      alert('Created');
    } catch (error) {
      console.log('Submit error: ', error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, [appointments]);

  //Change timestamp into readable date and time.
  //Also get appointment times already booked to exclude them from possible future bookings.
  function showTimeStamp(timeStamp) {
    const fullDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timeStamp);

    var year = parseInt(fullDate.slice(6, 10));
    var month = parseInt(fullDate.slice(0, 2)) - 1;
    var day = parseInt(fullDate.slice(3, 5));
    var hour = parseInt(fullDate.slice(12, 14));
    var minute = parseInt(fullDate.slice(15, 17));
    var ampm = fullDate.slice(18);

    if (ampm === 'PM') {
      hour = hour + 12;
    }

    var newDate = new Date(year, month, day, hour, minute);
    dateArr.push(newDate);

    let arrSpecificDates = [];
    for (let i = 0; i < dateArr.length; i++) {
      if (
        moment(dateAndTime, moment.ISO_8601).format('YYYY/MM/DD') ===
        moment(dateArr[i], moment.ISO_8601).format('YYYY/MM/DD')
      ) {
        arrSpecificDates.push(moment(dateArr[i], moment.ISO_8601).toObject());
      }
    }

    for (let i = 0; i < arrSpecificDates.length; i++) {
      arrExcludedTimes.push(
        setHours(setMinutes(new Date(), arrSpecificDates[i].minutes), arrSpecificDates[i].hours),
      );
    }

    return fullDate;
  }

  //Show list of existing appointments.
  const renderAppointments = () => {
    return (
      <div data-testid='appointment-list' className={styles['noAppointmentsMessage']}>
        <Pagination
          data={appointments}
          emptyMessage='You have no appointments at this time.'
          render={(appointments, index) => (
            <div key={index} className={styles['appointmentList']}>
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
        />
      </div>
    );
  };

  return (
    <div data-testid='appointment-1'>
      <div className={styles['addAppointment']}>
        <h4>Add Appointment</h4>
        <div className={styles['form-group']}>
          <form className={styles['bookAppointmentForm']}>
            <div className={styles['selectPatient']}>
              <p>Select Patient:</p>
              {renderPatientList()}
            </div>
            <Container>
              <Row>
                <Col sm={4}>
                  <div className={styles['datePicker']}>
                    <p>Select Date & Time: </p>
                    <DatePicker
                      selected={dateAndTime}
                      excludeTimes={arrExcludedTimes}
                      onChange={(dateAndTime) => setDateAndTime(dateAndTime)}
                      inline
                      showTimeSelect
                      timeIntervals={30}
                      minDate={addDays(new Date(), 1)}
                      minTime={setHours(setMinutes(new Date(), 0), 9)}
                      maxTime={setHours(setMinutes(new Date(), 0), 19)}
                      timeCaption='Time'
                      dateFormat='h:mm aa'
                      popperPlacement='top-end'
                      data-testid='date-input'
                    />
                  </div>
                </Col>
                <Col sm={8}>
                  <div className={styles['appointmentInfo']}>
                    <p>Meeting Title:</p>
                    <textarea
                      data-testid='title-input'
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                    />
                    <p>Meeting Details:</p>
                    <textarea
                      value={information}
                      data-testid='meeting-detail-input'
                      className={styles['moreInfo']}
                      onChange={(event) => setInformation(event.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </Container>
            <div className={styles['selectPatient']}>
              <p>Meeting Link:</p>
              <textarea
                data-testid='meeting-link-input'
                value={meetingLink}
                placeholder='https//zoom.us/zoom-link-example'
                onChange={(event) => setMeetingLink(event.target.value)}
              />
            </div>

            <div class='col-md-12 text-center'>
              <Button
                data-testid='viewBookAppointmentBtn'
                class='btn btn-outline-dark justify-content-center'
                variant='secondary'
                onClick={() => submitAppointment()}
              >
                Book Appointment
              </Button>
            </div>
          </form>
        </div>
      </div>
      <h4 className={styles['scheduleAppointment']}>Scheduled Appointments</h4>
      {renderAppointments()}
    </div>
  );
}

export default Appointment;
