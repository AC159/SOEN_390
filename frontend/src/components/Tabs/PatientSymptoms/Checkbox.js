import React from "react";
import styles from "./CovidFile.module.css";

const Checkbox = ({ id, name, value, defaultChecked, onChange }) => {
  return (
    <label className={styles["checkBox-Label_CovidFile"]} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onChange={onChange}
      />
      <span>{value}</span>
    </label>
  );
};

export default Checkbox;
