/* **************************Global Hooks***********************************
Use Fetch Location by using AWS location Service 
(NOTE: if you change anything here then it will be affected everywhere)
***************************************************************************/
/**
 * useAwsLocation - A custom hook to fetch location details using AWS Location Service.
 *
 * @param {string} address - The address to search for.
 * @param {Function} setFormDataCallback - Callback function to update form data with selected address details.
 * @param {boolean} showBillingAddressList - Flag to indicate if billing address list should be shown.
 * @param {boolean} showShippingAddressList - Flag to indicate if shipping address list should be shown.
 * @returns {Object} The state and handlers related to AWS location fetching.
 * @returns {boolean} return.addressAlert - Flag to indicate if an address alert should be displayed.
 * @returns {Function} return.setAddressAlert - Function to set the address alert state.
 * @returns {string} return.addressAlertMessage - Message to display when an address alert is shown.
 * @returns {Array} return.locationResults - List of location results from the AWS Location Service.
 * @returns {Array} return.shippingLocation - List of shipping locations.
 * @returns {Array} return.billingLocation - List of billing locations.
 * @returns {Function} return.handleSelectChange - Function to handle changes when an address is selected.
 * @returns {Function} return.setIsLocation - Function to set the location state.
 * @returns {boolean} return.isLocation - Flag to indicate if a location has been found.
 */

import { useCallback, useEffect, useState } from "react";
import AWS from "aws-sdk";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

//AWS config
AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: "us-east-1",
});

const locationService = new AWS.Location();

// AWS Location Service Hook(Fetch Specific Location)
const useAwsLocation = (
  address,
  setFormDataCallback,
  showBillingAddressList,
  showShippingAddressList
) => {
  const [addressAlert, setAddressAlert] = useState(false);
  const [addressAlertMessage, setAddressAlertMessage] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [shippingLocation, setShippingLocation] = useState([]);
  const [billingLocation, setBillingLocation] = useState([]);
  const [isLocation, setIsLocation] = useState(false);

  const fetchAddressDetails = useCallback(async () => {
    const params = {
      IndexName: "ERP",
      Text: address,
    };

    try {
      const result = await locationService
        .searchPlaceIndexForText(params)
        .promise();

      // console.log("AWS Location Service Result:", result);

      if (result && result.Results.length > 0) {
        const results = result.Results.map((res) => res.Place);
        // console.log(results, "address")
        setLocationResults(results);
        if (showBillingAddressList) {
          setBillingLocation(results);
          setIsLocation(true);
        } else if (showShippingAddressList) {
          setShippingLocation(results);
          setIsLocation(true);
        }
        setAddressAlert(false);

        // Use a separate object for address details to prevent dependency issues
      } else {
        setAddressAlertMessage("Address Not Found");
        setAddressAlert(true);
        setIsLocation(false);
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      setAddressAlertMessage("Address Not Found");
      setAddressAlert(true);
    }
  }, [
    address,
    locationService,
    showBillingAddressList,
    showShippingAddressList,
  ]);

  // Fetch address details only when the address changes
  useEffect(() => {
    if (address) {
      fetchAddressDetails();
    }
  }, [address, fetchAddressDetails]);

  const handleSelectChange = (selectedAddress) => {
    const addressDetails = {
      city: selectedAddress.Municipality || "",
      state: selectedAddress.Region || "",
      country: selectedAddress.Country || "",
    };

    // Update address details
    setFormDataCallback((prevForm) => ({
      ...prevForm,
      ...addressDetails,
    }));
  };

  useEffect(() => {
    // Set the timeout
    const timeoutId = setTimeout(() => {
      setAddressAlert(false);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, [addressAlert]);

  // console.log(locationResults, "result")
  return {
    addressAlert,
    setAddressAlert,
    addressAlertMessage,
    locationResults,
    shippingLocation,
    billingLocation,
    handleSelectChange,
    setIsLocation,
    isLocation,
  };
};

export default useAwsLocation;

/** How to use this hook***********/

//  const {
//    addressAlertMessage, // Alert Msg
//    addressAlert, // Show/Hide Alert
//    locationResults, // Result
//    shippingLocation,
//    billingLocation,
//    isLocation,
//  } = useAwsLocation(
//    address,
//    setRecordForm,
//    showBillingAddressList,
//    showShippingAddressList
//  );

//  const handleAddressChange = (event) => {
//
//    const { name, value } = event.target;
//    const newAddress = event.target.value;
//    setAddress(newAddress); //pass new address from here
//    handleRecordForm(event); // pass event data
//    if (name === "billing_company_address") {
//      setShowBillingAddressList(true); // Control 2 input section separately
//      setShowShippingAddressList(false); // Control 2 input section separately
//    } else {
//      setShowShippingAddressList(true); // Control 2 input section separately
//      setShowBillingAddressList(false); // Control 2 input section separately
//    }
//  };
