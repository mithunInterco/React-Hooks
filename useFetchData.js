import { useState, useEffect, useCallback } from "react";

const useFetchData = (url, sortField, sortName, compareField) => {
  const [apiData, setApiData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal,
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error("Network response was not ok");

      let result = await response.json();
      if (!result) return;

      // Sort the data with items having status(sortName) "Ready"(compareField) at the top
      const sortedData = Array.from(result)
        .map((item, index) => ({
          ...item,
          originalIndex: index, // Store original index
        }))
        .sort((a, b) => {
          // If `a` or `b` has status "Ready", prioritize it
          if (a[sortName] === compareField && b[sortName] !== compareField)
            return -1;
          if (a[sortName] !== compareField && b[sortName] === compareField)
            return 1;

          // Otherwise, sort based on the `sortField`
          if (a[sortField] < b[sortField]) return -1;
          if (a[sortField] > b[sortField]) return 1;

          // If values are equal, keep the original order
          return a.originalIndex - b.originalIndex;
        });

      setApiData(sortedData);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message);
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [url, reloadData, sortName, compareField, sortField]);

  useEffect(() => {
    fetchData();
  }, [fetchData, reloadData]);

  return {
    apiData,
    setApiData,
    reloadData,
    setReloadData,
    loading,
    error,
    setLoading,
  };
};

export default useFetchData;
