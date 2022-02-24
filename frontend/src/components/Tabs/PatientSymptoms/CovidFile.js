import React, {useEffect, useState} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import styles from "./CovidFile.module.css";

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
    }

    const fetchPatientForm = async () => {
        axios.get(`/patient/get-status-form/${currentUser.user.uid}`)
            .then((response) => {
                setPatientData(response.data);
                // setUserSymptoms([]);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        fetchPatientForm();
    }, []);


    const [popUpSymptoms, setPopUpSymptoms] = useState(false);
    const handleSymptomShow = () => setPopUpSymptoms(true);
    const handleSymptomsClose = () => setPopUpSymptoms(false);

    function removeUnchecked(value) {
        const index = userSymptoms.indexOf(value)
        if (index !== -1) {
            userSymptoms.splice(index, 1);
        }
    }

    return (

        <div>
            <div
                className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("covidStatus")] : "None") === "None" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temperature")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("otherSymptoms")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptomDetails")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].length : 0) === 0)
                    ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                <div className={styles['internal_CovidFile']}>
                    <div>If you have any symptoms, update your patient file</div>
                </div>
            </div>
            <div
                className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("covidStatus")] : "None") === "None" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temperature")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("otherSymptoms")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptomDetails")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : "") === "" &&
                    (patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].length : 0) === 0)
                    ? 'hidden_CovidFile' : 'visible_CovidFile']}>


                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("covidStatus")] : "None") === "None")
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>
                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Covid Status:</div>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("covidStatus")] : null}
                        </div>

                    </div>
                </div>

                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].length : 0) === 0)
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>
                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Symptoms:</div>
                            <ul>
                                {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].map((key, index) =>
                                    <li key={index}>{patientData.symptoms[index]}</li>) : null}

                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temperature")] : "") === "")
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>

                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Temperature:</div>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temperature")] : null}
                        </div>
                    </div>
                </div>

                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("otherSymptoms")] : "") === "")
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>
                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Other Symptoms:</div>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("otherSymptoms")] : null}
                        </div>
                    </div>
                </div>

                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptomDetails")] : "") === "")
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>
                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Details about the symptoms:</div>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptomDetails")] : null}
                        </div>
                    </div>
                </div>

                <div
                    className={styles[((patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : "") === "")
                        ? 'hidden_CovidFile' : 'visible_CovidFile']}>
                    <div className={styles['internal_CovidFile']}>
                        <div>
                            <div>Detail about health:</div>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : null}
                        </div>
                    </div>
                </div>

                <br/>
                <br/>
            </div>


            <div>
                <div
                    className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) === null ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                    <h6>Submit a new patient form for your doctor</h6>
                    <button onClick={handleSymptomShow}>submit</button>
                </div>
                <button
                    className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) !== null ? 'visible_CovidFile' : 'hidden_CovidFile']}
                    onClick={handleSymptomShow}>update
                </button>
                <Modal show={popUpSymptoms} onHide={handleSymptomsClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update your file</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>

                            <h6>Select your Covid Status :</h6>
                            <select
                                defaultValue={patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("covidStatus")] : null}
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

                            <h6>Do you have any symptoms :</h6>
                            <select
                                defaultValue={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].length : 0) === 0 ? "no" : "yes"}
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
                                <h6>Select all the Symptoms you feel :</h6>


                                <input type="checkbox" id="fever" name="symptoms"
                                       value="Fever or feeling feverish (such as chills, sweating)"
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Fever or feeling feverish (such as chills, sweating)") : -1) !== -1}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               setUserSymptoms([...userSymptoms, e.target.value]);
                                               setHaveFever(true);
                                           } else {
                                               removeUnchecked(e.target.value);
                                               setHaveFever(false);
                                           }
                                       }}/>
                                <label className={styles['checkBox-Label_CovidFile']} htmlFor="fever">Fever or
                                    feeling
                                    feverish (such as chills, sweating)</label>
                                <br/>

                                <input type="checkbox" id="breathing" name="symptoms"
                                       value="Mild or moderate difficulty breathing (breathing slightly faster than normal, feeling like you can’t inhale or exhale, or wheezing, especially during exhaling or breathing out)"
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf(
                                           "Mild or moderate difficulty breathing (breathing slightly faster than normal, feeling like you can’t inhale or exhale, or wheezing, especially during exhaling or breathing out)") : -1) !== -1}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               setUserSymptoms([...userSymptoms, e.target.value]);
                                           } else {
                                               removeUnchecked(e.target.value);
                                           }
                                       }}/>
                                <label className={styles['checkBox-Label_CovidFile']} htmlFor="breathing">Mild or
                                    moderate difficulty breathing (breathing slightly faster than normal, feeling
                                    like
                                    you can’t inhale or exhale, or wheezing, especially during exhaling or breathing
                                    out)</label>
                                <br/>

                                <input type="checkbox" id="throat" name="symptoms"
                                       value="Sore throat"
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Sore throat") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Muscle aches or body aches") : -1) !== -1}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               setUserSymptoms([...userSymptoms, e.target.value]);
                                           } else {
                                               removeUnchecked(e.target.value);
                                           }
                                       }}/>
                                <label className={styles['checkBox-Label_CovidFile']} htmlFor="muscle">Muscle aches
                                    or
                                    body aches</label>
                                <br/>

                                <input type="checkbox" id="fatigue" name="symptoms"
                                       value="Unusual fatigue"
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Unusual fatigue") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Headache") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("New loss of taste or smell") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Congestion or runny nose") : -1) !== -1}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               setUserSymptoms([...userSymptoms, e.target.value]);
                                           } else {
                                               removeUnchecked(e.target.value);
                                           }
                                       }}/>
                                <label className={styles['checkBox-Label_CovidFile']} htmlFor="congestion">Congestion
                                    or
                                    runny nose</label>
                                <br/>

                                <input type="checkbox" id="nausea" name="symptoms"
                                       value="Nausea or vomiting"
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Nausea or vomiting") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Diarrhea") : -1) !== -1}
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
                                       defaultChecked={(patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptoms")].indexOf("Other symptoms") : -1) !== -1}
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
                                <h6>What is your temperature? </h6>
                                <input type="number"
                                       defaultValue={patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temperature")] : null}
                                       min={0} step=".01" onChange={(e) => setTemp(e.target.value)}/>
                            </div>

                            <div className={styles[other ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                                <br/>
                                <h6>What are the other symptoms? </h6>
                                <textarea rows="4" cols="50"
                                          defaultValue={patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("otherSymptoms")] : null}
                                          onChange={(e) => setWhatOtherSymptoms(e.target.value)}/>
                            </div>

                            <div className={styles[haveSymptoms === "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                                <br/>
                                <h6>Anything to add about your symptoms? </h6>
                                <textarea rows="4" cols="50"
                                          defaultValue={patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptomDetails")] : null}
                                          onChange={(e) => setSymptomDetails(e.target.value)}/>
                            </div>

                            <br/>
                            <h6>Anything to add about your health? </h6>
                            <textarea rows="4" cols="50"
                                      defaultValue={patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : null}
                                      onChange={(e) => setHealth(e.target.value)}/>

                        </form>

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) === null ? 'visible_CovidFile' : 'hidden_CovidFile']}
                            onClick={event => {
                                submitPatientForm();
                                fetchPatientForm();
                                handleSymptomsClose();
                            }}>submit
                        </button>
                        <button
                            className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) !== null ? 'visible_CovidFile' : 'hidden_CovidFile']}
                            onClick={event => {
                                updatePatientForm();
                                fetchPatientForm();
                                handleSymptomsClose();
                            }}>update
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>

        </div>

    );
}

export default CovidFile;
