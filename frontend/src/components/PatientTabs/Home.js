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
      <h3>First slide label</h3>
      <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
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
      <h3>Third slide label</h3>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>
<hr />
        </div>
        
        
    );
}

export default Home;