/**
 * useSubmitData - A custom hook to handle data submission with validation and error handling.
 *
 * @param {Function} setSuccessAlert - Function to set the success alert state.
 * @param {Function} setAlertMessage - Function to set the alert message.
 * @param {Function} handleReloadItem - Function to handle reloading items after a successful submission.
 * @param {Function} setShow - Function to control the visibility of the submission form or modal.
 * @param {Array} filteredApiData - An array of data to check for existing items.
 * @param {Object} TableData - Data from the table to be checked against filteredApiData.
 * @param {string} accessToken - Access token for authorization.
 * @returns {Object} An object containing the submitData function, result state, and loading state.
 * @returns {Function} return.submitData - Function to submit data to a specified URL.
 * @returns {Array} return.result - State array containing the result of the data submission.
 * @returns {boolean} return.loading - State indicating if the data submission is in progress.
 */
/* **************************Global Hooks***********************************
(NOTE: if you change anything here then it will be affected everywhere)
***************************************************************************/
import { useState, useCallback } from "react";

const useSubmitData = (
  setSuccessAlert,
  setAlertMessage,
  handleReloadItem,
  setShow,
  filteredApiData,
  setSubmissionError = false,
  TableData,
  accessToken
) => {
  const token = sessionStorage.getItem("userAccessToken");
  const effectiveToken = accessToken || token;

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const submitData = useCallback(
    async (url, data, somethingExit = false) => {
      // Check if submission is needed based on existing data
      if (filteredApiData && TableData && filteredApiData.includes(TableData)) {
        localStorage.clear();
        setSubmissionError(true);
        setShow(false);
        return;
      }

      if (somethingExit) {
        setSubmissionError(true);
        setShow(false);
        return;
      }

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify(data),
      };

      setLoading(true);

      try {
        const response = await fetch(url, config);

        if (!response.ok) {
          const responseData = await response.json();
          console.error("Server response:", responseData);
          throw new Error(responseData.message || "Failed to fetch data");
        }

        const responseData = await response.json();
        setResult(responseData);
        handleReloadItem(responseData);
        setSuccessAlert(true);
      } catch (error) {
        console.error("Error submitting data:", error.message);
        setAlertMessage("Error submitting data");
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
        setShow(false);
      }
    },
    [
      filteredApiData,
      TableData,
      effectiveToken,
      setSubmissionError,
      setShow,
      handleReloadItem,
      setAlertMessage,
      setSuccessAlert,
    ]
  );

  return { submitData, result, loading, errorMessage };
};

export default useSubmitData;
