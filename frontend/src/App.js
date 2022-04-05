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
        <footer className={styles["footer-dashboard"]}>Made by: Anastassy Cap 40128337, Anas Peerzada 40040127, Anita Rao 40002701, Jamil Hirsh 21236962, Jananee Aruboribaran 401229224,
            Juhi Rao 40004588, Philippe Carrier 40153985, Thanh Ta 40085781, Zain Khan 40110693</footer>
    </div>
  );
}

export default App;
