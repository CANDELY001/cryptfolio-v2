// Import necessary dependencies
import { Chart, registerables } from "chart.js";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // Assuming this is your main component

// Register Chart.js scales and elements
Chart.register(...registerables);

// Render your main component
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
