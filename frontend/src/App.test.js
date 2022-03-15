import { render, screen } from "@testing-library/react";
import App from "./App";
import {BrowserRouter} from 'react-router-dom'

import { AuthContext } from './components/Authentication/FirebaseAuth/FirebaseAuth';

test("renders learn react link", () => {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={{
        currentUser: {
          user: 'john@email.com',
        },
        logout: () => {},
      }}>
        <App />
      </AuthContext.Provider>
    </BrowserRouter>);

  const linkElement = screen.getByText(/CoviCare/i);
  expect(linkElement).toBeInTheDocument();
});
