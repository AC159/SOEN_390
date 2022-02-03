import { useState, useEffect } from 'react';
import styles from './SignUp.module.css';
import { Link } from "react-router-dom";
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


function SignUp(props) {


    let [firstName, setFirstName] = useState('');
    let [lastName, setLastName] = useState('');
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



    let navigate = useNavigate();


    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [passwordConf, setPasswordConf] = useState('');
    let [passwordError, setPasswordError] = useState(false);
    let [passwordConfError, setPasswordConfError] = useState(false);
    let [emailInvalid, setEmailInvalid] = useState(false);

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
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`passwordConf: ${passwordConf}`);
        auth.register(email, password).then(data => {
            console.log('Sign in successful...');
            console.log(data);
            axios.post('/addNewUser', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                user: user,
                verification: {
                    insurance: insurance,
                    doctorLicense: doctorLicense,
                    healthLicense: healthLicense,
                    immigrationId: immigrationId,
                    administratorId: administratorId
                },
                userStatus: "PENDING",
                firebase: data.user.uid
            }).then().catch()
            navigate("/patient-dashboard", { replace: true });
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-title']}>Welcome to CoviCare!</div>
            <form className={styles['container-item']}>

                <label>First Name</label>
                <input type="text" placeholder="First Name" defaultValue={firstName}
                       onChange={(event) => setFirstName(event.target.value)}/>

                <label>Last Name</label>
                <input type="text" placeholder="Last Name" value={lastName} defaultValue={lastName}
                       onChange={(event) => setLastName(event.target.value)}/>

                <label>email</label>
                <input type="text" placeholder="email" value={email} onChange={(event)=> setEmail(event.target.value)}/>
                {emailInvalid ? <div className={styles['container-error']}>Invalid email</div>:null}

                <label>password</label>
                <input type="password" placeholder="password" value={password} onChange={(event)=> setPassword(event.target.value)}/>
                {passwordError ? <div className={styles['container-error']}>
                    The password must contain at least eight characters, at least one number, at least one special character, and both lower and upper case letters
                </div>:null}


                <label>confirm password</label>
                <input type="password" placeholder="confirm password" value={passwordConf}
                       onChange={(event)=> setPasswordConf(event.target.value)}/>
                {passwordConfError ? <div className={styles['container-error']}>Passwords do not match!</div>:null}
                <label>User Type</label>
                <select name="userType" id="userType" defaultValue={user}
                        onChange={(event) => {userSelect(event.target.value); setUser(event.target.value)}}>
                    <option value="" selected disabled>Please select</option>
                    <option value="patient" >Patient</option>
                    <option value="doctor" >Doctor</option>
                    <option value="healthOfficer">Health Officer</option>
                    <option value="immigrationOfficer">Immigration Officer</option>
                    <option value="administrator">Administrator</option>
                </select>

                <dic className={styles[patient ? 'visible' : 'hidden']}>
                   <label>Health Insurance Number</label>
                <input  type="text" maxLength={12} value={insurance}
                       onChange={(event) => { setInsurance(event.target.value)}}/>

                </dic>

                <dic className={styles[doctor ? 'visible' : 'hidden']}>
                   <label>Doctor's License Number</label>
                <input  type="text" maxLength={6} value={doctorLicense}
                        onChange={(event) => setDoctorLicense(event.target.value)}/>
                </dic>

                <dic className={styles[healthOfficer ? 'visible' : 'hidden']}>
                   <label>Health officer's License Number</label>
                <input  type="number" value={healthLicense}
                        onChange={(event) => setHealthLicense(event.target.value)}/>
                </dic>

                <dic className={styles[immigrationOfficer ? 'visible' : 'hidden']}>
                   <label>Immigration officer's Id Number</label>
                <input  type="number" value={immigrationId}
                        onChange={(event) => setImmigrationId(event.target.value)}/>
                </dic>

                <dic className={styles[administrator ? 'visible' : 'hidden']}>
                   <label>Administrator's Id Number</label>
                <input  type="number" value={administratorId}
                        onChange={(event) => setAdministratorId(event.target.value)}/>
                </dic>

            </form>

            <button type="submit" onClick={submitForm}
                    disabled={email === '' || password === '' || passwordConf === '' || passwordError || passwordConfError || emailInvalid}>Submit</button>
            <div className={styles['container-footer']}>Already have an account? <Link to={'/'}>Login!</Link></div>
        </div>
    );

}

export default SignUp;
