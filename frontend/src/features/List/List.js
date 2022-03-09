import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Accordion, Stack } from 'react-bootstrap';

import styles from './List.module.css';

const List = (Component, {title, listUrl, render}) => {

  const [list, setList] = useState([])

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(listUrl);
        console.log(response.data)
        setList(response.data.data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchList();
  }, [listUrl]);

  return (
    <div className={styles['role-outer-container']}>
      <div className={styles['todays-new-title']}>{title}</div>
      <hr/>
      <Component>
        {list.map((item, index) => render(item, index))}
      </Component>
      <div className={styles["request-container"]} />
    </div>
  );
};

export default List;

const Div = ({ children }) => <Stack gap={2}>{children}</Stack>

export const PatientList = (props) => List(Accordion, props);
export const DoctorList = (props) => List(Div, props);
