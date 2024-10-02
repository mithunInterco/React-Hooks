//useReloadData hook only for table data updating after addition, edit, deletion

const useReloadData = () => {
  const handleItemAdded = (newItem, prev) => {
    // Find the index of the existing item
    const existingItemIndex = prev.findIndex((item) => item.id === newItem.id);

    if (existingItemIndex !== -1) {
      // If the item exists, update it in place without changing the order
      return prev.map((item, index) =>
        index === existingItemIndex ? newItem : item
      );
    } else {
      // If the item doesn't exist, append it to the data
      return [...prev, newItem];
    }
  };

  return handleItemAdded;
};

export default useReloadData;

/*UseCase********************************/
//  const handleItemAdded = useReloadData();

//  const handleEditItem = (Item) => {
//    const updatedData = handleItemAdded(Item, apiData);
//    setApiData(updatedData);
//    setReloadData((prev) => !prev);
//  };
