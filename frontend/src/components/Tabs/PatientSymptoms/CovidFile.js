import React, {useEffect, useState} from "react";
import {useAuth} from "../../Authentication/FirebaseAuth/FirebaseAuth";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function CovidFile(props) {
    let {currentUser} = useAuth();
    let [covidStatus, setCovidStatus] = useState('');
    let [haveSymptoms, setHaveSymptoms] = useState('');
    let userSymptoms = [];
    const [symptoms, setSymptoms] = useState([]);

    let [patientData, setPatientData] = useState();
    let patientD = [];
    //remove this like when the unerSymptoms is setup
    let testArray = ["hello", "hey", "hi", "hello", "hey", "hi"];

    const [state, setState] = React.useState({covidStatus: `${currentUser.dbData.covidStatus}`, userSymptoms: `${currentUser.dbData.userSymptoms}`});

    const submitPatientForm = async() => {
        try {
            const userAttributes = {
                patientUid: currentUser.user.uid,
                covidStat: covidStatus,
                userSympt: userSymptoms
            };
            axios.post(`/patient/submit-status-form`, userAttributes)
            .then(function (response) {
                console.log(response);
              })
            alert(covidStatus + userSymptoms);
            } catch (error) {
                console.log('Submit error: ', error);
            }
        }
    
    //Need to implement update
    const updatePatientForm = async() => {
        try {
            const userAttributes = {
                uid: currentUser.user.uid,
                covidStatus: covidStatus,
                userSymptoms: userSymptoms
            };
            axios.post(`/patient/update-status-form/${currentUser.user.uid}`, userAttributes)
            .then(function (response) {
                console.log(response);
              })
            alert(covidStatus + userSymptoms);
            } catch (error) {
                console.log('Submit error: ', error);
            }
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


    const [popUpStatus, setPopUpStatus] = useState(false);
    const handleStatusShow = () => setPopUpStatus(true);
    const handleStatusclose = () => setPopUpStatus(false);

    const [popUpSymptoms, setPopUpSymptoms] = useState(false);
    const handleSymtomeShow = () => setPopUpSymptoms(true);
    const handleSymtomsclose = () => setPopUpSymptoms(false);

    function removeUnchecked(value) {
        let array = userSymptoms; // make a separate copy of the array
        const index = array.indexOf(value)
        if (index !== -1) {
            array.splice(index, 1);
            userSymptoms = array;
        }
    }

    function userSymptomsList() {
        //Need to UnComment this when the userSymptoms is set up in the backend and remove the next line
        // return userSymptoms.map((userSymptoms) => <li>{userSymptoms}</li>);
        return testArray.map((testArray) => <li>{testArray}</li>);
    }
    /*<Modal show={popUpSymptoms} onHide={handleSymtomsclose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update your symptoms</Modal.Title>
                        </Modal.Header>
                        <Modal.Body></Modal.Body>
                        
                        
                        </Modal.Body>
                        <Modal.Footer>
                            
                        </Modal.Footer>
                    </Modal>*/
/*
<div>
            <div className={styles['internal_CovidFile']}>
                <div>
                    <div>Status: {state.userStatus}</div>

                    <button className={styles['button-edit_CovidFile']} onClick={handleStatusShow}>Edit</button>
                    <Modal show={popUpStatus} onHide={handleStatusclose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update Status</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            

                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={() => {
                                handleStatusclose();
                                submitUserStatus();
                                setState({...state, userStatus: userStatus});
                            }}>
                                Update
                            </button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
            <div className={styles['internal_CovidFile']}>
                <div>
                    <div>Symptoms: {userSymptomsList()}</div>
                    <button className={styles['button-edit_CovidFile']} onClick={handleSymtomeShow}>Edit</button>

                    

                            

                        
                        
                </div>
            </div>


        </div>*/

    return (
        <div>
            <div>
                <p>Symptoms:</p>
               
            </div>
            <div >
                <ul>
                {patientData ? Object.keys(patientData).map((key, index) => <li key={index}>{key}:{patientData[key]}</li>) : null}
                </ul>
            </div>
        {/*<form>*/}


        {/*    <label>Select your Covid Status : &nbsp;</label>*/}
        {/*                    <select defaultValue={covidStatus} onChange={(event) => setCovidStatus(event.target.value)}>*/}
        {/*                        <option value="None">None</option>*/}
        {/*                        <option value="Positive">positive</option>*/}
        {/*                        <option value="Negative">negative</option>*/}
        {/*                    </select>*/}

        {/*                    <h6>Do you have any symptoms</h6>*/}
        {/*                    <select defaultValue={haveSymptoms}*/}
        {/*                            onChange={(event) => setHaveSymptoms(event.target.value)}>*/}
        {/*                        <option value="no">No</option>*/}
        {/*                        <option value="yes">Yes</option>*/}
        {/*                    </select>*/}
        {/*                    <br/>*/}

        {/*                    <div className={styles[haveSymptoms == "yes" ? 'visible_CovidFile' : 'hidden_CovidFile']}>*/}
        {/*                        <h6>Select all the Symptoms you feel :</h6>*/}


        {/*                        <input type="checkbox" id="fever" name="symptoms"*/}
        {/*                               value="Fever or feeling feverish (such as chills, sweating)" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="fever">Fever or feeling*/}
        {/*                            feverish (such as chills, sweating)</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="breathing" name="symptoms"*/}
        {/*                               value="Mild or moderate difficulty breathing (breathing slightly faster than normal, feeling like you can’t inhale or exhale, or wheezing, especially during exhaling or breathing out)"*/}
        {/*                               onChange={(e) => {*/}
        {/*                                   if (e.target.checked) {*/}
        {/*                                       userSymptoms.push(e.target.value);*/}
        {/*                                   } else {*/}
        {/*                                       removeUnchecked(e.target.value);*/}
        {/*                                   }*/}
        {/*                               }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="breathing">Mild or*/}
        {/*                            moderate difficulty breathing (breathing slightly faster than normal, feeling like*/}
        {/*                            you can’t inhale or exhale, or wheezing, especially during exhaling or breathing*/}
        {/*                            out)</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="throat" name="symptoms"*/}
        {/*                               value="Sore throat" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="throat">Sore*/}
        {/*                            throat</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="muscle" name="symptoms"*/}
        {/*                               value="Muscle aches or body aches" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="muscle">Muscle aches or*/}
        {/*                            body aches</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="fatigue" name="symptoms"*/}
        {/*                               value="Unusual fatigue" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="fatigue">Unusual*/}
        {/*                            fatigue</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="headache" name="symptoms"*/}
        {/*                               value="Headache" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']}*/}
        {/*                               for="headache">Headache</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="taste" name="symptoms"*/}
        {/*                               value="New loss of taste or smell" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="taste">New loss of taste*/}
        {/*                            or smell</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="congestion" name="symptoms"*/}
        {/*                               value="Congestion or runny nose" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="congestion">Congestion or*/}
        {/*                            runny nose</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="nausea" name="symptoms"*/}
        {/*                               value="Nausea or vomiting" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="nausea">Nausea or*/}
        {/*                            vomiting</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="diarrhea" name="symptoms"*/}
        {/*                               value="Diarrhea" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']}*/}
        {/*                               htmlFor="diarrhea">Diarrhea</label>*/}
        {/*                        <br/>*/}

        {/*                        <input type="checkbox" id="other" name="symptoms"*/}
        {/*                               value="Other symptoms" onChange={(e) => {*/}
        {/*                            if (e.target.checked) {*/}
        {/*                                userSymptoms.push(e.target.value);*/}
        {/*                            } else {*/}
        {/*                                removeUnchecked(e.target.value);*/}
        {/*                            }*/}
        {/*                        }}/>*/}
        {/*                        <label className={styles['checkBox-Label_CovidFile']} for="other">Other*/}
        {/*                            symptoms</label>*/}
        {/*                        <br/>*/}
        {/*                    </div>*/}

        {/*                    <button onClick={(e) => {submitPatientForm()}}>update</button>*/}
        {/*        </form>*/}


        </div>
        

    );
}

export default CovidFile;
