import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import MainMenu from "../pages/HomePage";
import SpinnerSuspense from "../hooks/SpinnerSuspense";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { RutaPrivadaEmpresa } from "../hooks/RutaPrivadaEmpresa";
import { RutaPrivadaCliente } from "../hooks/RutaPrivadaCliente";
import { RutaPrivadaEmpleado } from "../hooks/RutaPrivadaEmpleado";
import { RutaPrivadaLogin } from "../hooks/RutaPrivadaLogin";
const Opciones = lazy(() => import('../pages/opciones'));
const NotFound = lazy(() => import('../pages/notFound'));
const OpcionesCliente = lazy(() => import('../pages/opcionesCliente'));
const LoginNegocio = lazy(() => import('../pages/loginRestaurante'));
const LoginCliente = lazy(() => import('../pages/loginCliente'));
const Pago = lazy(() => import('../pages/pago'));
const PedidosPendientes = lazy(() => import('../components/Cliente/PedidosPendientes'));
const PedidosRealizados = lazy(() => import('../components/Cliente/PedidosRealizados'));
const Menu = lazy(() => import('../pages/menu'));
const Empresas = lazy(() => import('../components/Empresas/Empresas'));
const SucursalCards = lazy(() => import('../pages/SucursalCards'));
const Preferencias = lazy(() => import('../components/Preferencias'));
const ProductosBuscados = lazy(() => import('../pages/menuBusqueda'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<SpinnerSuspense />}>
      <GoogleOAuthProvider clientId="285186085169-1gsak2212rblu7i4hmiiaa3j8aodmi3r.apps.googleusercontent.com">
        <Routes>

          <Route path="/sucursales" element={<SucursalCards />} />

          <Route path="/" element={<SucursalCards />} />

          <Route path="/:id" element={<MainMenu />} />

          <Route path="/login-cliente" element={<LoginCliente />} />

          <Route path="/login-negocio" element={
            <RutaPrivadaLogin>
              <LoginNegocio />
            </RutaPrivadaLogin>}>
          </Route>

          <Route path="/:id/:categoria" element={<Menu />} />

          <Route path="/:id/busqueda/:nombre" element={<ProductosBuscados />} />

          <Route path="/cliente" element={<OpcionesCliente />}>
            <Route path="pedidos-pendientes" element={<PedidosPendientes />} />
            <Route path="pedidos-realizados" element={<PedidosRealizados />} />
            <Route path="preferencias" element={<Preferencias />} />
          </Route>

          <Route path="*" element={<NotFound />} />

          <Route path="/cliente/:opcionElegida" element={<OpcionesCliente />}></Route>

          <Route path="/:id/pago" element={
            <RutaPrivadaCliente>
              <Pago />
            </RutaPrivadaCliente>}>
          </Route>

          <Route path="/panel" element={
            <RutaPrivadaEmpresa>
              <Empresas />
            </RutaPrivadaEmpresa>}>
          </Route>

          <Route path=":id/empresa" element={
            <RutaPrivadaEmpresa>
              <Opciones />
            </RutaPrivadaEmpresa>}>
          </Route>

          <Route path="/:id/opciones" element={
            <RutaPrivadaEmpleado>
              <Opciones />
            </RutaPrivadaEmpleado>}>
          </Route>

          <Route path="/:id/opciones/:opcionElegida" element={
            <RutaPrivadaEmpleado>
              <Opciones />
            </RutaPrivadaEmpleado>}>
          </Route>

        </Routes>
      </GoogleOAuthProvider>

    </Suspense>
  )
}

export default AppRoutes