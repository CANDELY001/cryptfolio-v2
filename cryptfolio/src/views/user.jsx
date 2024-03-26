import React, { useState, useEffect } from "react";
import "../assets/css/user.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Route, Routes, Navigate } from "react-router-dom"; // Removed BrowserRouter and Navigate imports
import Dashboard from "../components/dashboard";
import Investement from "../components/investement"; // Corrected the typo here
import History from "../components/history";
import Currency from "../components/coins";
import News from "../components/news";
import CryptoDetails from "../Cryptocurrency/CryptoDetails";
/*const RenderSelectedComponent = (selectedContent) => {
  const { content } = useParams();

  switch (content) {
    case "dashboard":
      return <Dashboard />;
    case "investment":
      return <Investment />;
    case "history":
      return <History />;
    case "currency":
      return <Currency />;
    case "news":
      return <News />;
    default:
      return null;
  }
};*/

const User = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState("dashboard");

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navigate = useNavigate();
  const { content } = useParams();
  useEffect(() => {
    setSelectedContent(content || "dashboard");
  }, [content]);
  const handleMenuClick = (content) => {
    setSelectedContent(content);
    navigate(`/user/${content}`);
  };
  const renderSelectedComponent = () => {
    switch (selectedContent) {
      case "dashboard":
        return <Dashboard />;
      case "investement":
        return <Investement />;
      case "history":
        return <History />;
      case "currency":
        return <Currency />;
      case "news":
        return <News />;
      default:
        return <CryptoDetails />;
    }
  };
  return (
    <>
      <div className={`containerUser ${isNavOpen ? "nav-open" : ""}`}>
        <div className="nav-bar">
          <input
            id="nav-toggle"
            className="nav-toggle"
            type="checkbox"
            checked={isNavOpen}
            onChange={toggleNav}
          />
          <div className="nav-header">
            <a className="nav-title" href="" target="_self">
              CryptFolio
            </a>
            <label htmlFor="nav-toggle">
              <span className="nav-toggle-burger"></span>
            </label>
            <hr />
          </div>
          <div className="nav-content">
            <div
              className="nav-button"
              onClick={() => handleMenuClick("dashboard")}
            >
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </div>
            <div
              className="nav-button"
              onClick={() => handleMenuClick("investement")}
            >
              <i className="fas fa-dollar-sign"></i>
              <span>Investment</span>
            </div>
            <div
              className="nav-button"
              onClick={() => handleMenuClick("history")}
            >
              <i className="fas fa-history"></i>
              <span>History</span>
            </div>
            <hr />
            <div
              className="nav-button"
              onClick={() => handleMenuClick("currency")}
            >
              <i className="fas fa-coins"></i>
              <span>Currency</span>
            </div>
            <div className="nav-button" onClick={() => handleMenuClick("news")}>
              <i className="fas fa-newspaper"></i>
              <span>News</span>
            </div>
            <div className="nav-content-highlight"></div>
          </div>
          <input className="nav-footer-toggle" type="checkbox" />
          <div className="nav-footer">
            <div className="nav-footer-heading">
              <div className="nav-footer-avatar">
                <img src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg" />
              </div>
              <div className="nav-footer-titlebox">
                <a
                  className="nav-footer-title"
                  href="#"
                  target="_self"
                  style={{ color: "white" }}
                >
                  User
                </a>
                <span className="nav-footer-subtitle">User</span>
              </div>
              <label htmlFor="nav-footer-toggle">
                <a href="/home" style={{ color: "white" }}>
                  <i className="fas fa-sign-out-alt"></i>
                </a>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        className="route-content"
        style={{
          left: isNavOpen ? "110px" : "300px",
          width: isNavOpen ? "90%" : "75%",
        }}
      >
        {renderSelectedComponent()}
        <Routes>
          <Route
            path="/user"
            element={<Navigate to="/user/dashboard" replace />}
          />
          <Route path="/crypto/:coinId" element={<CryptoDetails />} />
        </Routes>
      </div>
    </>
  );
};
const Content = () => {
  const { content } = useParams();

  switch (content) {
    case "dashboard":
      return <Dashboard />;
    case "investment":
      return <Investement />;
    case "history":
      return <History />;
    case "currency":
      return <Currency />;
    case "news":
      return <News />;
    case "crypto/:coinId":
      return <CryptoDetails />;
    default:
      return null;
  }
};
export default User;
