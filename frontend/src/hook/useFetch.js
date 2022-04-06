import {useState} from 'react';
import axios from 'axios';

const useFetch = (initialState, url) => {
  const [state, setState] = useState(initialState);

  const fetch = async () => {
    try {
      const response = await axios.get(url);
      setState(response.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return [state, fetch];
};

export default useFetch;
