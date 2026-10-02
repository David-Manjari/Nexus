import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import { PAGE_LINKS } from "./layouts/Navbar";
import Approvals from "./pages/approvals/Approvals";
import Disbursements from "./pages/disbursements/Disbursements";

function getActivePage(pathname) {
  const pageId = pathname.replace(/^\/+/, "").split("/")[0];
  return PAGE_LINKS.find((page) => page.id === pageId) ?? PAGE_LINKS[0];
}


function RedirectToPage() {
  const hashId = window.location.hash.replace(/^#\/?/, "");
  const page = PAGE_LINKS.find((p) => p.id === hashId) ?? PAGE_LINKS[0];
  return <Navigate to={`/${page.id}`} replace />;
}

function Shell() {
  const { pathname } = useLocation();
  const activePage = getActivePage(pathname);

  return (
    <AppLayout activePage={activePage.id}>
      <main className="page-content">
        <p className="page-eyebrow">ShopFlow workspace</p>
        <h1>{activePage.label}</h1>
        <Outlet />
      </main>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToPage />} />
        <Route element={<Shell />}>
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/disbursements" element={<Disbursements />} />
        </Route>
        <Route path="*" element={<RedirectToPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
