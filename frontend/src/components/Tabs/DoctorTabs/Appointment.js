import { useEffect, useState } from "react";
import { useAuth } from "../../Authentication/FirebaseAuth/FirebaseAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Appointment.module.css";
import "../CommonPageStyling.css";
import axios from "axios";
import {Button} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";



function Appointment(props) {
     
    let {currentUser} = useAuth();
    const [value, onChange] = useState(new Date());
    const [patientList, setPatientList] = useState([]);
    
    const getPatientArray = async () => {
        try {
            const response = await axios.get(`doctor/${currentUser.user.uid}/patientArray`);
            setPatientList(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const renderPatientList = () => {
        let optionPatient = patientList.map((patient) =>
                <option data-testid="patient-name">{patient.name}</option> 
            );

        return (
            <div>
                <select>
                    {optionPatient}
                </select>
            </div>
        )
    }

    useEffect(() => {
        getPatientArray();
    }, [patientList.length]);

    return (
        <div>
            <form>
                {renderPatientList()}
                <div>
                    <DatePicker 
                        selected={value} 
                        onChange={onChange} 
                        inline
                        showTimeSelect
                        timeIntervals={30}
                        minTime={setHours(setMinutes(new Date(), 0), 7)}
                        maxTime={setHours(setMinutes(new Date(), 0), 20)}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        popperPlacement="top-end"
                        
                    />
                </div>
                <Button>
                    Submit
                </Button>
            </form>

        </div>
    );
}
export default Appointment;
