import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import MainMenu from "../pages/HomePage";
const Opciones = lazy(() => import('../pages/opciones'));
const OpcionesCliente = lazy(() => import('../pages/opcionesCliente'));
const LoginNegocio = lazy(() => import('../pages/loginRestaurante'));
const LoginCliente = lazy(() => import('../pages/loginCliente'));
const Pago = lazy(() => import('../pages/pago'));
const PedidosPendientes = lazy(() => import('../components/Cliente/PedidosPendientes'));
const PedidosRealizados = lazy(() => import('../components/Cliente/PedidosRealizados'));
const CambioContra = lazy(() => import('../components/PasswordResetForm'));
const Menu = lazy(() => import('../pages/menu'));
const Empresas = lazy(() => import('../components/Empresas/Empresas'));
const SucursalCards = lazy(() => import('../pages/SucursalCards'));
const Preferencias = lazy(() => import('../components/Preferencias'));


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

        <Route path="/${id}" element={<MainMenu />}>
        </Route>

        <Route path="/login-cliente" element={<LoginCliente />}>
        </Route>

        <Route path="/login-negocio" element={<LoginNegocio />}>
        </Route>

        <Route path="/menu/:categoria" element={<Menu />}>
        </Route>

        <Route path="/pago" element={<Pago />}>
        </Route>

        <Route path="/opciones" element={<Opciones />}>
        </Route>

        <Route path="/cliente" element={<OpcionesCliente />}>
        </Route>

        <Route path="/cliente/pedidos-pendientes" element={<PedidosPendientes />}>
        </Route>

        <Route path="/cliente/pedidos-realizados" element={<PedidosRealizados />}>
        </Route>

        <Route path="/cliente/preferencias" element={<Preferencias />}>
        </Route>

        <Route path="/cambio-contra" element={<CambioContra />}>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes