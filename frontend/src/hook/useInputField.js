import { useState } from "react";

const useInputField = (initialState, newField) => {
  const [fields, setFields] = useState(initialState);

  const handleFieldChange = (event, index) => {
    const { name, value } = event.target;
    console.log(index, name, value);
    const list = [...fields];
    list[index][name] = value;
    setFields(list);
  };

  const handleAddField = () => {
    const field = Object.assign({}, newField);
    setFields([...fields, field]);
  };

  const handleDeleteField = (index) => {
    const list = [...fields];
    list.splice(index, 1);
    setFields(list);
  };

  return [
    fields,
    setFields,
    handleFieldChange,
    handleAddField,
    handleDeleteField,
  ];
};

export default useInputField;
