import React, {useEffect, useState, useCallback} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import styles from "./ContactTrace.module.css";
import {Accordion, Button} from "react-bootstrap";

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'; 
import { DateRange } from 'react-date-range';
import { addDays } from "date-fns";

function TravelInfo(props){
    let [showModal, setShowModal] = useState(false);
    let [vacationLocation, setVacationLocation] = useState('');
    let [date, setDate] = useState([
        {
          startDate: new Date(),
          endDate: null,
          key: 'selection'
        }
      ]);
      
      
      const closeModal = () => setShowModal(false);
      const openModal = () => setShowModal(true);

      const submitTravelForm = async() => {
          console.log(date.at(0).startDate);
          console.log(date.at(0).endDate);
          console.log(date);
          console.log(vacationLocation);
      }

    return(
        <div>
            <Button variant="info"  className = {styles["submit-button-trace"]} onClick={() => {
                openModal();
            }}>New Travel Form</Button>

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Travel Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label>Enter the start and end date of your travel</label>
                    <div>
                        <DateRange
                            editableDateInputs={true}
                            onChange={item => setDate([item.selection])}
                            moveRangeOnFirstSelection={false}
                            maxDate={addDays(new Date(), 0)} //user cannot pick a date in the future from the current date
                            ranges={date}
                        />
                    </div>  
                    <label>Enter the destination you traveled to</label>
                    <input 
                        type = "text"
                        placeholder = "country, province, city"
                        onChange = {(event) => setVacationLocation(event.target.value)}
                    />
                    <Button onClick={(event) => {
                        submitTravelForm();
                    }}>
                        Submit
                    </Button>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default TravelInfo;