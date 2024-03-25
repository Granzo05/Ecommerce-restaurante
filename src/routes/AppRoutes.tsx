import { Route, Routes } from "react-router-dom"
import MainMenu from "../components/mainMenu"
import LoginCliente from "../components/loginCliente"
import LoginNegocio from "../components/loginNegocio"
import RestaurantesPorComida from "../components/restaurantePorTipo"
import Cocina from "../components/cocina"
import Pago from "../components/pago"
import Pedidos from "../components/pedidosRecibidosNegocio"
import Stock from "../components/stock"
import AccesoDenegado from "../components/accesoDenegado"

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

        
        <Route path="/pedidos" element={<Pedidos/>}>
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