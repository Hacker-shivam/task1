import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardProvider } from "./context/DashboardContext";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <DashboardProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
  );
}