import { Route, Routes } from "react-router-dom"
import LoginNegocio from "../pages/loginRestaurante"
import LoginCliente from "../pages/loginCliente"
import Pago from "../pages/pago"
import Menu from "../pages/menu"
import Opciones from "../pages/opciones"
import AccesoDenegado from "../pages/accesoDenegado"
import MainMenu from "../pages/HomePage"
import PedidosCliente from "../pages/pedidosCliente"
import CambioContra from '../components/PasswordResetForm'
import Empresas from "../components/Empresas/Empresas"
import SucursalCards from "../pages/SucursalCards"


const AppRoutes: React.FC = () => {
  return (
    <Routes>

      <Route path="/selec-sucursal" element={<SucursalCards />}>
      </Route>

      <Route path="/panel" element={<Empresas />}>
      </Route>

      <Route path="/" element={<MainMenu />}>
      </Route>

      <Route path="/login-cliente" element={<LoginCliente />}>
      </Route>

      <Route path="/login-negocio" element={<LoginNegocio />}>
      </Route>

      <Route path="/menu/:tipoComida" element={<Menu />}>
      </Route>

      <Route path="/pago" element={<Pago />}>
      </Route>

      <Route path="/opciones" element={<Opciones />}>
      </Route>

      <Route path="/acceso-denegado" element={<AccesoDenegado />}>
      </Route>

      <Route path="/pedidos" element={<PedidosCliente />}>
      </Route>

      <Route path="/cambio-contra" element={<CambioContra />}>
      </Route>

    </Routes>
  )
}

export default AppRoutes