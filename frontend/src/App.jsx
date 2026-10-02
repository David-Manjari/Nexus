import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import Approvals from "./pages/approvals/Approvals";
import Disbursements from "./pages/disbursements/Disbursements";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/approvals" replace />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/disbursements" element={<Disbursements />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
