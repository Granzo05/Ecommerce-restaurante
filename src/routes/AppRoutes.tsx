import { Route, Routes } from "react-router-dom"
import LoginNegocio from "../pages/loginCliente"
import LoginCliente from "../pages/loginCliente"
import Cocina from "../pages/cocina"
import Pago from "../pages/pago"
import Stock from "../pages/stock"
import AccesoDenegado from "../pages/accesoDenegado"
import MainMenu from "../pages/homePage"
import RestaurantesPorComida from "../pages/menuPorTipo"
import PedidosCliente from "../pages/pedidosCliente"
import PedidosRestaurante from "../pages/pedidosRestaurante"


const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<MainMenu/>}>
        </Route>
        
        <Route path="/login-cliente" element={<LoginCliente/>}>
        </Route>

        <Route path="/login-negocio" element={<LoginNegocio/>}>
        </Route>

        <Route path="/menu/:tipoComida" element={<RestaurantesPorComida/>}>
        </Route>

        <Route path="/cocina" element={<Cocina/>}>
        </Route>

        
        <Route path="/pedidos/cliente/{id}" element={<PedidosCliente/>}>
        </Route>

        <Route path="/pedidos/resturant" element={<PedidosRestaurante/>}>
        </Route>

        <Route path="/pago" element={<Pago/>}>
        </Route>

        <Route path="/stock" element={<Stock/>}>
        </Route>

        <Route path="/acceso-denegado" element={<AccesoDenegado/>}>
        </Route>

    </Routes>
  )
}

export default AppRoutes