import { useState, useEffect } from 'react';
import styles from './SignUp.module.css';
import { Link } from "react-router-dom";
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


function SignUp(props) {

    let navigate = useNavigate();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [passwordConf, setPasswordConf] = useState('');
    let [passwordError, setPasswordError] = useState(false);
    let [passwordConfError, setPasswordConfError] = useState(false);
    let [emailInvalid, setEmailInvalid] = useState(false);


    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
    let[country, setCountry] = useState('');
    let[phoneNumber, setPhoneNumber] = useState('');
    let[address, setAddress] = useState('');


    let [user, setUser] = useState('');
    let [patient, setPatient] = useState(false);
    let [doctor, setDoctor] = useState('');
    let [healthOfficer, setHealthOfficer] = useState('');
    let [immigrationOfficer, setImmigrationOfficer] = useState('');
    let [administrator, setAdministrator] = useState('');

    let [insurance, setInsurance] = useState('');
    let [doctorLicense, setDoctorLicense] = useState('');
    let [healthLicense, setHealthLicense] = useState('');
    let [immigrationId, setImmigrationId] = useState('');
    let [administratorId, setAdministratorId] = useState('');

    let auth = useAuth();


    useEffect(() => {
        if (emailRegex.test(String(email).toLowerCase()) || email === "") setEmailInvalid(false)
        else setEmailInvalid(true)
    }, [email])

    useEffect(() => {
        if (passwordRegex.test(String(password).toLowerCase()) || password === "") setPasswordError(false)
        else setPasswordError(true)
    }, [password])

    useEffect(() => {
        if (password !== passwordConf) setPasswordConfError(true)
        else setPasswordConfError(false)
    }, [passwordConf])


    function userSelect(value){
        if(value === "patient"){
            setPatient(!patient);
            setDoctor(false);
            setHealthOfficer(false);
            setImmigrationOfficer(false);
            setAdministrator(false);
        }
        else if(value === "doctor") {
            setDoctor(!doctor);
            setPatient(false);
            setHealthOfficer(false);
            setImmigrationOfficer(false);
            setAdministrator(false);
        }
        else if(value === "healthOfficer"){
            setHealthOfficer(!healthOfficer);
            setPatient(false);
            setDoctor(false);
            setImmigrationOfficer(false);
            setAdministrator(false);
        }
        else if(value === "immigrationOfficer"){
            setImmigrationOfficer(!immigrationOfficer);
            setPatient(false);
            setDoctor(false);
            setHealthOfficer(false);
            setAdministrator(false);
        }
        else if(value === "administrator"){
            setAdministrator(!administrator);
            setPatient(false);
            setDoctor(false);
            setHealthOfficer(false);
            setImmigrationOfficer(false);
        }
        else {
            setPatient(false);
            setDoctor(false);
            setHealthOfficer(false);
            setImmigrationOfficer(false);
            setAdministrator(false);
        }
    }


    const submitForm = async () => {
        try {
            const userSignUpData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                userType: user,
                phoneNumber: phoneNumber,
                address: address,
                verification: {
                    insurance: insurance,
                    doctorLicense: doctorLicense,
                    healthLicense: healthLicense,
                    immigrationId: immigrationId,
                    administratorId: administratorId
                },
                userStatus: "PENDING"
            }
            const data = await auth.register(email, password, userSignUpData);
        } catch (error) {
            console.log('Sign up error: ', error);
        }
        navigate("/patient-dashboard", { replace: true });
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-top']}>
                <h2>Create your CoviCare Account</h2>
                <div className={styles['backDrop']}>
                    <div className={styles['container-title']}></div>
                </div>
            </div>
            <form className={styles['container-item']}>
                <fieldset>
                    <legend>Account Information</legend>

                    <input type="text" placeholder="email" value={email} onChange={(event)=> setEmail(event.target.value)}/>
                    {emailInvalid ? <div className={styles['container-error']}>Invalid email</div>:null}

                    <input type="password" placeholder="password" value={password} onChange={(event)=> setPassword(event.target.value)}/>
                    {passwordError ? <div className={styles['container-error']}>
                        The password must contain at least eight characters, at least one number, at least one special character, and both lower and upper case letters
                    </div>:null}

                    <input type="password" placeholder="confirm password" value={passwordConf}
                           onChange={(event)=> setPasswordConf(event.target.value)}/>
                    {passwordConfError ? <div className={styles['container-error']}>Passwords do not match!</div>:null}

                </fieldset>
                <fieldset>
                    <legend>Profile Information</legend>

                        <input type="text" placeholder="First Name" defaultValue={firstName}
                           onChange={(event) => setFirstName(event.target.value)}/>

                        <input type="text" placeholder="Last Name" value={lastName} defaultValue={lastName}
                               onChange={(event) => setLastName(event.target.value)}/>

                        <input  type="text" placeholder="Phone Number"  value={phoneNumber}
                               onChange={(event) => { setPhoneNumber(event.target.value)}}/>


                        <input  type="text" placeholder="Address"  value={address}
                               onChange={(event) => { setAddress(event.target.value)}}/>

                </fieldset>
                <fieldset>
                    <legend>User Type</legend>
                        <select name="userType"defaultValue={user}
                                onChange={(event) => {userSelect(event.target.value); setUser(event.target.value)}}>
                            <option value="" selected disabled>Please select</option>
                            <option value="patient" >Patient</option>
                            <option value="doctor" >Doctor</option>
                            <option value="healthOfficer">Health Officer</option>
                            <option value="immigrationOfficer">Immigration Officer</option>
                            <option value="administrator">Administrator</option>
                        </select>

                        <div className={styles[patient ? 'visible' : 'hidden']}>
                        <input  type="text" placeholder="Health Insurance Number" maxLength={12} value={insurance}
                               onChange={(event) => { setInsurance(event.target.value)}}/>

                        </div>

                        <div className={styles[doctor ? 'visible' : 'hidden']}>
                        <input  type="text" placeholder="Doctor's License Number" maxLength={6} value={doctorLicense}
                                onChange={(event) => setDoctorLicense(event.target.value)}/>
                        </div>

                        <div className={styles[healthOfficer ? 'visible' : 'hidden']}>
                        <input  type="number" placeholder="Health officer's License Number" value={healthLicense}
                                onChange={(event) => setHealthLicense(event.target.value)}/>
                        </div>

                        <div className={styles[immigrationOfficer ? 'visible' : 'hidden']}>
                        <input  type="number" placeholder="Immigration officer's Id Number" value={immigrationId}
                                onChange={(event) => setImmigrationId(event.target.value)}/>
                        </div>

                        <div className={styles[administrator ? 'visible' : 'hidden']}>
                        <input  type="number" placeholder="Administrator's Id Number" value={administratorId}
                                onChange={(event) => setAdministratorId(event.target.value)}/>
                        </div>
                </fieldset>


            </form>

            <button type="submit" onClick={submitForm}
                    disabled={email === '' || password === '' || passwordConf === '' || passwordError || passwordConfError || emailInvalid}>Submit</button>
            <div className={styles['container-footer']}>Already have an account? <Link to={'/'}>Login!</Link></div>

        </div>
    );

}

export default SignUp;
