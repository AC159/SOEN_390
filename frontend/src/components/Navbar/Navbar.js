import { useNavigate } from "react-router-dom";

import MainLogo from "../../assets/MainLogo.png";
import UserIcon from "../../assets/user.png";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

function Navbar(props) {
    let navigate = useNavigate();
    const auth = useAuth();
    let { currentUser } = auth;

    const handleLogout = () => {
        auth.logout()
            .then(() => {
                navigate('/', { replace: true });
            });
    }

    return (
        <nav>
            <div className="Header">
                <div className="HeaderInnerContainer">
                    <img src={MainLogo} width="300"></img>
                    <div className="user-navbar-display">
                        <p>Welcome, {currentUser.email}</p>
                        <a href='#'><img className="user-icon" src={UserIcon} width="100"/></a>

                    </div>
                    <div className="logOut">
                        <button onClick={handleLogout}>Log out</button>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
