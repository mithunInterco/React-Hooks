import { useState } from "react";

/* **************************Global Hooks***********************************
(NOTE: if you change anything here then it will be affected everywhere)
***************************************************************************/
/**
 * useRequiredFields - A custom hook for validating required fields in a form and managing alert state.
 *
 * @returns {Object} An object containing the state and handlers for validating fields and managing alerts.
 * @returns {Function} return.handleValidateFields - Function to validate required fields.
 * @returns {boolean} return.alert - State indicating if an alert should be shown.
 * @returns {string} return.alertMessage - The message to display in the alert.
 * @returns {Function} return.setAlertMessage - Function to set the alert message.
 * @returns {Object} return.state - State object for the Snackbar component.
 * @returns {Function} return.setState - Function to set the state of the Snackbar.
 * @returns {string} return.vertical - Vertical position of the Snackbar.
 * @returns {string} return.horizontal - Horizontal position of the Snackbar.
 * @returns {boolean} return.open - State indicating if the Snackbar is open.
 * @returns {Function} return.SnakeBarHandleClick - Function to handle opening the Snackbar.
 * @returns {Function} return.SnakeBarHandleClose - Function to handle closing the Snackbar.
 */

const useRequiredFields = () => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [state, setState] = useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open } = state;

  const [fieldErrors, setFieldErrors] = useState({}); // Track fields with errors

  const SnakeBarHandleClick = (newState) => () => {
    setState({ ...newState });
  };

  const SnakeBarHandleClose = () => {
    setState({ ...state, open: false });
  };

  // Helper to validate a single set of form data
  const validateSingleFormData = (requiredFields, formData) => {
    let hasError = false;
    const errors = {};

    for (const field of requiredFields) {
      if (!formData[field]) {
        errors[field] = true;
        hasError = true;
      }
    }

    return { hasError, errors };
  };

  // Function to validate fields, handling both single and multiple data
  const handleValidateFields = (
    requiredFields,
    formData,
    multipleData = false
  ) => {
    let hasError = false;
    let allErrors = {};

    // If we're dealing with multiple sets of data (e.g., multiple sub Array or object)
    if (multipleData) {
      Object.keys(formData).forEach((key) => {
        const { hasError: itemHasError, errors } = validateSingleFormData(
          requiredFields,
          formData[key]
        );

        if (itemHasError) {
          hasError = true;
          allErrors[key] = errors; // Store errors for the specific item
        }
      });
    } else {
      // Single form data validation
      const { hasError: formHasError, errors } = validateSingleFormData(
        requiredFields,
        formData
      );

      if (formHasError) {
        hasError = true;
        allErrors = errors; // Store errors for the single form
      }
    }

    if (hasError) {
      setAlert(true);
      setAlertMessage("Please fill out all required fields");
      setState({ ...state, open: true });
      setFieldErrors(allErrors); // Set errors for the relevant fields
      return false;
    } else {
      setFieldErrors({}); // Reset errors if no missing fields
      return true;
    }
  };

  return {
    handleValidateFields,
    alert,
    alertMessage,
    setAlertMessage,
    state,
    setState,
    vertical,
    horizontal,
    open,
    SnakeBarHandleClick,
    SnakeBarHandleClose,
    fieldErrors, // Expose the error state
    setFieldErrors,
  };
};

export default useRequiredFields;
