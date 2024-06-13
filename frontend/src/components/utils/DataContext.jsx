//  Code to wrap entire app, for loading data from an API and storing it in a context provider
import React, { createContext, useState, useEffect, useCallback } from "react";
import ApiDataFetch from "../api/ApiDataFetch"; // Import your data fetching function

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const data = await ApiDataFetch.main({ type: "home" });
    setSiteData(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ siteData, loading, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
