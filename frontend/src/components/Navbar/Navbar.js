import { Link, useNavigate } from "react-router-dom";
import MainLogo from "../../assets/MainLogo.png";
import UserIcon from "../../assets/user.png";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import styles from "./Navbar.module.css";


function Navbar(props) {
  let navigate = useNavigate();
  let { currentUser, logout } = useAuth();
  console.log("Navbar user: ", currentUser);
  let isPending = true;
  console.log(isPending);

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <div className={styles["Header"]}>
        <div className={styles["HeaderInnerContainer"]}>
          <Link to="/health-official-dashboard">
            <img src={MainLogo} className={styles["logo-navbar"]} alt="CoviCare logo" />
          </Link>


          <div className={styles["user-navbar-display"]}>
            <div>
              <p>
                Welcome{" "}
                {currentUser.user !== undefined ? currentUser.dbData.name : null}
              </p>
              <button className={styles["button-navbar"]} onClick={handleLogout}>
                Log out
              </button>
            </div>
            <Link to="/user-profile">
              <img
                className={styles["user-icon"]}
                src={UserIcon}
                width="100"
                alt="User icon"
              />
            </Link>


          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
