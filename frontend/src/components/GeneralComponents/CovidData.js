import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import styles from "./CovidData.module.css";
import "../Tabs/CommonPageStyling.css";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Col, Container, Row } from "react-bootstrap";

function CovidData(props) {

    let {currentUser} = useAuth();

    const [patientList, setPatientList] = useState([]);
    var numPosPatients = 0, numNegPatients = 0, numNoTestPatients = 0;
    var numPatientsFlagged = 0, numPatientsNotFlagged = 0;
    var data1 = [];
    var data2 = [];
    
    //Gets the array of patients belonging to the doctor and their status.
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
            console.log(patientList);
        } catch (error) {
            console.log(error.response);
        }
    }
    
    useEffect(() => {
        getPatientArray();
    }, [patientList.length]);

    //Counts the number of patients that are COVID positive, negative, and have not been tested.
    function statusData(patientStatus){    
        let p = patientStatus.toLowerCase();

        if (p == 'positive')
        {
            numPosPatients = numPosPatients + 1;
        }

        if (p == 'negative')
        {
            numNegPatients = numNegPatients + 1;
        }

        if (p == 'not tested')
        {
            numNoTestPatients = numNoTestPatients + 1;
        }
    };

    //Creates array of data with the current number patients that have tested positive, negative, or were not tested.
    function makePatientStatusArr(pos, neg, noTest){

        data1 = [
            {name: "Positive", value: pos},
            {name: "Negative", value: neg},
            {name: "Not Tested", value: noTest},
        ]

    }

    //Renders the labels "Positive", "Negative", and "Not Tested" on the pie chart.
    let renderLabel = function(entry) {
        return entry.name;
    }

    //Array of color for different categories in the pie chart.
    const COLORS = ['#2181B9', '#24AC78', '#D9BB23'];

    //Counts the number of patients that have been flagged versus the number of patients that have not.
    function flagData(patientFlag){    
        if(patientFlag)
        {
            numPatientsFlagged = numPatientsFlagged + 1;
        }
        if(!patientFlag)
        {
            numPatientsNotFlagged = numPatientsNotFlagged + 1;
        }
    };

    //Creates array of data with the current number patients that have been flagged and not flagged.
    function makePatientFlagArr(flag, noFlag){

        data2 = [
            {name: "Flagged", value: flag},
            {name: "Not Flagged", value: noFlag}
        ]

    }

    return (
    <div className={styles["covidData"]}>

        {patientList.map((patient, index) => (
            <div key={index}>
                {statusData(patient.status)}
                {flagData(patient.doctorFlagInfo.isFlagged)}
            </div>
        ))}

        <div>
            {makePatientStatusArr(numPosPatients, numNegPatients, numNoTestPatients)}
            {makePatientFlagArr(numPatientsFlagged, numPatientsNotFlagged)}
        </div>
        
        <Container>
            <Row>
                <Col>
                    <div className={styles["chart"]}>
                        <h3 className={styles["chartTitle"]}>Current Patients Status</h3>
                        <PieChart width={500} height={400}>
                            <Pie
                                dataKey="value"
                                isAnimationActive={false}
                                data={data1}
                                cx={315}
                                cy="50%"
                                innerRadius={90}
                                outerRadius={150}
                                paddingAngle={3}
                                label={renderLabel}
                            >
                                {data1.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip/>
                        </PieChart>
                    </div>
                </Col>

                <Col>
                    <div className={styles["chart"]}>
                        <h3 className={styles["chartTitle"]}>Number of Flagged Patients</h3>
                        <BarChart
                            width={500}
                            height={400}
                            data={data2}
                            margin={{
                                top: 20,
                                right: 10,
                                left: 50,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#24AC78" />
                        </BarChart>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  );
}

export default CovidData;