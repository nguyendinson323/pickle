import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

const SimpleHomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Federación Mexicana de Pickleball</h1>
      <p>Homepage is working! The routing system is functional.</p>
    </div>
  );
};

const SimpleLoginPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Login Page</h1>
      <p>Login functionality will be implemented here.</p>
    </div>
  );
};

const SimpleApp: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/login" element={<SimpleLoginPage />} />
          <Route path="*" element={<SimpleHomePage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default SimpleApp;