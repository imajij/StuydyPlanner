/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import { App } from "./App";
import "./index.css";

function start() {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Could not find root element");
    return;
  }
  
  const root = createRoot(rootElement);
  // Wrap App with BrowserRouter here
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
