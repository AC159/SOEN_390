import { Routes, Route } from "react-router-dom";

import "./components/Authentication/FirebaseAuth/FirebaseConfig";
import PrivateRoute from "./components/RouteHandler/PrivateRoute";
import routes from './routes';
import styles from "./features/Dashboard/Dashboard.module.css";
import React from "react";

function App() {
  return (
    <div className={styles["App"]}>
      <main>
        <Routes>
          {routes.map(route => {
            let inner;
            if (route.isPrivate) {
              inner = (
                <PrivateRoute requestedRoute={route.path}>
                  {route.element}
                </PrivateRoute>
              )
            } else {
              inner = route.element
            }
            return (
            <Route key={route.path} path={route.path} element={inner} />
          )})}
        </Routes>
      </main>
        <footer className={styles["footer-dashboard"]}>Made by: Jananee Aruboribaran 40129224 ....<b>need to add more</b></footer>
    </div>
  );
}

export default App;
