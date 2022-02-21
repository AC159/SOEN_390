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
    let userSympt = [];
    let [haveFever, setHaveFever] = useState(false);
    let [temp, setTemp] = useState('');
    let [other, setOther] = useState(false)
    let [whatOtherSymp, setWhatOtherSympt] = useState('');
    let [symptDetail, setSymptDetail] = useState('');
    let [health, sethealth] = useState('');


    let [patientData, setPatientData] = useState();

    const submitPatientForm = async () => {
        try {
            const userAttributes = {
                patientUid: currentUser.user.uid,
                covidStat: covidStat,
                userSympt: userSympt,
                temp : temp,
                whatOtherSymp: whatOtherSymp,
                symptDetail: symptDetail,
                health: health
            };
            //Need to uncomment when the bug of sending symptoms array and other detail together
            // axios.post(`/patient/submit-status-form`, userAttributes)
            //     .then(function (response) {
            //         console.log(response);
            //     })
            alert(covidStat + "  "+userSympt+ "  " + temp + "  " + whatOtherSymp+ "  " + symptDetail + "   " + health);
        } catch (error) {
            console.log('Submit error: ', error);
        }
    }

    //Need to implement update
    const updatePatientForm = async () => {
        const userAttributes = {
            patientUid: currentUser.user.uid,
            covidStat: covidStat,
            userSympt: userSympt
        };
        axios.post(`/patient/update-status-form/${currentUser.user.uid}`, userAttributes)
            .then(function (response) {
                console.log(response);
            }).catch(function (error) {
            console.log(error);
        });
        alert(covidStat + "  " + userSympt);
    }

    useEffect(() => {
        axios.get(`/patient/get-status-form/${currentUser.user.uid}`)
            .then((response) => {
                setPatientData(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


    const [popUpSymptoms, setPopUpSymptoms] = useState(false);
    const handleSymtomeShow = () => setPopUpSymptoms(true);
    const handleSymtomsclose = () => setPopUpSymptoms(false);

    function removeUnchecked(value) {
        let array = userSympt; // make a separate copy of the array
        const index = array.indexOf(value)
        if (index !== -1) {
            array.splice(index, 1);
            userSympt = array;
        }
    }


    return (

        <div>
            <div>
                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Covid Status: </div>
                        {patientData ?  Object.values(patientData)[Object.keys(patientData).indexOf("covidStat")] : null}
                    </div>

                </div>
                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Symptoms:</div>
                        <ul>
                            {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("userSympt")].map((key, index) =>
                                <li key={index}>{patientData.userSympt[index]}</li>) : null}
                        </ul>
                    </div>
                </div>

                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Other Symptoms: </div>
                        {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("whatOtherSymp")] : null}
                    </div>
                </div>

                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Temperature: </div>
                        {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("temp")] : null}
                    </div>
                </div>

                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Details about the symptoms: </div>
                        {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("symptDetail")] : null}
                    </div>
                </div>

                <div className={styles['internal_CovidFile']}>
                    <div>
                        <div>Detail about health: </div>
                        {patientData ? Object.values(patientData)[Object.keys(patientData).indexOf("health")] : null}
                    </div>
                </div>

            </div>
            <br/><br/>

                <div>
                    <button className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) === null ? 'visible_CovidFile' : 'hidden_CovidFile']} onClick={handleSymtomeShow}>submit</button>
                    <button className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) !== null ? 'visible_CovidFile' : 'hidden_CovidFile']} onClick={handleSymtomeShow}>update</button>
                    <Modal show={popUpSymptoms} onHide={handleSymtomsclose}>
                        <Modal.Header closeButton>
                          <Modal.Title>Update your file</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <h6>Select your Covid Status :</h6>
                                <select defaultValue={covidStat} onChange={(event) => setCovidStat(event.target.value)}>
                                    <option value="None">None</option>
                                    <option value="Positive">positive</option>
                                    <option value="Negative">negative</option>
                                </select>
                                <br/>

                                <h6>Do you have any symptoms :</h6>
                                <select defaultValue={haveSymptoms}
                                        onChange={(event) => setHaveSymptoms(event.target.value)}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>

                                <div
                                    className={styles[haveSymptoms == "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                                    <br/>
                                    <h6>Select all the Symptoms you feel :</h6>


                                    <input type="checkbox" id="fever" name="symptoms"
                                           value="Fever or feeling feverish (such as chills, sweating)"
                                           onChange={(e) => {
                                               if (e.target.checked) {
                                                   userSympt.push(e.target.value);
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
                                           onChange={(e) => {
                                               if (e.target.checked) {
                                                   userSympt.push(e.target.value);
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
                                           value="Sore throat" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="throat">Sore
                                        throat</label>
                                    <br/>

                                    <input type="checkbox" id="muscle" name="symptoms"
                                           value="Muscle aches or body aches" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="muscle">Muscle aches
                                        or
                                        body aches</label>
                                    <br/>

                                    <input type="checkbox" id="fatigue" name="symptoms"
                                           value="Unusual fatigue" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="fatigue">Unusual
                                        fatigue</label>
                                    <br/>

                                    <input type="checkbox" id="headache" name="symptoms"
                                           value="Headache" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']}
                                           htmlFor="headache">Headache</label>
                                    <br/>

                                    <input type="checkbox" id="taste" name="symptoms"
                                           value="New loss of taste or smell" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="taste">New loss of
                                        taste
                                        or smell</label>
                                    <br/>

                                    <input type="checkbox" id="congestion" name="symptoms"
                                           value="Congestion or runny nose" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="congestion">Congestion
                                        or
                                        runny nose</label>
                                    <br/>

                                    <input type="checkbox" id="nausea" name="symptoms"
                                           value="Nausea or vomiting" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']} htmlFor="nausea">Nausea or
                                        vomiting</label>
                                    <br/>

                                    <input type="checkbox" id="diarrhea" name="symptoms"
                                           value="Diarrhea" onChange={(e) => {
                                        if (e.target.checked) {
                                            userSympt.push(e.target.value);
                                        } else {
                                            removeUnchecked(e.target.value);
                                        }
                                    }}/>
                                    <label className={styles['checkBox-Label_CovidFile']}
                                           htmlFor="diarrhea">Diarrhea</label>
                                    <br/>


                                    <input type="checkbox" id="other" name="symptoms"
                                           value="Other symptoms" onChange={(e) => {
                                        if (e.target.checked) { setOther(true);
                                            userSympt.push(e.target.value);

                                        } else {setOther(false);
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
                                        <input type="number"  value={temp}  min={0} step=".01" onChange={(event) => setTemp(event.target.value)}/>
                                    </div>

                                    <div className={styles[other ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                                        <br/>
                                        <h6>What are the other symptoms?  </h6>
                                        <textarea type="input" rows="4" cols="50" value={whatOtherSymp}  onChange={(e) => setWhatOtherSympt(e.target.value)}/>
                                    </div>

                                <div  className={styles[haveSymptoms == "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>
                                     <br/>
                                    <h6>Anything to add about your symptoms? </h6>
                                    <textarea type="input" rows="4" cols="50" value={symptDetail}  onChange={(e) => setSymptDetail(e.target.value)}/>
                                </div>



                                 <br/>
                                <h6>Anything to add about your health? </h6>
                                <textarea type="input" rows="4" cols="50" value={health}  onChange={(e) => sethealth(e.target.value)}/>



                            </form>

                        </Modal.Body>
                        <Modal.Footer>
                                <button className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) === null ? 'visible_CovidFile' : 'hidden_CovidFile']} onClick={(e) => {
                                    submitPatientForm()
                                }}>submit
                                </button>
                                <button className={styles[(patientData ? Object.keys(patientData).indexOf("patientUid") : null) !== null ? 'visible_CovidFile' : 'hidden_CovidFile']} onClick={(e) => {
                                    updatePatientForm();
                                }}>update
                                </button>
                        </Modal.Footer>
                    </Modal>
                </div>



        </div>

    );
}

export default CovidFile;
