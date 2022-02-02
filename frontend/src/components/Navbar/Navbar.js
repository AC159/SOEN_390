import MainLogo from "../../assets/MainLogo.png";
import UserIcon from "../../assets/user.png";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";

function Navbar(props) {
    let { currentUser } = useAuth();


    return (
        <nav>
            <div className="Header">
                <div className="HeaderInnerContainer">
                    <img src={MainLogo} width="300"></img>
                    <div className="user-navbar-display">
                        <p>Welcome, {currentUser.email}</p>
                        <a href='#'><img className="user-icon" src={UserIcon} width="100"/></a>
                    </div>
                </div>
                
            </div>
        </nav>
    );
}

export default Navbar;
