import {useEffect, useState} from 'react';
import axios from 'axios';
import {PieChart, Pie, Tooltip, Cell} from 'recharts';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid} from 'recharts';
import {Col, Container, Row} from 'react-bootstrap';

import {useAuth} from '../Authentication/FirebaseAuth/FirebaseAuth';
import styles from './CovidData.module.css';
import '../Tabs/CommonPageStyling.css';

//Array of color for different categories in the pie chart.
const COLORS = ['#2181B9', '#24AC78', '#D9BB23'];
const initialStats = {
  numPosPatients: 0,
  numNegPatients: 0,
  numNoTestPatients: 0,
  numPatientsFlagged: 0,
  numPatientsNotFlagged: 0,
};

function CovidData() {
  let {currentUser} = useAuth();

  const [patientList, setPatientList] = useState([]);
  const [statistics, setStatistics] = useState(initialStats);
  const [patientsStatus, setPatientStatus] = useState([]);
  const [patientFlag, setPatientFlag] = useState([]);

  //Gets the array of patients belonging to the doctor and their status.
  const getPatientArray = async () => {
    try {
      const response = await axios.get(`doctor/${currentUser.user.uid}/patientArrays`);
      setPatientList(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getPatientArray();
  }, []);

  useEffect(() => {
    patientList.forEach((patient) => {
      statusData(patient.status);
      flagData(patient.doctorFlagInfo.isFlagged);
    });
  }, [patientList]);

  useEffect(() => {
    makePatientStatusArr(
      statistics.numPosPatients,
      statistics.numNegPatients,
      statistics.numNoTestPatients,
    );
    makePatientFlagArr(statistics.numPatientsFlagged, statistics.numPatientsNotFlagged);
  }, [statistics]);

  //Counts the number of patients that are COVID positive, negative, and have not been tested.
  function statusData(patientStatus) {
    let p = patientStatus.toLowerCase();

    if (p === 'positive') {
      setStatistics((prev) => ({...prev, numPosPatients: prev.numPosPatients + 1}));
    }

    if (p === 'negative') {
      setStatistics((prev) => ({...prev, numNegPatients: prev.numNegPatients + 1}));
    }

    if (p === 'not tested') {
      setStatistics((prev) => ({...prev, numNoTestPatients: prev.numNoTestPatients + 1}));
    }
  }

  //Creates array of data with the current number patients that have tested positive, negative, or were not tested.
  const makePatientStatusArr = (pos, neg, noTest) => {
    let totalPatients =
      statistics.numPosPatients + statistics.numNegPatients + statistics.numNoTestPatients;
    // var totalPatients = numPosPatients + numNegPatients + numNoTestPatients;
    var percentPos = (statistics.numPosPatients / totalPatients) * 100;
    var percentNeg = (statistics.numNegPatients / totalPatients) * 100;
    var percentNoTest = (statistics.numNoTestPatients / totalPatients) * 100;

    let pp = percentPos.toFixed(2);
    let pn = percentNeg.toFixed(2);
    let pnt = percentNoTest.toFixed(2);

    let posName = pp + '% Positive';
    let negName = pn + '% Negative';
    let noTestName = pnt + '% Not Tested';

    setPatientStatus([
      {name: posName, value: pos},
      {name: negName, value: neg},
      {name: noTestName, value: noTest},
    ]);
  };

  //Renders the labels "Positive", "Negative", and "Not Tested" on the pie chart.
  let renderLabel = function (entry) {
    return entry.name;
  };

  //Counts the number of patients that have been flagged versus the number of patients that have not.
  function flagData(patientFlag) {
    if (patientFlag) {
      setStatistics((prev) => ({...prev, numPatientsFlagged: prev.numPatientsFlagged + 1}));
    } else {
      setStatistics((prev) => ({...prev, numPatientsNotFlagged: prev.numPatientsNotFlagged + 1}));
    }
  }

  //Creates array of data with the current number patients that have been flagged and not flagged.
  function makePatientFlagArr(flag, noFlag) {
    setPatientFlag([
      {name: 'Flagged', value: flag},
      {name: 'Not Flagged', value: noFlag},
    ]);
  }

  return (
    <div data-testid='covid-data' className={styles['covidData']}>
      <Container>
        <Row>
          <Col>
            <div className={styles['chart']}>
              <h3 className={styles['chartTitle']}>Current Patients Status</h3>
              <PieChart width={600} height={400}>
                <Pie
                  dataKey='value'
                  isAnimationActive={false}
                  data={patientsStatus}
                  cx={315}
                  cy='50%'
                  innerRadius={90}
                  outerRadius={150}
                  paddingAngle={3}
                  label={renderLabel}
                  data-testid='pie-chart'
                >
                  {patientsStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </Col>

          <Col>
            <div className={styles['chart']}>
              <h3 className={styles['chartTitle']}>Number of Flagged Patients</h3>
              <BarChart
                width={500}
                height={400}
                data={patientFlag}
                data-testid='bar-chart'
                margin={{
                  top: 20,
                  right: 10,
                  left: 50,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#24AC78' />
              </BarChart>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CovidData;
