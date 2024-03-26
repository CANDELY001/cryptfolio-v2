import React, { useState } from "react";
import "../assets/css/Home.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const Home = () => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <nav className="navbarHome">
        <div className="navbarH-logo">
          <span className="logo-text">CryptFolio</span>
        </div>
      </nav>

      <div className="containerH">
        <div className="container_content">
          <div className="container_content_inner">
            <div className="par">
              <p>
                {expanded
                  ? "With Cryptfolio, you can effortlessly monitor your investments, stay updated with real-time market data, and visualize your portfolio performance with ease. Whether you're a seasoned investor or just starting out in the world of crypto, Cryptfolio simplifies the process, empowering you to make informed decisions and take control of your financial future. Join us and embark on your crypto journey with confidence."
                  : "With Cryptfolio, you can effortlessly monitor your investments, stay updated with real-time market data, and visualize your portfolio performance with ease. "}
              </p>
              {!expanded && (
                <button
                  className="read-more-btn"
                  onClick={handleToggle}
                  style={{
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "none",
                    fontSize: "16px",
                    textDecorationLine: "underline",
                  }}
                >
                  Read More
                </button>
              )}
            </div>
            <div className="btns">
              <Link to="/register">
                <button className="btns_more">Start now!</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="overlay"></div>
      </div>
      <h2>Quotes to read...</h2>
      <div className="ContentQuotes">
        <blockquote class="q-card q-card-color-1">
          <div class="content">
            "The stock market is filled with individuals who know the price of
            everything, but the value of nothing."
          </div>
          <div class="author">Anonymous</div>
        </blockquote>

        <blockquote class="q-card q-card-color-2">
          <div class="content">
            "The best investment you can make is in yourself."
          </div>
          <div class="author">Warren Buffett</div>
        </blockquote>

        <blockquote class="q-card q-card-color-3">
          <div class="content">
            "In the short run, the market is a voting machine, but in the long
            run, it is a weighing machine."
          </div>
          <div class="author">Benjamin Graham</div>
        </blockquote>
      </div>

      <footer
        id="sticky-footer"
        class="flex-shrink-0 py-4 bg-dark text-white-50"
      >
        <div class="container text-center">
          <small>Copyright &copy; CryptFolio</small>
        </div>
      </footer>
    </>
  );
};

export default Home;
