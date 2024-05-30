import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import HeaderLogin from './components/headerLogin';
import HeaderHomePage from './components/headerHomePage';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
