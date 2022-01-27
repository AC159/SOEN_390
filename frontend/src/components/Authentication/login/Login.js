import { useState } from 'react';
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login(props) {

    let navigate = useNavigate();
    let auth = useAuth();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [error, setError] = useState('');

    const submitForm = () => {
        auth.login(email, password).then(data => {
           console.log(data);
            navigate("/patient-dashboard", { replace: true });
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-title']}>Welcome to CoviCare!</div>
            <form className={styles['container-item']}>
                <label>email</label>
                <input type="text" placeholder="email" value={email} onChange={(event) => {setEmail(event.target.value)}}/>

                <label>password</label>
                <input type="password" placeholder="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>

            </form>
            <button type="submit" onClick={submitForm} disabled={email === '' || password === ''}>Submit</button>
            <div className={styles['container-footer']}>Don't have an account yet? <Link to={'/signup'}>Sign Up!</Link></div>
        </div>
    );

}

export default Login;
