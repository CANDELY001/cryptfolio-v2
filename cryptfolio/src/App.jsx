import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import Signup from "./views/signup";
import Login from "./views/login";
import Home from "./views/Home";
import User from "./views/user";
import Dashboard from "./components/dashboard";
import Investement from "./components/investement";
import History from "./components/history";
import Currency from "./components/coins";
import News from "./components/news";
import CryptoDetails from "./Cryptocurrency/CryptoDetails";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./app/store.js";
const App = () => {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/user/*" element={<User />} />{" "}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/investement" element={<Investement />} />
            <Route path="/history" element={<History />} />
            <Route path="/currency" element={<Currency />} />
            <Route path="/news" element={<News />} />
            <Route path="/crypto/:coinId" element={<CryptoDetails />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
};
export default App;
