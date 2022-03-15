import { Routes, Route } from "react-router-dom";

import "./components/Authentication/FirebaseAuth/FirebaseConfig";
import PrivateRoute from "./components/RouteHandler/PrivateRoute";
import routes from './routes';

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
