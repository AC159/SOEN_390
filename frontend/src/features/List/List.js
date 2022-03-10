import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Accordion, Stack} from 'react-bootstrap';

import styles from './List.module.css';

const List = (Component, {title, listUrl, render}) => {

  const [list, setList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(listUrl);
        console.log(response.data)
        setList(response.data.data);
        console.log(list)
      } catch (e) {
        console.log(e);
      }
    }

    fetchList();
    return () => {
      setList([])
    }
  }, [listUrl]);

  return (
    <div className={styles['role-outer-container']}>
      <div className={styles['todays-new-title']}>{title}</div>
      <hr/>
      <input
        type="text" placeholder="Search by name..."
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
      <Component>
        {list
          .filter((item) => {
            if (searchTerm === "")
              return item;
            if (item.name.toLowerCase().includes(searchTerm.toLowerCase()))
              return item;
          }
          )
          .map((item, index) => render(item, index))
        }
      </Component>
      <div className={styles["request-container"]}/>
    </div>
  );
};

export default List;

const Div = ({children}) => <Stack gap={2}>{children}</Stack>

export const PatientList = (props) => List(Accordion, {title: 'Patient List', ...props});
export const DoctorList = (props) => List(Div, {title: 'Doctor List', ...props});
