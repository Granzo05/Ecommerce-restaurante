import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import MainMenu from "../pages/HomePage";
import NotFound from "../pages/notFound";
import SpinnerSuspense from "../hooks/SpinnerSuspense";
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
    <Suspense fallback={<SpinnerSuspense />}>
      <Routes>
        <Route path="/selec-sucursal" element={<SucursalCards />} />

        <Route path="/panel" element={<Empresas />} />

        <Route path="/" element={<MainMenu />} />

        <Route path="/:id" element={<MainMenu />} />

        <Route path="/login-cliente" element={<LoginCliente />} />

        <Route path="/login-negocio" element={<LoginNegocio />} />

        <Route path="/menu/:categoria" element={<Menu />} />

        <Route path="/pago" element={<Pago />} />

        <Route path="/opciones" element={<Opciones />} />

        <Route path="/cliente" element={<OpcionesCliente />}>
          <Route path="pedidos-pendientes" element={<PedidosPendientes />} />
          <Route path="pedidos-realizados" element={<PedidosRealizados />} />
          <Route path="preferencias" element={<Preferencias />} />
        </Route>

        <Route path="/cambio-contra" element={<CambioContra />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes