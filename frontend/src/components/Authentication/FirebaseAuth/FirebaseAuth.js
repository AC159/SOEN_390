import React, {useState, useContext, useEffect} from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
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

        const data = await signInWithEmailAndPassword(auth, email, password);
        return data;
        // return signInWithEmailAndPassword(auth, email, password).then(data => {
        //     axios.get(`/user/${data.user.uid}/profile`).then(function (response) {
        //         console.log('DB response: ', response);
        //         const user = { currentUser: data, dbData: response.data };
        //         console.log("Current user: ", user);
        //         setCurrentUser(user);
        //         console.log('After setting currentUser: ', currentUser);
        //     }).catch(function (error) {
        //         console.log(error);
        //     });
        // });
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
