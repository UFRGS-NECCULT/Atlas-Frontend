import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { register } from "./serviceWorkerRegistration";

ReactDOM.render(
  // <React.StrictMode>
  <>
    <App />
  </>,
  document.getElementById("root")
);

register();
