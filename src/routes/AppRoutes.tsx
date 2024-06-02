import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import MainMenu from "../pages/HomePage";
import Opciones from "../pages/opciones";
const LoginNegocio = lazy(() => import('../pages/loginRestaurante'));
const LoginCliente = lazy(() => import('../pages/loginCliente'));
const Pago = lazy(() => import('../pages/pago'));
const AccesoDenegado = lazy(() => import('../pages/accesoDenegado'));
const PedidosCliente = lazy(() => import('../pages/pedidosCliente'));
const CambioContra = lazy(() => import('../components/PasswordResetForm'));
const Menu = lazy(() => import('../pages/menu'));
const Empresas = lazy(() => import('../components/Empresas/Empresas'));
const SucursalCards = lazy(() => import('../pages/SucursalCards'));


const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>cargando...</div>}>
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
    </Suspense>
  )
}

export default AppRoutes