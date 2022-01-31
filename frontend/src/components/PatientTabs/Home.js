import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import photo1 from "../../assets/HomePhotos/doctor_sitting.jpg";
import photo2 from "../../assets/HomePhotos/mask.jpg";
import photo3 from "../../assets/HomePhotos/closed.jpg";
import { Accordion } from "react-bootstrap";
import { Carousel } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./Home.css";

function Home(props) {
    return (
        <div className="home-outer-container">
            <div className="todays-new-title">
                Today's News
                
            </div>
            <hr />
                <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100 home-img"
      src={photo1}
      alt="First slide"
      width="500"
    />
    <Carousel.Caption>
      <h3>COVID cases going down</h3>
      <p>The Healthcare system is finally experiencing easing strain</p>
    </Carousel.Caption>
  </Carousel.Item>
  
  <Carousel.Item>
    <img
      className="d-block w-100 home-img"
      src={photo3}
      alt="Third slide"
      width="500"
    />

    <Carousel.Caption>
      <h3>Lockdown restrictions to end tomorrow</h3>
      <p>Is this finally over?</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
<hr />
        </div>
        
        
    );
}

export default Home;