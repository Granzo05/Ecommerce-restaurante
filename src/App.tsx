import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import './styles/articulosVenta.css'
import './styles/categorias.css'
import './styles/empleados.css'
import './styles/footer.css'
import './styles/header.css'
import './styles/headerLogin.css'
import './styles/homePage-header-footer.css'
import './styles/ingredientes.css'
import './styles/inputLabel.css'
import './styles/login.css'
import './styles/loginRestaurante.css'
import './styles/mainMenu.css'
import './styles/menuPorTipo.css'
import './styles/modalCrud.css'
import './styles/modalFlotante.css'
import './styles/notFound.css'
import './styles/opcionesCliente.css'
import './styles/opcionesRestaurante.css'
import './styles/pago.css'
import './styles/passwordResetForm.css'
import './styles/pedidos.css'
import './styles/perfil.css'
import './styles/preferencias.css'
import './styles/reportes.css'
import './styles/spinnerLoader.css'
import './styles/stock.css'
import './styles/stock.css'
import './styles/sucursales.css'

function App() {

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
