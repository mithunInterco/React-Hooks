/**
 * useAwsLocation - A custom hook to fetch location details using AWS Location Service.
 *
 * @param {string} address - The address to search for.
 * @param {Function} setFormDataCallback - Callback function to update form data with selected address details.
 * @returns {Object} The state and handlers related to AWS location fetching.
 * @returns {boolean} return.addressAlert - Flag to indicate if an address alert should be displayed.
 * @returns {Function} return.setAddressAlert - Function to set the address alert state.
 * @returns {string} return.addressAlertMessage - Message to display when an address alert is shown.
 * @returns {Array} return.locationResults - List of location results from the AWS Location Service.
 * @returns {Array} return.location1 - List of locations 1.
 * @returns {Array} return.location2 - List of locations 2.
 * @returns {Function} return.handleSelectChange - Function to handle changes when an address is selected.
 * @returns {Function} return.setIsLocation - Function to set the location state.
 * @returns {boolean} return.isLocation - Flag to indicate if a location has been found.
 */

import { useCallback, useEffect, useState } from "react";
import AWS from "aws-sdk";

// AWS config
AWS.config.update({
  accessKeyId: "Your_Access_Key",
  secretAccessKey: "Your_Secret_Access_Key",
  region: "Your_Region",
});

const locationService = new AWS.Location();

const useAwsLocation = (address, setFormDataCallback, showList1, showList2) => {
  const [addressAlert, setAddressAlert] = useState(false);
  const [addressAlertMessage, setAddressAlertMessage] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [isLocation, setIsLocation] = useState(false);

  const fetchAddressDetails = useCallback(async () => {
    const params = {
      IndexName: "Your_Index_Name",
      Text: address,
    };

    try {
      const result = await locationService
        .searchPlaceIndexForText(params)
        .promise();

      if (result && result.Results.length > 0) {
        const results = result.Results.map((res) => res.Place);
        setLocationResults(results);

        if (showList1) {
          showList1(results);
        } else if (showList2) {
          showList2(results);
        }

        setIsLocation(true);
        setAddressAlert(false);
      } else {
        setAddressAlertMessage("Address Not Found");
        setAddressAlert(true);
        setIsLocation(false);
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
      setAddressAlertMessage("Address Not Found");
      setAddressAlert(true);
      setIsLocation(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      fetchAddressDetails();
    }
  }, [address, fetchAddressDetails]);

  const handleSelectChange = useCallback(
    (selectedAddress) => {
      const addressDetails = {
        city: selectedAddress.Municipality || "",
        state: selectedAddress.Region || "",
        country: selectedAddress.Country || "",
      };

      setFormDataCallback((prevForm) => ({
        ...prevForm,
        ...addressDetails,
      }));
    },
    [setFormDataCallback]
  );

  useEffect(() => {
    if (addressAlert) {
      const timeoutId = setTimeout(() => {
        setAddressAlert(false);
      }, 4000);

      return () => clearTimeout(timeoutId);
    }
  }, [addressAlert]);

  return {
    addressAlert,
    addressAlertMessage,
    locationResults,
    handleSelectChange,
    isLocation,
  };
};

export default useAwsLocation;


/** How to use this hook***********/

 // const { 
 //    addressAlert, 
 //    addressAlertMessage, 
 //    locationResults, 
 //    handleSelectChange, 
 //    isLocation 
 //  } = useAwsLocation("Your_Address", setFormData, setShowList1, setShowList2);


