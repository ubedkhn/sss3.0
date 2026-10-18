import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalContextProviders } from "./components/_globalContextProviders";
import HomePage from "./pages/_index";
import AboutPage from "./pages/about";
import ServicesPage from "./pages/services";
import ProcessPage from "./pages/process";
import PortfolioPage from "./pages/portfolio";
import PortfolioCasePage from "./pages/portfolio.$slug";
import ContactPage from "./pages/contact";
import JournalPage from "./pages/journal";
import AdminPage from "./pages/admin";
import LoginPage from "./pages/login";
import "./base.css";

function App() {
  return (
    <BrowserRouter>
      <GlobalContextProviders>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioCasePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </GlobalContextProviders>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode><App /></React.StrictMode>
);
