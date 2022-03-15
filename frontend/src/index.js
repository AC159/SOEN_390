import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import FirebaseAuthProvider from "./components/Authentication/FirebaseAuth/FirebaseAuth";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAuthProvider>
        <App />
      </FirebaseAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
