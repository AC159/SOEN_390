import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {Accordion, Button} from 'react-bootstrap';

import styles from './PatientBox.module.css';

const PatientInfoItem = ({type, element, index, render, doctorButton = (id) => {}}) => {
  const [id, setId] = useState('');
  const [date, setDate] = useState('');
  const [info, setInfo] = useState([]);

  useEffect(() => {
    setId(element._id);
    setDate(moment(new Date(element.timestamp * 1000)).format('dddd, MMMM Do YYYY, h:mm:ss a'));

    const predicates = {
      doctor: (value, key) => value && !['_id', 'patientUid', 'timestamp'].includes(key) && value.length !== 0,
      administrator: (_, key) => key === 'covidStatus',
      healthOfficial: (value, key) => value && !['_id', 'patientUid', 'timestamp', 'temperature', 'otherSymptoms', 'symptomDetails', 'health', 'symptoms', 'doctorQuestions'].includes(key) && value.length > 0,
    };

    const predicate = predicates[type];
    const data = Object.fromEntries(Object.entries(element).filter(([key, value], _) => predicate(value, key)));

    setInfo(data);
  }, [type, element]);

  return (
    <Accordion.Item eventKey={index}>
      <Accordion.Header>Created on {date}</Accordion.Header>
      <Accordion.Body>
        {render(info)}
        {doctorButton(id)}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default PatientInfoItem;

export const DoctorPatientInfoList = ({element, index, isFormSelected, setSelectedFormId, selectedFormId}) => {
  return (
    <PatientInfoItem
      type='doctor'
      element={element}
      index={index}
      render={(info) =>
        Object.entries(info).map(([key, value], index) => {
          if (Array.isArray(value) && typeof value[0] === 'object') {
            return (
              <div key={index}>
                <strong>Doctor questions</strong>:
                <ul>
                  {value.map((element, i) => (
                    <div key={i}>
                      <li>{element.question}</li>
                      <p>{element.answer}</p>
                    </div>
                  ))}
                </ul>
              </div>
            );
          }
          if (Array.isArray(value)) {
            return (
              <div key={index}>
                <strong>{key}</strong>:
                <ul>
                  {value.map((element, i) => (
                    <li key={i}>{element}</li>
                  ))}
                </ul>
              </div>
            );
          } else
            return (
              <div key={index}>
                <strong>{key}</strong>: {value}
              </div>
            );
        })
      }
      doctorButton={(id) => {
        return (
          isFormSelected && (
            <Button
              className={styles['form-select-button']}
              onClick={(e) => {
                setSelectedFormId(id);
              }}
              variant={selectedFormId === id ? 'primary' : 'outline-primary'}
            >
              {selectedFormId === id ? 'Selected' : 'Select this form'}
            </Button>
          )
        );
      }}
    />
  );
};

export const HOPatientInfoList = ({element, index}) => {
  return (
    <PatientInfoItem
      type='healthOfficial'
      element={element}
      index={index}
      render={(info) =>
        Object.entries(info).map(([key, value], index) => {
          if (Array.isArray(value)) {
            return (
              <div key={index}>
                <strong>{key}</strong>:{' '}
                <ul>
                  {value.map((el, i) => (
                    <li key={i}>{el}</li>
                  ))}
                </ul>
              </div>
            );
          }
          return (
            <div key={index}>
              <strong>{key}</strong>: {value}
            </div>
          );
        })
      }
    />
  );
};

export const AdnminPatientInfoList = ({element, index}) => {
  return (
    <PatientInfoItem
      type='administrator'
      element={element}
      index={index}
      render={(info) =>
        Object.entries(info).map(([_, value], index) => (
          <div key={index}>
            <strong>Covid Status</strong>: {value}
          </div>
        ))
      }
    />
  );
};
