//  Code to wrap entire app, for loading data from an API and storing it in a context provider
import React, { createContext, useState, useEffect, useCallback } from "react";
import ApiDataFetch from "../api/ApiDataFetch";
import apiService from "../api/apiService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [data, response] = await Promise.all([
        ApiDataFetch.main({ type: "home" }),
        apiService.listProducts(),
      ]);

      setSiteData(data);
      setProductData(response);
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
    <DataContext.Provider value={{ siteData, loading, fetchData, productData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
