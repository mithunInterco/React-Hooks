import { useState, useEffect, useCallback } from "react";
import { openDB } from "idb";

// Initialize the IndexedDB database
const dbPromise = openDB("cacheDB", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("dataStore")) {
      db.createObjectStore("dataStore");
    }
  },
});

const useFetchIndexDB = (activeTab) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to retrieve all data from IndexedDB
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const db = await dbPromise;
      const tx = db.transaction("dataStore", "readonly");
      const store = tx.objectStore("dataStore");
      const data = await store.getAll();
      await tx.done;
      setAllData(data[0]);
    } catch (err) {
      console.error("Error fetching data from IndexedDB:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, activeTab]);

  return { allData, setAllData, loading, error, refetch: fetchAllData };
};

export default useFetchIndexDB;
