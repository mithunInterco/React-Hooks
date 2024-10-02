import { useState, useCallback } from "react";

const useFormChange = (
  formData,
  setFormData,
  userArray,
  apiData,
  fieldErrors,
  setFieldErrors,
  traderError,
  setTraderError,
  setIsPoEdited
) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [filteredOptions, setFilteredOptions] = useState({
    supplier: [],
    trader: [],
  });

  const handleChange = useCallback(
    async (e) => {
      const { name, value, type, checked } = e.target;

      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Mark the PO field as edited
      if (name === "po_num") {
        setIsPoEdited(true); // User has modified the PO number
      }

      // Remove red border if the field is no longer empty
      if (value.trim()) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: false, // Reset error when the field is filled
        }));
      }

      /** Supplier and trader dropdown section ********/
      // Determine which data array to use based on the input name
      const dataArray =
        name === "trader" ? userArray : apiData.map((data) => data.name);

      // Filter data based on input value
      const filtered = dataArray
        .filter((item) => item?.toLowerCase().includes(value.toLowerCase()))
        .map((item) => item);

      // Remove duplicates and check if there are no results
      const uniqueFiltered = [...new Set(filtered)];
      const filteredOptions =
        uniqueFiltered.length > 0 ? uniqueFiltered : ["Not Found"];

      // Update filtered options
      setFilteredOptions((prev) => ({
        ...prev,
        [name]: filteredOptions,
      }));

      // Set dropdown visibility and active field
      setShowDropdown(true);
      setActiveField(name);

      // If the field is trader, check for trader-specific error
      if (name === "trader") {
        // Set error if no exact match is found in userArray
        if (
          !userArray.some((item) => item.toLowerCase() === value.toLowerCase())
        ) {
          setTraderError(true);
        } else {
          setTraderError(false);
        }
      }
    },
    [userArray, apiData, formData]
  );

  return {
    handleChange,
    filteredOptions,
    setFilteredOptions,
    activeField,
    showDropdown,
    setShowDropdown,
  };
};

export default useFormChange;
