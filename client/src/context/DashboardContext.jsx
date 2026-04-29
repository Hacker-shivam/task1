import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [t, s, c, srv, ins] = await Promise.all([
        API.get("/dashboard/total"),
        API.get("/dashboard/status"),
        API.get("/dashboard/city"),
        API.get("/dashboard/service"),
        API.get("/analytics"),
      ]);

      const newData = {
        total: t.data.total,
        status: s.data,
        city: c.data,
        service: srv.data,
        insights: ins.data,
      };

      setData(newData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, refresh: fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);