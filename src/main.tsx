import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from "react-router-dom";
import './samples/node-api'
import 'antd/dist/antd.css';
import 'styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>
)

postMessage({ payload: 'removeLoading' }, '*')
// window.removeLoading();