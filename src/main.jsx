import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import router from './router/index';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <HelmetProvider>
          <RouterProvider router={router} />
        </HelmetProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
