import { useEffect, useState } from "react";
import { useAuth } from "../Authentication/FirebaseAuth/FirebaseAuth";
import styles from "./CovidData.css";
import "../Tabs/CommonPageStyling.css";
import axios from "axios";
import {PieChart, Pie} from "recharts";

function CovidData(props) {

    let {currentUser} = useAuth();

    /*const [patientList, setPatientList] = useState([]);
    
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
            console.log(patientList);
        } catch (error) {
            console.log(error.response);
        }
    }
    
    const renderPatientList = () => {        
        return (
            <div>
                {patientList.map((patient, index) => (
                    <div>
                        <p key={index}>{patient.status}</p>
                    </div>
                ))}
            </div>
        )
    };
    
    useEffect(() => {
        getPatientArray();
    }, [patientList.length]);*/

    const data = [
        {name: "Positive", value: 200},
        {name: "Negative", value: 150},
        {name: "Not Tested", value: 100},
    ]

    let renderLabel = function(entry) {
        return entry.name;
    }

  return (
    <div>
        <PieChart width={1000} height={400}>
            <Pie
                dataKey="value"
                isAnimationActive={false}
                data={data}
                cx="50%"
                cy={200}
                innerRadius={60}
                outerRadius={80}
                fill="#FFFFFF"
                paddingAngle={3}
                label={renderLabel}
            />
      </PieChart>
    </div>
  );
}

export default CovidData;