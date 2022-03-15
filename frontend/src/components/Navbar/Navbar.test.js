import {render, screen} from '@testing-library/react'
import {BrowserRouter} from 'react-router-dom'
import Navbar from './Navbar';
import {AuthContext} from '../Authentication/FirebaseAuth/FirebaseAuth';


describe('visual test of the component', () => {
  it('should display default null welcome message', () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          currentUser: {
            user: 'john@email.com',
          },
          logout: () => {},
        }}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>)

    expect(screen.getByText(/^Welcome/)).toHaveTextContent('Welcome');
  })

  it('should display value from AuthContext', () => {
    const providerProps = {
      currentUser: {
        user: {email: 'john@email.com'},
      },
      logout: () => {},
    }

    render(
      <BrowserRouter>
        <AuthContext.Provider value={providerProps}>
          <Navbar />
        </AuthContext.Provider>
      </BrowserRouter>)
    expect(screen.getByText(/^Welcome/)).toHaveTextContent('Welcome john@email.com');
  })
})
