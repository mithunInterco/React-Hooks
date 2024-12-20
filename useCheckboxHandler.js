import { useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import useDateFormatter from "./useDateFormatter";
import useRetryRequest from "./useRetryRequest";
import {
  getDBInstance,
  getFromIndexedDB,
  saveToIndexedDB,
} from "../Utils/IndexDbUtils";

const useCheckboxHandler = (apiData, setApiData, url, dateFields = []) => {
  const { DateFormatter } = useDateFormatter();
  const retryPutRequest = useRetryRequest();

  // Initialize IndexedDB
  getDBInstance();

  // Function to handle checkbox change
  const handleCheckboxChange = useCallback(
    async (rowId, field, isChecked) => {
      const updatedItems = apiData.map((item) =>
        item.id === rowId ? { ...item, [field]: isChecked } : item
      );
      setApiData(updatedItems);

      // Prepare the data payload
      const formDataSend = {
        ...updatedItems.find((item) => item.id === rowId),
      };

      // Process date fields if provided
      if (dateFields) {
        dateFields.forEach((dateField) => {
          if (formDataSend[dateField]) {
            formDataSend[dateField] = DateFormatter(formDataSend[dateField]);
          }
        });
      }

      try {
        let tabData = await getFromIndexedDB("ManagementStore", url);

        if (tabData) {
          const itemIndex = tabData.findIndex((item) => item.id === rowId);

          if (itemIndex !== -1) {
            // Update specific item within the tab data
            tabData[itemIndex] = { ...tabData[itemIndex], ...formDataSend };

            await saveToIndexedDB("ManagementStore", url, tabData);

            enqueueSnackbar(`${field.toUpperCase()} updated successfully!`, {
              variant: "success",
            });

            /*Attempt to update the actual database with retries if it fails******/
            retryPutRequest(`${url}${rowId}`, formDataSend, 3, 1000);
          } else {
            enqueueSnackbar(`Item with ID ${rowId} not found.`, {
              variant: "warning",
            });
          }
        } else {
          enqueueSnackbar(`No data found for this ID.`, {
            variant: "error",
          });
        }
      } catch (error) {
        console.error(`Failed to update ${field} for item ID ${rowId}`, error);
        enqueueSnackbar(`Error updating ${field}.`, {
          variant: "error",
        });
      }
    },
    [apiData, setApiData, getDBInstance, url, dateFields]
  );

  return handleCheckboxChange;
};

export default useCheckboxHandler;
