import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';  // <-- import your context

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>   {/* <-- wrap your App here */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
