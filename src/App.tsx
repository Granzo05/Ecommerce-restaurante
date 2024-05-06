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
    console.log(ruta)
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
          <Footer />
        </div>
      ) : (
        <div>
          <AppRoutes />
        </div>
      )}
    </Router>

  );
}

export default App;
