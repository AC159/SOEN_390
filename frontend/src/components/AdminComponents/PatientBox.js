import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./PatientBox.module.css";
import { useState } from "react";

import { Accordion } from "react-bootstrap";
import { Button } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";

const eventKey = "0";
const patient = null;

function PatientBox(props) {
  
  
  

  return (
    <div className={styles["card-container"]}>
      
      <Accordion.Item eventKey={props.eventKey}>
        <Accordion.Header><h5>{props.patient.name}</h5></Accordion.Header>
        <AccordionBody>
          <h6>Date of Birth: {props.patient.dob}</h6>
          
          <Button variant="primary">Assign Doctor</Button>
          
        </AccordionBody>
      </Accordion.Item>
      
    </div>
  );
}

export default PatientBox;
