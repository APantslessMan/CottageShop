//  Code to wrap entire app, for loading data from an API and storing it in a context provider
import React, { createContext, useState, useEffect, useCallback } from "react";
import ApiDataFetch from "../api/ApiDataFetch";
import apiService from "../api/apiService";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [siteData, setSiteData] = useState({});
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState([]);

  const fetchSiteData = async () => {
    try {
      const data = await ApiDataFetch.main({ type: "home" });
      setSiteData(data);
    } catch (error) {
      console.error("Failed to fetch site data:", error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await apiService.listProducts();
      setProductData(response);
    } catch (error) {
      console.error("Failed to fetch product data:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchSiteData(), fetchProductData()]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataContext.Provider value={{ siteData, loading, fetchData, productData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
