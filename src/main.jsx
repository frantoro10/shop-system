import React from 'react'
import ReactDOM from 'react-dom/client'
import Modal from 'react-modal'
import App from './App.jsx'
import './index.css'

// Set app element for react-modal accessibility "aria-hidden="true""
Modal.setAppElement('#root')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
