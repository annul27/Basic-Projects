import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Scientific from './components/scientific.jsx'
import BsCurrencyExchange from './components/CurrencyExchange.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/Scientific",
    element: <Scientific />
  },
  {
    path: "/CurrencyExchange",
    element: <BsCurrencyExchange />
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
