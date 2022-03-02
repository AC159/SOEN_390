import React, {useEffect, useState} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import styles from "./CovidFile.module.css";
import {Accordion, Button} from "react-bootstrap";

function CovidFile(props) {
    let {currentUser} = useAuth();
    let [covidStat, setCovidStat] = useState('');
    let [haveSymptoms, setHaveSymptoms] = useState('');
    let [userSymptoms, setUserSymptoms] = useState([]);
    let [haveFever, setHaveFever] = useState(false);
    let [temp, setTemp] = useState('');
    let [other, setOther] = useState(false)
    let [whatOtherSymptoms, setWhatOtherSymptoms] = useState('');
    let [symptomDetails, setSymptomDetails] = useState('');
    let [health, setHealth] = useState('');
    let [patientData, setPatientData] = useState();
    const [showModal, setShowModal] = useState(false);
    let [selectedFormIndex, setSelectedFormIndex] = useState(-1);

    const submitPatientForm = async () => {
        try {
            const userAttributes = {
                patientUid: currentUser.user.uid,
                covidStatus: covidStat,
                symptoms: userSymptoms,
                temperature: temp,
                otherSymptoms: whatOtherSymptoms,
                symptomDetails: symptomDetails,
                health: health
            };
            axios.post(`/patient/submit-status-form`, userAttributes)
                .then(function (response) {
                    console.log(response);
                })
        } catch (error) {
            console.log('Submit error: ', error);
        }
    }

    const updatePatientForm = async () => {
        const userAttributes = {
            _id: patientData[selectedFormIndex]._id,
            patientUid: currentUser.user.uid,
            covidStatus: covidStat,
            symptoms: userSymptoms,
            temperature: temp,
            otherSymptoms: whatOtherSymptoms,
            symptomDetails: symptomDetails,
            health: health
        };
        console.log(userSymptoms);
        axios.post(`/patient/update-status-form/${currentUser.user.uid}`, userAttributes)
            .then(function (response) {
                console.log(response);
            }).catch(function (error) {
            console.log(error);
        });
        setSelectedFormIndex(-1);
    }

    const fetchPatientForm = async () => {
        try {
            const response = await axios.get(`/patient/get-status-forms/${currentUser.user.uid}`);
            console.log(response);
            setPatientData(response.data);
        } catch (error) {
            console.log('Unable to fetch patient status forms: ', error);
        }
    }

    useEffect(() => {
        fetchPatientForm();
    }, []);


    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const showModalForCovidFormUpdate = (formIndex) => {
        setCovidStat(patientData[formIndex].covidStatus);
        setHaveSymptoms(patientData[formIndex].symptoms.length > 0 ? 'yes' : 'no');
        setUserSymptoms(patientData[formIndex].symptoms);
        setHaveFever(!!patientData[formIndex].temperature);
        setTemp(patientData[formIndex].temperature);
        setOther(!!patientData[formIndex].otherSymptoms);
        setWhatOtherSymptoms(patientData[formIndex].otherSymptoms);
        setSymptomDetails(patientData[formIndex].symptomDetails);
        setHealth(patientData[formIndex].health);
        setSelectedFormIndex(formIndex);
        openModal();
    }

    function removeUnchecked(value) {
        const index = userSymptoms.indexOf(value);
        if (index !== -1) {
            userSymptoms.splice(index, 1);
        }
    }

    return (

        <div>
            <Button variant="info" onClick={openModal}>New form</Button>
            {patientData ? <Accordion defaultActiveKey="0">
                {patientData.map((element, index) => {
                let date = new Date(element.timestamp * 1000);
                return <Accordion.Item eventKey={index} key={index}>
                        <Accordion.Header>Created on {moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Accordion.Header>
                        <Accordion.Body>
                            {Object.entries(element).map(([key, value], index) => {
                                if (!value || key === '_id' || key === 'patientUid' || key === 'timestamp' || value.length === 0) return null;
                                if (Array.isArray(value)) {
                                    return <div key={index}><strong>{key}</strong>: <ul>{value.map((element, i) => <li key={i}>{element}</li>)}</ul></div>;
                                } else return <div key={index}><strong>{key}</strong>: {value}</div>;
                            })}
                            <Button variant="info" onClick={() => showModalForCovidFormUpdate(index)}>Update</Button>
                        </Accordion.Body>
                    </Accordion.Item>;
            })} </Accordion> : null}

            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedFormIndex >= 0 ? 'Update a ' : 'Create a new '} covid status form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <h6>Select your Covid Status:</h6>
                        <select
                            defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].covidStatus : null}
                            onChange={(event) => {
                                setCovidStat(event.target.value);
                                if (event.target.value === "None") {
                                    setUserSymptoms([]);
                                    setTemp("");
                                    setWhatOtherSymptoms("");
                                    setSymptomDetails("");
                                }
                            }}>
                            <option value="None">None</option>
                            <option value="Not tested">Not tested</option>
                            <option value="Positive">Positive</option>
                            <option value="Negative">Negative</option>
                        </select>
                        <br/>

                        <h6>Do you have any symptoms:</h6>
                        <select
                            defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms.length > 0 ? 'yes' : 'no' : null}
                            onChange={(event) => {
                                setHaveSymptoms(event.target.value);
                                if (event.target.value === "no") {
                                    setUserSymptoms([]);
                                }
                            }}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>

                        <div
                            className={styles[haveSymptoms === "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                            <br/>
                            <h6>Select all the Symptoms you feel:</h6>

                            <input type="checkbox" id="fever" name="symptoms"
                                   value="Fever or feeling feverish (such as chills, sweating)"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Fever or feeling feverish (such as chills, sweating)')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                           setHaveFever(true);
                                       } else {
                                           removeUnchecked(e.target.value);
                                           setHaveFever(false);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="fever">Fever or feeling feverish (such as chills, sweating)</label>
                            <br/>

                            <input type="checkbox" id="breathing" name="symptoms"
                                   value="Mild or moderate difficulty breathing (breathing slightly faster than normal, feeling like you can’t inhale or exhale,
                                   or wheezing, especially during exhaling or breathing out)"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Mild or moderate difficulty breathing ' +
                                   '(breathing slightly faster than normal, feeling like you can’t inhale or exhale, or wheezing, especially during exhaling or breathing out)')]
                                       : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="breathing">Mild or
                                moderate difficulty breathing (breathing slightly faster than normal, feeling
                                like you can’t inhale or exhale, or wheezing, especially during exhaling or breathing out)</label>
                            <br/>

                            <input type="checkbox" id="throat" name="symptoms"
                                   value="Sore throat"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Sore throat')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="throat">Sore
                                throat</label>
                            <br/>

                            <input type="checkbox" id="muscle" name="symptoms"
                                   value="Muscle aches or body aches"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Muscle aches or body aches')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="muscle">Muscle aches or body aches</label>
                            <br/>

                            <input type="checkbox" id="fatigue" name="symptoms"
                                   value="Unusual fatigue"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Unusual fatigue')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="fatigue">Unusual
                                fatigue</label>
                            <br/>

                            <input type="checkbox" id="headache" name="symptoms"
                                   value="Headache"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Headache')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']}
                                   htmlFor="headache">Headache</label>
                            <br/>

                            <input type="checkbox" id="taste" name="symptoms"
                                   value="New loss of taste or smell"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('New loss of taste or smell')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="taste">New loss of
                                taste
                                or smell</label>
                            <br/>

                            <input type="checkbox" id="congestion" name="symptoms"
                                   value="Congestion or runny nose"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Congestion or runny nose')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="congestion">Congestion or runny nose</label>
                            <br/>

                            <input type="checkbox" id="nausea" name="symptoms"
                                   value="Nausea or vomiting"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Nausea or vomiting')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="nausea">Nausea or
                                vomiting</label>
                            <br/>

                            <input type="checkbox" id="diarrhea" name="symptoms"
                                   value="Diarrhea"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Diarrhea')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']}
                                   htmlFor="diarrhea">Diarrhea</label>
                            <br/>

                            <input type="checkbox" id="other" name="symptoms"
                                   value="Other symptoms"
                                   defaultChecked={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptoms[
                                       patientData[selectedFormIndex].symptoms.indexOf('Other symptoms')] : null}
                                   onChange={(e) => {
                                       if (e.target.checked) {
                                           setOther(true);
                                           setUserSymptoms([...userSymptoms, e.target.value]);
                                       } else {
                                           setOther(false);
                                           removeUnchecked(e.target.value);
                                       }
                                   }}/>
                            <label className={styles['checkBox-Label_CovidFile']} htmlFor="other">Other
                                symptoms</label>
                            <br/>

                        </div>

                        <div className={styles[haveFever ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                            <br/>
                            <h6>What is your temperature?</h6>
                            <input type="number"
                                   defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].temperature : null}
                                   min={0} step=".01" onChange={(e) => setTemp(e.target.value)}/>
                        </div>

                        <div className={styles[other ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                            <br/>
                            <h6>What are the other symptoms?</h6>
                            <textarea rows="4" cols="50"
                                      defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].otherSymptoms : null}
                                      onChange={(e) => setWhatOtherSymptoms(e.target.value)}/>
                        </div>

                        <div className={styles[haveSymptoms === "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                            <br/>
                            <h6>Anything to add about your symptoms?</h6>
                            <textarea rows="4" cols="50"
                                      defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].symptomDetails : null}
                                      onChange={(e) => setSymptomDetails(e.target.value)}/>
                        </div>

                        <br/>
                        <h6>Anything to add about your health?</h6>
                        <textarea rows="4" cols="50"
                                  defaultValue={selectedFormIndex >= 0 ? patientData[selectedFormIndex].health : null}
                                  onChange={(e) => setHealth(e.target.value)}/>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <button
                        className={styles['visible_CovidFile']}
                        onClick={event => {
                            selectedFormIndex >= 0  ? updatePatientForm() : submitPatientForm();
                            fetchPatientForm();
                            closeModal();
                        }}>{selectedFormIndex >= 0 ? 'update' : 'submit'}</button>
                </Modal.Footer>
            </Modal>

        </div>

    );
}

export default CovidFile;
