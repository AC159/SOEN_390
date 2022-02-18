import React, { useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function FirebaseAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const auth = getAuth();

  const register = async (email, password, userSignUpData) => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Sign in successful...");
      // before sending the user sign up data to the db, we need to append the firebase uid
      userSignUpData["userId"] = userData.user.uid;
      try {
        const dbResponse = await axios.post("user/addNewUser", userSignUpData);
        console.log("sign up db response: ", dbResponse);
        setCurrentUser({ user: userData.user, dbData: dbResponse.data });
      } catch (error) {
        console.log("error sending sign up user data to back-end...");
        console.log("Error: ", error);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userData) => {
      if (userData && userData.uid) {
        console.log("onAuthStateChanged: ", userData);
        const dbResponse = await axios.get(`/user/${userData.uid}/profile`);
        console.log("DB response: ", dbResponse);
        setCurrentUser({ user: userData, dbData: dbResponse.data });
        console.log("Current user: ", currentUser);
      }
    });
    return unsubscribe;
  });

  // value will be passed down using the Provider API
  const value = {
    currentUser,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default FirebaseAuthProvider;
