/**
 * Election Analytics Dashboard - Application Entry Point
 * Copyright (c) 2026 Nikhil Kumar Shah
 * All rights reserved. Unauthorized copying or distribution is prohibited.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);