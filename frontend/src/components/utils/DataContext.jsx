//  Code to wrap entire app, for loading data from an API and storing it in a context provider
import React, { createContext, useState, useEffect, useCallback } from "react";
import ApiDataFetch from "../api/ApiDataFetch";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const data = await ApiDataFetch.main({ type: "home" });
      setSiteData(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  if (loading || !siteData) {
    return <div>Loading...</div>;
  }

  return (
    <DataContext.Provider value={{ siteData, loading, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
