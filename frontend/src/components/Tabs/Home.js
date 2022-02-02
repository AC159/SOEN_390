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
                <Accordion.Header>What is CoviCare?</Accordion.Header>
                <Accordion.Body>
                    CoviCare links patients to medical doctors and gives access to health and immigration officers to follow patients current COVID-19 status to ultimately<br></br>
                    reduce the spread of the Coronavirus. CoviCare aims to help you learn and protect yourself and your community.
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
                <Accordion.Header>Are COVID protocols still in place all over Quebec?</Accordion.Header>
                <Accordion.Body>
                Yes. Until further notice, all public places with a capacity of more than a 100 people are restricted from letting civilians in. 
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
                <Accordion.Header>What are general tips for dealing with COVID19?</Accordion.Header>
                <Accordion.Body>
                <ul>
                    <li>Wash hands regularly, with soap for at least 20 seconds</li>
                    <li>Maintain social distancing as much as possible.</li>
                    <li>Wear a mask at all times when social distancing is not possible.</li>
                </ul>
                </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
                <Accordion.Header>How do you deal with COVID-induced stress and anxiety?</Accordion.Header>
                <Accordion.Body>
                <ul>
                    <li>Keeping in touch with loved ones by phone or online.</li>
                    <li>Try exercising at home or going on walks.</li>
                    <li>Seek help for mental health.</li>
                </ul> 
                </Accordion.Body>
            </Accordion.Item>
            </Accordion>
            <hr />

            <div className="todays-new-title">
                Symptoms

            </div>

            <hr />

            <div className="symptoms">
                <p className="symptoms-info">
                    COVID-19 affects different people in different ways. Most infected people will develop mild to moderate illness and recover without hospitalization.
                </p>
                <div className="symptoms-list">
                    <strong>Most common symptoms:</strong>
                    <ul>
                        <li>fever</li>
                        <li>cough</li>
                        <li>tiredness</li>
                        <li>loss of taste or smell</li>
                    </ul>  
                </div>
                <div className="symptoms-list">
                <strong>Less common symptoms:</strong>
                    <ul>
                        <li>sore throat</li>
                        <li>headache</li>
                        <li>aches and pains</li>
                        <li>diarrhoea</li>
                        <li>a rash on skin, or discolouration of fingers or toes</li>
                        <li>red or irritated eyes</li>
                    </ul>  
                </div>
                <div className="symptoms-list">
                <strong>Serious symptoms:</strong>
                    <ul>
                        <li>difficulty breathing or shortness of breath</li>
                        <li>loss of speech or mobility, or confusion</li>
                        <li>chest pain</li>
                    </ul>  
                </div>
                <p className="symptoms-info">
                    Get assigned to a doctor using CoviCare. <strong>Seek immediate medical attention if you have serious symptoms.</strong> People with mild symptoms who are otherwise healthy should<br></br>
                     manage their symptoms at home. On average it takes 5–6 days from when someone is infected with the virus for symptoms to show, however it can take up to 14 days.<br></br>
                    
                </p>
            </div>
            <hr />

<           div className="todays-new-title">
                What to do if you or someone you've been in contact with has tested positive for COVID-19

            </div>

            <hr />

            <div className="tips">
                
                <p className="tips-info">
                    If your symptoms are serious, please seek immediate medical attention. Otherwise CoviCare will assign you to a medical doctor that will continuously follow-up with you.
                    <br></br>
                    <br></br>
                    In the meanwhile, here are some things you can do:
                </p>
                <ul className="tips-list">
                    <li>Find out when and where to get tested if you have not done so already.</li>
                    <li>Fill out a contact tracing report on CoviCare.</li>
                    <li>If testing is not available, stay home and away from others for 14 days.</li>
                    <li>While you are in quarantine, do not go to work, to school or to public places. Ask someone to bring you supplies.</li>
                    <li>Keep at least a 1-metre distance from others, even from your family members.</li>
                    <li>Wear a medical mask to protect others, including if/when you need to seek medical care.</li>
                    <li>Clean your hands frequently.</li>
                    <li>Stay in a separate room from other family members, and if not possible, wear a medical mask.</li>
                    <li>Keep the room well-ventilated.</li>
                    <li>If you share a room, place beds at least 1 metre apart.</li>
                    <li>Monitor yourself for any symptoms for 14 days and log them into CoviCare.</li>
                    <li>Contact your medical doctor immediately if you have any of these danger signs: difficulty breathing, loss of speech or mobility, confusion or chest pain.</li>
                </ul>

                <p className="tips-info">
                    We are here to help you get through this, so contact your doctor if you have any questions about your health.
                </p>
            </div>

            <hr />

            <div className="todays-new-title">
                Useful

            </div>

            <hr />

            <div className="card-container">
            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>COVID-19 Testing</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Government of Quebec</Card.Subtitle>
                <Card.Text>
                Don't know where to get tested? Here is a link to help you get tested as soon as possible. 
                </Card.Text>
                <Card.Link href="#">https://www.quebec.ca/en/health/health-issues/a-z/2019-coronavirus/testing-for-covid-19</Card.Link>
            </Card.Body>
            </Card>
            
            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>Mental Health Services</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Government of Quebec</Card.Subtitle>
                <Card.Text>
                Feeling overwhelmed? Here are some resouces to get the support you need.
                </Card.Text>
                <Card.Link href="#">https://www.quebec.ca/en/health/advice-and-prevention/mental-health/get-help-with-mental-health/mental-health-help-and-support-resources</Card.Link>
            </Card.Body>
            </Card>

            <Card style={{ width: '18rem', margin: '2px'}}>
            <Card.Body>
                <Card.Title>#ScienceExplained</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">COVID-19 Resources Canada</Card.Subtitle>
                <Card.Text>
                Canada's #ScienceExplained is an initiative to help you understand various aspects of the pandemic through written and video information provided by experts. 
                </Card.Text>
                <Card.Link href="#">https://covid19resources.ca/public/science-explained/</Card.Link>
            </Card.Body>
            </Card>

            </div>
        </div>
        
    );
}

export default Home;