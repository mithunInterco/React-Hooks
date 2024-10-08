import { useMemo, useEffect } from "react";

const useFilteredData = (
  apiData,
  activeTab,
  filteredItems,
  setFilteredItems
) => {
  const memoizedFilter = useMemo(() => {
    return (apiData, activeTab) => {
      // Early return for the "booked" tab, filtering by status
      if (activeTab === "all") {
        return apiData;
      } else if (activeTab === "booked") {
        return apiData.filter(
          (item) => item.status === "Booked" || item.status === "Scheduled"
        );
      }

      // Define location-based filtering conditions
      const locationFilters = {
        madison: (item) => item.location === "madison",
        edwardsville: (item) => item.location === "edwardsville",
        dumps: (item) => item.location === "dumps",
        cmr: (item) => item.location === "cmr",
      };

      // Filter by location and exclude "Booked" or "Scheduled" items in other tabs
      if (locationFilters[activeTab]) {
        return apiData.filter(
          (item) =>
            locationFilters[activeTab](item) &&
            item.status !== "Booked" &&
            item.status !== "Scheduled"
        );
      }

      return [];
    };
  }, [apiData, activeTab]);

  useEffect(() => {
    const filtered = memoizedFilter(apiData, activeTab);
    setFilteredItems(filtered);
  }, [apiData, activeTab, memoizedFilter]);

  return filteredItems;
};

export default useFilteredData;
