import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import HeaderLogin from './components/headerLogin';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [mostrarFooter, setMostrarFooter] = useState(true);
  const [mostrarHeader, setMostrarHeader] = useState(true);
  const [mostrarHeaderLogin, setMostrarHeaderLogin] = useState(true);

  useEffect(() => {
    const ruta = window.location.href.split('/').pop(); 
    
    if (ruta === 'opciones' || ruta === 'login-negocio') {
      setMostrarFooter(false);
    } else {
      setMostrarFooter(true);
    }

    if (ruta === 'opciones' || ruta === 'login-negocio') {
      setMostrarHeader(false);
    } else {
      setMostrarHeader(true);
    }

    if (ruta === 'opciones') {
      setMostrarHeaderLogin(false);
    } else {
      setMostrarHeaderLogin(true);
    }
  }, []);

  return (
    <Router>
      {mostrarHeader ? <Header /> : mostrarHeaderLogin ? <HeaderLogin /> : null}
      <AppRoutes />
      {mostrarFooter && <Footer />}
    </Router>
  );
}

export default App;
