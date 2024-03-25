import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import MainMenu from './html/mainMenu';
import LoginCliente from './html/login';
import RestaurantesPorTipoComida from './html/restaurantePorTipo';
import PlantillaNegocios from "./html/plantillaNegocios";
import Pago from "./html/pago";
import LoginNegocio from "./html/loginNegocio";
import Cocina from "./html/cocina";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="main">
      <MainMenu />
    </div>,
  },
  {
    path: "/login-cliente",
    element: <div className="loginCliente">
      <LoginCliente />
    </div>,
  },
  {
    path: "/login-negocio",
    element: <div className="loginNegocio">
      <LoginNegocio />
    </div>,
  },
  {
    path: "/restaurantes/:tipoComida",
    element: <div className="restaurantesPorTipo">
      <RestaurantesPorTipoComida />
    </div>,
  },
  {
    path: "/restaurante/:id",
    element: <div className="restaurante">
      <PlantillaNegocios />
    </div>,
  },
  {
    path: "/restaurante/:id/cocina",
    element: <div className="cocina">
      <Cocina />
    </div>,
  },
  {
    path: "/pago",
    element: <div className="pago">
      <Pago />
    </div>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);