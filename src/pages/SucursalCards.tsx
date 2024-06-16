import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { SucursalService } from '../services/SucursalService';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { useNavigate } from 'react-router-dom';
import { Empresa } from '../types/Restaurante/Empresa';
import { getBaseUrl } from '../utils/global_variables/const';

const SucursalCards: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (sucursales.length === 0) fetchSucursales();
  }, [sucursales]);

  const fetchSucursales = async () => {
    try {
      const data = await SucursalService.getSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    document.title = 'El Buen Sabor - Seleccionar sucursal';
  }, []);

  async function handleSucursalClick(sucursal: Sucursal) {
    localStorage.setItem('selectedBranchId', sucursal.id.toString());
    localStorage.setItem('selectedBranchName', sucursal.nombre);
    localStorage.setItem('selectedBranchAddress', sucursal.domicilios[0]?.calle + ', ' + sucursal.domicilios[0]?.numero);
    localStorage.setItem('selectedBranchCity', sucursal.domicilios[0]?.localidad.nombre);

    // Seteamos el nuevo cambio de sucursal
    const usuarioString = localStorage.getItem('usuario');

    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      usuario.idSucursal = sucursal.id;

      localStorage.setItem('usuario', usuario);
    }

    if (window.location.href.includes('/sucursales#login')) {
      navigate('/login-cliente');
    } else if (sucursal.id === 0) {
      window.location.href = await getBaseUrl();
    }
  }

  return (
    <>
      <HeaderLogin />
      <div className="outer-container-sucursal-card">
        <div className="inner-container-sucursal-card">
          <h1 className="header-sucursal-card">&mdash; Selecciona una sucursal &mdash;</h1>
          <div className="sucursal-card-container">
            {sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="sucursal-card"
                onClick={() => handleSucursalClick(sucursal)}
              >
                <h2>{sucursal.nombre}</h2>
                {sucursal.domicilios.map((domicilio, index) => (
                  <div key={index}>
                    <p style={{ textAlign: 'left', textTransform: 'uppercase' }}><strong>DIRECCIÓN:</strong> {domicilio.calle}, {domicilio.numero}</p>
                    <p style={{ textAlign: 'left' }}><strong>LOCALIDAD:</strong> {domicilio.localidad.nombre}, {domicilio.localidad.departamento.nombre}, {domicilio.localidad.departamento.provincia.nombre}</p>
                    <p style={{ textAlign: 'left' }}><strong>TELÉFONO:</strong> {sucursal.telefono}</p>
                  </div>
                ))}
              </div>
            ))}
            <div className="sucursal-card" onClick={() => handleSucursalClick({
              id: 0, nombre: 'Sin sucursal', domicilios: [],
              contraseña: '',
              telefono: 0,
              email: '',
              privilegios: '',
              horarioApertura: '',
              horarioCierre: '',
              localidadesDisponiblesDelivery: [],
              promociones: [],
              articulosMenu: [],
              articulosVenta: [],
              empresa: new Empresa,
              categorias: [],
              imagenes: [],
              borrado: ''
            })}>
              <h2>Ingresar sin sucursal</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SucursalCards;
