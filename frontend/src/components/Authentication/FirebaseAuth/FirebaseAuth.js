import React, {useContext, useEffect, useState} from "react";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import axios from "axios";

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function FirebaseAuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState({});
    const auth = getAuth();

    const register = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    const login = async (email, password) => {
        try {
            return await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            return e;
        }
    }

    const logout = () => {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            const dbResponse = await axios.get(`/user/${user.uid}/profile`);
            console.log('DB response: ', dbResponse);
            setCurrentUser({currentUser: user, dbData: dbResponse.data});
            console.log("Current user: ", currentUser);
        });
        return unsubscribe;
    }, [])

    // value will be passed down using the Provider API
    const value = {
        currentUser,
        register,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

export default FirebaseAuthProvider;
