import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import { Agentation } from "agentation";

import { AppRouter } from "./routes/AppRouter";
import "./styles/index.css";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        <AppRouter />
        <Agentation />
      </>
    </BrowserRouter>
  </React.StrictMode>
);
