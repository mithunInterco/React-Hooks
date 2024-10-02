import { useState, useEffect } from "react";

const useFieldValidation = (
  fieldName,
  fieldValue,
  dataArray,
  fieldError,
  setFieldError,
  isMapped = false
) => {
  //   const [fieldError, setFieldError] = useState(false);

  useEffect(() => {
    if (fieldValue !== "") {
      let validationArray = dataArray;

      // If `isMapped` is true, it means we need to map the data (for supplier)
      if (isMapped) {
        validationArray = dataArray.map((data) => data.name);
      }

      const fieldExists = validationArray.some(
        (item) => item.toLowerCase() === fieldValue.toLowerCase()
      );
      setFieldError(!fieldExists);
    } else {
      setFieldError(false);
    }
  }, [fieldValue, dataArray, isMapped]);

  return fieldError;
};

export default useFieldValidation;
