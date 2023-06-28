import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
console.log("Calling App in Index.tsx, may trigger GET")
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


