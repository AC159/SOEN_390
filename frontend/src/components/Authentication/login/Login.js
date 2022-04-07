import { useState } from "react";
import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from 'axios';

function Login(props) {
    let navigate = useNavigate();
    let auth = useAuth();

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loginError, setLoginError] = useState("");

  const submitForm = async () => {
    try {
      const user = await auth.login(email, password);
        let userType, userStatus;

        await axios.get(`/user/${user.user.uid}/getTypeAndStatus`)
            .then((res) => {
                console.log('Got type and status');
                console.log(res.data);
                userType = res.data.userType;
                localStorage.setItem("userType", userType);
                userStatus = res.data.userStatus;
            })
            .catch((err) => {
                console.log(err);
            });

        if (userStatus === "APPROVED") {
            if (userType === "patient") {
                navigate('/patient-dashboard');
            } else if (userType === "doctor") {
                navigate('/doctor-dashboard');
            } else if (userType === "administrator") {
                navigate('/admin-dashboard');
            } else if (userType === "healthOfficial") {
                navigate('/health-official-dashboard');
            } else if (userType === "immigrationOfficial") {
                navigate('/immigration-officer-dashboard');
            }
        } else {
            navigate('/general-dashboard')
        }
    } catch (error) {
      if (error.code === "auth/user-not-found")
        setLoginError("User not found, sign up?");
      if (error.code === "auth/too-many-requests")
        setLoginError("Too many requests, try again later");
      if (error.code === "auth/user-disabled")
        setLoginError("User account disabled");
      if (error.code === "auth/email-already-in-use")
        setLoginError("Email already in use");
      if (error.code === "auth/network-request-failed")
        setLoginError("Network error");
      if (error.code === "auth/weak-password") setLoginError("Weak password");
      if (error.code === "auth/wrong-password") setLoginError("Wrong password");
    }
  };

  return (
      <div className={styles["wrapper_Login"]}>
          <div className={styles["container_Login"]}>
      <div className={styles["container-top_Login"]}>
        <h2 className={styles["h2_Login"]}>Welcome to CoviCare</h2>
        <div className={styles["backDrop_login"]}>
          <div className={styles["container-title_Login"]}></div>
        </div>
      </div>

      <form className={styles["container-item_Login"]}>
        <fieldset className={styles["fieldset_login"]}>
          <legend className={styles["legend_login"]}>Sign in</legend>

          <input
            className={styles["input_Login"]}
            type="text"
            placeholder="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />

          <input
            className={styles["input_Login"]}
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </fieldset>
        {loginError ? (
          <div className={styles["container-error_Login"]}>{loginError}</div>
        ) : null}
      </form>
      <button
        className={styles["button_Login"]}
        type="submit"
        onClick={submitForm}
        disabled={email === "" || password === ""}
      >
        Submit
      </button>
      <div className={styles["container-footer_Login"]}>
        Don't have an account yet? <Link to={"/signup"}>Sign Up!</Link>
      </div>
    </div>
      </div>

  );
}

export default Login;
