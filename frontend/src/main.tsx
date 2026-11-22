import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { GlobalAlertContainer } from './components/ui/GloabalAlertContainer'


ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <GlobalAlertContainer />
        <RouterProvider router={router} />
      </React.StrictMode>
)

