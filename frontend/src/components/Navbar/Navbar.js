import {Link, useNavigate} from 'react-router-dom';
import MainLogo from '../../assets/MainLogo.png';
import UserIcon from '../../assets/user.png';
import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import styles from './Navbar.module.css';

function Navbar(props) {
  let navigate = useNavigate();
  let {currentUser, logout} = useAuth();
  console.log('Navbar user: ', currentUser);
  let isPending = true;
  console.log(isPending);

  const handleLogout = async () => {
    try {
      const response = await logout();
      console.log(response);
      navigate('/', {replace: true});
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav>
      <div className={styles['Header']}>
        <div className={styles['HeaderInnerContainer']}>
          <img src={MainLogo} width='300' alt='CoviCare logo' />

          <div className={styles['user-navbar-display']}>
            <p>Welcome {currentUser.user !== undefined ? currentUser.user.email : null}</p>
            <Link to='/user-profile'>
              <img className={styles['user-icon']} src={UserIcon} width='100' alt='User icon' />
            </Link>

            <button className={styles['button']} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
