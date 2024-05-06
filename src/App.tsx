import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [mostrarHeader, setMostrarHeader] = useState(true)

  useEffect(() => {
    const ruta = window.location.href.split('/').pop(); 
    if (ruta === 'login-cliente') {
      setMostrarHeader(false);
    }
  }, []);


  return (

    <Router>
      {mostrarHeader ? (
        <div>
          <Header />
          <AppRoutes />
        </div>
      ) : (
        <div>
          <AppRoutes />
          
          <Footer />
        </div>
      )}
    </Router>

  );
}

export default App;
