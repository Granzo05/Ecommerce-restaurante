import { Route, Routes } from "react-router-dom"
import LoginNegocio from "../pages/loginCliente"
import LoginCliente from "../pages/loginCliente"
import Pago from "../pages/pago"
import Menu from "../pages/menu"
import AccesoDenegado from "../pages/accesoDenegado"
import MainMenu from "../pages/HomePage"
import PedidosCliente from "../pages/pedidosCliente"
import Opciones from "../pages/opciones"


const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<MainMenu/>}>
        </Route>
        
        <Route path="/login-cliente" element={<LoginCliente/>}>
        </Route>

        <Route path="/login-negocio" element={<LoginNegocio/>}>
        </Route>

        <Route path="/menu/:tipoComida" element={<Menu/>}>
        </Route>
        
        <Route path="/pedidos/cliente/{id}" element={<PedidosCliente/>}>
        </Route>

        <Route path="/pago" element={<Pago/>}>
        </Route>

        <Route path="/opciones" element={<Opciones/>}>
        </Route>

        <Route path="/acceso-denegado" element={<AccesoDenegado/>}>
        </Route>

    </Routes>
  )
}

export default AppRoutes