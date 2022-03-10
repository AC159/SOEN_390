import { useReducer } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { useAuth } from "../FirebaseAuth/FirebaseAuth";
import styles from "./SignUp.module.css";

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const BASIC_CHANGE = "BASIC_CHANGE";
const EMAIL_CHANGE = "EMAIL_CHANGE";
const PASSWORD_CHANGE = "PASSWORD_CHANGE";
const PASSWORD_CONF = "PASSWORD_CONF";
const USER_TYPE_CHANGE = "USER_TYPE_CHANGE";

const initialState = {
  email: '',
  password: '',
  passwordConf: '',
  passwordError: false,
  passwordConfError: false,
  emailInvalid: false,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  phoneNumber: '',
  address: '',
  userType: '',
  idCard: '',
}

const reducer = (state, action) => {
  switch (action.type) {
    case BASIC_CHANGE:
      return {
        ...state,
        ...action.payload
      }
    case EMAIL_CHANGE:
      const {email} = action.payload;
      const emailInvalid = !(emailRegex.test(String(email).toLowerCase()) || email === "");
      return {
        ...state,
        ...action.payload,
        emailInvalid
      }
    case PASSWORD_CHANGE:
      const {password} = action.payload;
      const passwordError = !passwordRegex.test(String(password).toLowerCase()) && password !== "";
      return {
        ...state,
        ...action.payload,
        passwordError
      }
    case PASSWORD_CONF:
      const passwordConfError = state.password !== action.payload.passwordConf;
      return {
        ...state,
        ...action.payload,
        passwordConfError
      }
    case USER_TYPE_CHANGE:
      return {
        ...state,
        idCard: '',
        ...action.payload
      }
    default:
      return state
  }
}

function SignUp(props) {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState)

  let auth = useAuth();

  const maxLengthValue = (userType) => {
    switch(userType) {
      case 'patient':
        return 12;
      case 'doctor':
        return 6;
      default:
        return 200;
    }
  }

  const placeholderValue = (userType) => {
    switch(userType) {
      case 'patient':
        return "Health Insurance Number";
      case 'doctor':
        return "Doctor's License Number";
      case 'administrator':
        return "Administrator's Id Number";
      case 'immigrationOfficial':
        return "Immigration official's Id Number";
      case 'healthOfficial':
        return "Health official's License Number";
      default:
        return '';
    }
  }

  const submitForm = async () => {
    try {
      const {
        passwordError, passwordConfError, emailInvalid,
        idCard, password, passwordConf, ...rest
      } = state;
      const validation = {};
      switch(state.userType) {
        case 'patient':
          validation['insurance'] = idCard
          break;
        case 'doctor':
          validation['doctorLicense'] = idCard
          break;
        case 'administrator':
          validation['administratorId'] = idCard
          break;
        case 'immigrationOfficial':
          validation['immigrationId'] = idCard
          break;
        case 'healthOfficial':
          validation['healthLicense'] = idCard
          break;
        default:
      }
      await auth.register(state.email, state.password, {
        ...rest,
        verification: validation,
        userStatus: 'PENDING'
      });
      navigate("/general-dashboard", { replace: true });
    } catch (error) {
      console.log("Sign up error: ", error);
    }
  };

  return (
    <div className={styles["container_SingUp"]}>
      <div className={styles["container-top_SingUp"]}>
        <h2 className={styles["h2_SingUp"]}>Create your CoviCare Account</h2>
        <div className={styles["backDrop_SingUp"]} />
      </div>
      <form className={styles["container-item_SingUp"]}>
        <fieldset className={styles["fieldset_SingUp"]}>
          <legend className={styles["legend_SingUp"]}>
            Account Information
          </legend>

          <input
            className={styles["input_SingUp"]}
            type="text"
            placeholder="email"
            value={state.email}
            onChange={(event) => dispatch({type: EMAIL_CHANGE, payload: {email: event.target.value}})}
          />
          {state.emailInvalid ? (
            <div className={styles["container-error_SingUp"]}>Invalid email</div>
          ) : null}

          <input
            className={styles["input_SingUp_Left"]}
            type="password"
            placeholder="password"
            value={state.password}
            onChange={(event) => dispatch({type: PASSWORD_CHANGE, payload: {password: event.target.value}})}
          />

          <input
            className={styles["input_SingUp_Right"]}
            type="password"
            placeholder="confirm password"
            value={state.passwordConf}
            onChange={(event) => dispatch({type: PASSWORD_CONF, payload: {passwordConf: event.target.value}})}
          />
          {state.passwordError ? (
            <div className={styles["container-error_SingUp"]}>
              The password must contain:
              <ul>
                <li>at least eight characters</li>
                <li>at least one number</li>
                <li>at least one special character</li>
                <li>lower and upper case letters</li>
              </ul>
            </div>
          ) : null}
          {state.passwordConfError ? (
            <div className={styles["container-error_SingUp"]}>
              Passwords do not match!
            </div>
          ) : null}
        </fieldset>
        <fieldset className={styles["fieldset_SingUp"]}>
          <legend className={styles["legend_SingUp"]}>
            Profile Information
          </legend>

          <input
            className={styles["input_SingUp_Left"]}
            type="text"
            placeholder="First Name"
            value={state.firstName}
            onChange={(event) => dispatch({type: BASIC_CHANGE, payload: {firstName: event.target.value}})}
          />

          <input
            className={styles["input_SingUp_Right"]}
            type="text"
            placeholder="Last Name"
            value={state.lastName}
            onChange={(event) => dispatch({type: BASIC_CHANGE, payload: {lastName: event.target.value}})}
          />

          <input
            className={styles["input_SingUp_Left"]}
            type="date"
            value={state.dateOfBirth}
            onChange={(event) => dispatch({type: BASIC_CHANGE, payload: {dateOfBirth: event.target.value}})}
          />

          <input
            className={styles["input_SingUp_Right"]}
            type="text"
            placeholder="Phone Number"
            value={state.phoneNumber}
            onChange={(event) => {
              dispatch({type: BASIC_CHANGE, payload: {phoneNumber: event.target.value}})
            }}
          />

          <input
            className={styles["input_SingUp"]}
            type="text"
            placeholder="Address"
            value={state.address}
            onChange={(event) => {
              dispatch({type: BASIC_CHANGE, payload: {address: event.target.value}})
            }}
          />
        </fieldset>
        <fieldset className={styles["fieldset_SingUp"]}>
          <legend className={styles["legend_SingUp"]}>User Type</legend>
          <select
            name="userType"
            defaultValue={state.user}
            onChange={(event) => {
              dispatch({type: USER_TYPE_CHANGE, payload: {userType: event.target.value}})
            }}
          >
            <option value="" selected disabled>
              Please select
            </option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="healthOfficial">Health Officer</option>
            <option value="immigrationOfficial">Immigration Officer</option>
            <option value="administrator">Administrator</option>
          </select>
          {state.userType !== '' && (
            <div className={styles["visible_SingUp"]}>
              <input
                className={styles["input_SingUp"]}
                type="text"
                placeholder={placeholderValue(state.userType)}
                maxLength={maxLengthValue(state.userType)}
                value={state.idCard}
                onChange={(event) => {
                  dispatch({type: BASIC_CHANGE, payload: {idCard: event.target.value}})
                }}
              />
            </div>
          )}
        </fieldset>
      </form>

      <button
        className={styles["button_SingUp"]}
        type="submit"
        onClick={submitForm}
        disabled={
          state.email === "" ||
          state.password === "" ||
          state.passwordConf === "" ||
          state.passwordError ||
          state.passwordConfError ||
          state.emailInvalid
        }
      >
        Submit
      </button>
      <div className={styles["container-footer_SingUp"]}>
        Already have an account? <Link to={"/"}>Login!</Link>
      </div>
    </div>
  );
}

export default SignUp;
