import { useState } from 'react';
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios';

function Login(props) {

    let navigate = useNavigate();
    let auth = useAuth();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [loginError, setLoginError] = useState('');

    const submitForm = async () => {
        try {
            const user = await auth.login(email, password);
            console.log('User: ', user);
            // get the requested route from local storage
            const redirectRoute = sessionStorage.getItem('requestedRoute')
            if (redirectRoute !== '' && redirectRoute !== undefined && redirectRoute !== null) navigate(redirectRoute, {replace: true});
            else navigate("/general-dashboard", {replace: true});
        } catch(error) {
            if (error.code === 'auth/user-not-found') setLoginError("User not found, sign up?");
            if (error.code === 'auth/too-many-requests') setLoginError("Too many requests, try again later");
            if (error.code === 'auth/user-disabled') setLoginError("User account disabled");
            if (error.code === 'auth/email-already-in-use') setLoginError("Email already in use");
            if (error.code === 'auth/network-request-failed') setLoginError("Network error");
            if (error.code === 'auth/weak-password') setLoginError("Weak password");
            if (error.code === 'auth/wrong-password') setLoginError("Wrong password");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-top']}>
                <h2>Welcome to CoviCare</h2>
                <div className={styles['backDrop']}>

                    <div className={styles['container-title']}>

                    </div>
                </div>
            </div>

            <form className={styles['container-item']}>
                <fieldset>
                    <legend>Sign in</legend>

                    <input type="text" placeholder="email" value={email} onChange={(event) => {setEmail(event.target.value)}}/>

                    <input type="password" placeholder="password" value={password} onChange={(event) => {setPassword(event.target.value)}}/>

                </fieldset>
                {loginError ? <div className={styles['container-error']}>{loginError}</div> : null}

            </form>
            <button type="submit" onClick={submitForm} disabled={email === '' || password === ''}>Submit</button>
            <div className={styles['container-footer']}>Don't have an account yet? <Link to={'/signup'}>Sign Up!</Link></div>
        </div>

    );

}

export default Login;