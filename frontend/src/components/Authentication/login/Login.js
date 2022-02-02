import {useState} from 'react';
import {useAuth} from "../FirebaseAuth/FirebaseAuth";
import {Link, useNavigate} from 'react-router-dom';
import styles from './Login.module.css';
import axios from "axios";

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

function Login(props) {

    let navigate = useNavigate();
    let auth = useAuth();

    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [loginError, setLoginError] = useState('');

    const submitForm = () => {
        auth.login(email, password).then(data => {
            // DRAFT IN CASE AXIOS DOES NOT WORK, WILL REMOVE WHEN I AM CONFIDENT
            // console.log(email)
            // fetch('/add', {
            //     method: 'post',
            //     body: JSON.stringify({
            //         email: email
            //     }),
            //     headers: new Headers({
            //         "Content-Type": "application/json; charset=UTF-8"
            //     })
            // }).then(r => console.log(r))
            console.log(data);
            navigate("/general-dashboard", { replace: true });
        }).catch(error => {
            console.log(error);
            if (error.code === 'auth/user-not-found') setLoginError("User not found, sign up?");
            if (error.code === 'auth/too-many-requests') setLoginError("Too many requests, try again later");
            if (error.code === 'auth/user-disabled') setLoginError("User account disabled");
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-title']}>Welcome to CoviCare!</div>
            <form className={styles['container-item']}>

                {loginError ? <div className={styles['container-error']}>{loginError}</div> : null}

                <label>email</label>
                <input type="text" placeholder="email" value={email} onChange={(event) => {
                    setEmail(event.target.value)
                }}/>

                <label>password</label>
                <input type="password" placeholder="password" value={password} onChange={(event) => {
                    setPassword(event.target.value)
                }}/>

            </form>
            <button type="submit" onClick={submitForm} disabled={email === '' || password === ''}>Submit</button>
            <div className={styles['container-footer']}>Don't have an account yet? <Link to={'/signup'}>Sign Up!</Link>
            </div>
        </div>
    );

}

export default Login;
