import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import photo1 from "../../assets/HomePhotos/doctor_sitting.jpg";
import photo2 from "../../assets/HomePhotos/mask.jpg";
import photo3 from "../../assets/HomePhotos/closed.jpg";
import { ListGroup } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { Carousel } from "react-bootstrap";
import { Card } from "react-bootstrap";

import 'bootstrap/dist/css/bootstrap.min.css';
import "./Home.css";

function Home(props) {

    function alertClicked() {
        alert('Boo');
      }

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
            <div className="todays-new-title">
                General FAQs

            </div>
            <hr />
            <Accordion defaultActiveKey="-1" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>Are COVID protocols still in place all over Quebec?</Accordion.Header>
                <Accordion.Body>
                Yes. Until further notice, all public places with a capacity of more than a 100 people are restricted from letting civilians in. 
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>What are general tips for dealing with COVID19?</Accordion.Header>
                <Accordion.Body>
                <p>1) Wash hands regularly, with soap for at least 20 seconds</p>
                <p>2) Maintain social distancing as much as possible.</p>
                <p>3) Wear a mask at all times when social distancing is not possible.</p>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>How do you deal with COVID-induced stress and anxiety?</Accordion.Header>
                <Accordion.Body>
                <p>Lol get used to it</p>
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            <hr />

            <div className="todays-new-title">
                Useful

            </div>

            <hr />

            <div className="card-container">
            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>
            
            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>
            
            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
                <Card.Text>
                Some quick example text to build on the card title and make up the bulk of
                the card's content.
                </Card.Text>
                <Card.Link href="#">Card Link</Card.Link>
                <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
            </Card>
            </div>
        </div>
        
        
    );
}

export default Home;