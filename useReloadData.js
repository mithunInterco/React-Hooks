import { useState } from "react";

/* **************************Global Hooks***********************************
Here is useReloadData hooks only for performing on table data Updating
(NOTE: if you change anything here then it will be affected everywhere)
***************************************************************************/

const useReloadData = () => {
  const handleItemAdded = (newItem, prev) => {
    // Find the index of the item to be edited
    const index = prev.findIndex((item) => item.id === newItem.id);
    if (index !== -1) {
      // Replace the item at the found index with the edited item
      const updatedData = [
        ...prev.slice(0, index),
        newItem,
        ...prev.slice(index + 1),
      ];

      return updatedData;
    } else {
      // If the item is not found, just return the previous data
      return prev;
    }
  };

  return handleItemAdded;
};

export default useReloadData;

//UseCase

//  const handleItemAdded = useReloadData();

//  const handleEditItem = (Item) => {
//    const updatedData = handleItemAdded(Item, apiData);
//    setApiData(updatedData);
//    setReloadData((prev) => !prev);
//  };
