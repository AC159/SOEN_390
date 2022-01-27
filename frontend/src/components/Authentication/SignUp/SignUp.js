import { useState, useEffect } from 'react';
import styles from './SignUp.module.css';
import { Link } from "react-router-dom";
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { useNavigate } from 'react-router-dom';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function SignUp(props) {

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
        if (password.length <= 3 && password !== '') setPasswordError(true)
        else setPasswordError(false)
    }, [password])

    useEffect(() => {
        if (password !== passwordConf) setPasswordConfError(true)
        else setPasswordConfError(false)
    }, [passwordConf])

    const submitForm = async () => {
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`passwordConf: ${passwordConf}`);
        auth.register(email, password).then(data => {
            console.log('Sign in successful...');
            console.log(data);
            navigate("/", { replace: true });
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles['container-title']}>Welcome to CoviCare!</div>
            <form className={styles['container-item']}>
                <label>email</label>
                <input type="text" placeholder="email" value={email} onChange={(event)=> setEmail(event.target.value)}/>
                {emailInvalid ? <div className={styles['container-error']}>Invalid email</div>:null}

                <label>password</label>
                <input type="password" placeholder="password" value={password} onChange={(event)=> setPassword(event.target.value)}/>
                {passwordError ? <div className={styles['container-error']}>Password must be greater than 3 characters</div>:null}

                <label>confirm password</label>
                <input type="password" placeholder="confirm password" value={passwordConf}
                       onChange={(event)=> setPasswordConf(event.target.value)}/>
                {passwordConfError ? <div className={styles['container-error']}>Passwords do not match!</div>:null}

            </form>
            <button type="submit" onClick={submitForm}
                    disabled={email === '' || password === '' || passwordConf === '' || passwordError || passwordConfError || emailInvalid}>Submit</button>
            <div className={styles['container-footer']}>Already have an account? <Link to={'/'}>Login!</Link></div>
        </div>
    );

}

export default SignUp;
