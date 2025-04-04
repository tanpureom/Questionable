import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { NavContextProvider } from './contexts/NavContext.jsx'
import {AdminContextProvider} from './contexts/AdminContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <NavContextProvider>
        <AdminContextProvider>
          <App />
        </AdminContextProvider>
      </NavContextProvider>
    </AuthContextProvider>
  </StrictMode>,
)
