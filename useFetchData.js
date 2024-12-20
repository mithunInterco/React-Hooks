import { useState, useEffect, useCallback, useMemo } from "react";
import useSortData from "./useSortData";
import {
  dbPromise,
  getDBInstance,
  saveToIndexedDB,
} from "../Utils/IndexDbUtils";

const useFetchData = (
  baseUrl,
  sortField,
  sortName,
  compareField,
  activeTab
) => {
  const [apiData, setApiData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [error, setError] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loadingCache, setLoadingCache] = useState(true);

  getDBInstance();

  // Initialize sort function with memoization
  const sortData = useSortData(sortField, sortName, compareField);

  // Memoized sorted data
  const sortedApiData = useMemo(() => sortData(apiData), [apiData, sortData]);

  // Function to update IndexedDB with new data for each activeTab
  const updateCache = useCallback(
    async (patchData) => {
      await saveToIndexedDB("ManagementStore", baseUrl, patchData);
    },
    [baseUrl]
  );

  /*******************************************************
   * Function to fetch data from API and update IndexedDB
   * *****************************************************/
  const fetchDataFromAPI = useCallback(async () => {
    try {
      const response = await fetch(baseUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      if (!result) return;

      const sortedData = sortData(result);
      setApiData(sortedData);
      await updateCache(sortedData);

      // Set a timestamp in sessionStorage to track the last API fetch
      sessionStorage.setItem(`L_A_F`, Date.now().toString());
    } catch (error) {
      console.error("Failed to fetch data from API:", error.message);
      setError(error.message);
    }
  }, [sortData, updateCache, activeTab, baseUrl]);

  /**************************************************
   * Function to fetch data from IndexedDB initially
   * ************************************************/
  const loadDataFromCache = useCallback(async () => {
    setLoadingCache(true);
    try {
      const db = await dbPromise;
      const cachedData = await db.get("ManagementStore", baseUrl);

      if (cachedData) {
        setApiData(sortData(cachedData));
      } else {
        await fetchDataFromAPI();
      }
    } catch (err) {
      console.error("Error loading data from cache:", err);
    } finally {
      setLoadingCache(false);
      setDbInitialized(true);
    }
  }, [baseUrl, sortData, fetchDataFromAPI]);

  /*Load initial data from cache or API on mount or when activeTab changes****/
  useEffect(() => {
    loadDataFromCache();
  }, [loadDataFromCache]);

  /**************************************************
   * Trigger API fetch if data is stale or on refresh
   * ************************************************/
  useEffect(() => {
    const lastFetchTime = sessionStorage.getItem(`L_A_F`);
    const isDataStale =
      !lastFetchTime || Date.now() - parseInt(lastFetchTime, 10) > 3600000;

    if (dbInitialized && isDataStale) {
      fetchDataFromAPI();
    }
  }, [dbInitialized, fetchDataFromAPI, activeTab]);

  // Refresh data from API whenever reloadData is triggered
  useEffect(() => {
    if (dbInitialized && reloadData) {
      fetchDataFromAPI();
      setReloadData(false);
    }
  }, [fetchDataFromAPI, reloadData, dbInitialized]);

  return {
    apiData: sortedApiData,
    setApiData,
    reloadData,
    setReloadData,
    error,
    loadingCache,
  };
};

export default useFetchData;
