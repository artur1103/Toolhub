// src/App.js
import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Backoffice from "./pages/Backoffice";
import WebScraperTool from "./pages/WebScraperTool";
import FormatterTool from "./pages/FormatterTool";
import HashTool from "./pages/HashTool";
import JwtTool from "./pages/JwtTool";
import TestMatrixTool from "./pages/TestMatrixTool";
import SiteCheckerTool from "./pages/SiteCheckerTool";
import AuditLogs from "./pages/AuditLogs";


function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Backoffice />} />
          <Route path="/tools/scraper" element={<WebScraperTool />} />
          <Route path="/tools/formatter" element={<FormatterTool />} />
          <Route path="/tools/hash" element={<HashTool />} />
          <Route path="/tools/jwt" element={<JwtTool />} />
          <Route path="/tools/test-matrix" element={<TestMatrixTool />} />
          <Route path="/tools/site-checker" element={<SiteCheckerTool />} />
          <Route path="/tools/audit" element={<AuditLogs />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
