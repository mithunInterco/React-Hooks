/* **************************Global Hooks***********************************
Use Data Fetch Hook(This is the main hook for fetch API data) 
(NOTE: if change anything here then it will be affected everywhere)
***************************************************************************/

import { useState, useEffect, useCallback, useRef } from "react";

const useFetchData = (url) => {
  const [apiData, setApiData] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useRef(sessionStorage.getItem("userAccessToken"));

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.current}`,
        },
        signal,
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();

      if (!result) {
        console.error("Data is undefined");
        return;
      }

      setApiData(Array.from(result));
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message);
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, reloadData, deleteData]);

  return {
    apiData,
    setApiData,
    reloadData,
    setReloadData,
    setDeleteData,
    deleteData,
    loading,
    error,
    setLoading,
  };
};

export default useFetchData;
