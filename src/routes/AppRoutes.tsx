import { Route, Routes } from "react-router-dom"
import LoginNegocio from "../pages/loginCliente"
import LoginCliente from "../pages/loginCliente"
import Pago from "../pages/pago"
import Menu from "../pages/menu"
import Opciones from "../pages/opciones"
import AccesoDenegado from "../pages/accesoDenegado"
import MainMenu from "../pages/HomePage"


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

        <Route path="/pago" element={<Pago/>}>
        </Route>

        <Route path="/stock" element={<Opciones/>}>
        </Route>

        <Route path="/acceso-denegado" element={<AccesoDenegado/>}>
        </Route>

    </Routes>
  )
}

export default AppRoutes