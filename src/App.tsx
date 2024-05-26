import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import HeaderLogin from './components/headerLogin';
import HeaderHomePage from './components/headerHomePage';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [mostrarFooter, setMostrarFooter] = useState(true);
  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [mostrarHeaderLogin, setMostrarHeaderLogin] = useState(true);
  const [mostrarHeaderHomePage, setMostrarHeaderHomePage] = useState(false);
  

  useEffect(() => {
    const ruta = window.location.href.split('/').pop(); 
    
    if (ruta === 'opciones' || ruta === 'login-negocio') {
      setMostrarFooter(false);
    } else {
      setMostrarFooter(true);
    }

    if (ruta === 'opciones' || ruta === 'login-negocio' || ruta === '') {
      setMostrarHeader(false);
    } else {
      setMostrarHeader(true);
    }

    if (ruta === 'opciones' || ruta === '') {
      setMostrarHeaderLogin(false);
    } else {
      setMostrarHeaderLogin(true);
    }

    if (ruta === '') {
      setMostrarHeaderHomePage(true);
    } else {
      setMostrarHeaderHomePage(false);
    }

  }, []);

  return (
    <Router>
      {mostrarHeader ? <Header /> : mostrarHeaderLogin ? <HeaderLogin /> : mostrarHeaderHomePage ? <HeaderHomePage /> : null}
      <AppRoutes />
      {mostrarFooter && <Footer />}
    </Router>
  );
}

export default App;
