import { useCallback } from "react";

const useHandleSelectItem = (keys, storage = localStorage) => {
  /**
   * handleSelectItem - Handles the selection of an item in the table.
   * @param {Object} item - The selected item.
   * @param {Boolean} checked - Whether the item is selected (checked) or not.
   * @param {Function} [onSelect] - Optional callback executed when an item is selected.
   * @param {Function} [onDeselect] - Optional callback executed when an item is deselected.
   */
  const handleSelectItem = useCallback(
    (item, event, onSelect, onDeselect) => {
      if (!keys || keys.length < 2) {
        console.error("Invalid keys array. Please provide at least two keys.");
        return;
      }

      try {
        if (item && event) {
          // Store selected item data
          storage.setItem(keys[0], JSON.stringify(item.id));
          storage.setItem(keys[1], JSON.stringify(item));

          // Optional callback for item selection
          if (onSelect) onSelect(item);
        } else if (item && !event) {
          // Clear specific keys
          storage.removeItem(keys[0]);
          storage.removeItem(keys[1]);

          // Optional callback for item deselection
          if (onDeselect) onDeselect(item);
        }
      } catch (error) {
        console.error("Failed to store/remove item in storage:", error);
      }
    },
    [keys, storage]
  );

  return { handleSelectItem };
};

export default useHandleSelectItem;
