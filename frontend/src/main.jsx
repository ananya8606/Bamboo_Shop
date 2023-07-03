import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import store from './store';
import './index.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback="...loading">
          <App />
      </Suspense>
    </Provider>
  </React.StrictMode>
);







