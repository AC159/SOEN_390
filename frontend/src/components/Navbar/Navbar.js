import {Link, useNavigate} from 'react-router-dom';
import MainLogo from '../../assets/MainLogo.png';
import UserIcon from '../../assets/user.png';
import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import {useState, useEffect} from 'react';
import styles from './Navbar.module.css';

function Navbar(props) {
  let navigate = useNavigate();
  let {currentUser, logout} = useAuth();
  let [userLink, setUserLink] = useState('/');
  console.log('Navbar user: ', currentUser);
  let isPending = true;
  console.log(isPending);

  useEffect(() => {
    console.log(userLink);
    if(currentUser.dbData.userStatus == "PENDING")
      setUserLink('/general-dashboard');
    else
    {
      if(currentUser.dbData.userStatus == "REJECTED") 
        setUserLink('/general-dashboard');
      else if(currentUser.dbData.userStatus == "APPROVED") 
      {
        switch(currentUser.dbData.userType)
        {
          case 'administrator': setUserLink('/admin-dashboard'); break;
          case 'doctor': setUserLink('/doctor-dashboard'); break;
          case 'patient': setUserLink('/patient-dashboard'); break;
          case 'healthOfficial': setUserLink('/health-official-dashboard'); break;
          case 'immigrationOfficial': setUserLink('/immigration-officer-dashboard'); break;

          default: setUserLink('/general-dashboard'); break;
        }
      }
    }
    console.log(userLink);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
      navigate('/', {replace: true});
    } catch (error) {
      console.log(error);
    }
  };

  console.log(userLink);

  return (
    <nav>
      <div className={styles['Header']}>
        <div className={styles['HeaderInnerContainer']}>
          <Link to={userLink}>
            <img src={MainLogo} className={styles['logo-navbar']} alt='CoviCare logo' />
          </Link>

          <div className={styles['user-navbar-display']}>
            <div>
              <p>Welcome {currentUser.user !== undefined ? currentUser.user.email : null}</p>
              <button className={styles['button-navbar']} onClick={handleLogout}>
                Log out
              </button>
            </div>
            <Link to='/user-profile'>
              <img className={styles['user-icon']} src={UserIcon} width='100' alt='User icon' />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
