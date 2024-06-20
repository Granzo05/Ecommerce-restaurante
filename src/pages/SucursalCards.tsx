import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { SucursalService } from '../services/SucursalService';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { getBaseUrl } from '../utils/global_variables/const';
import { Cliente } from '../types/Cliente/Cliente';

const SucursalCards: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

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
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario: Cliente = JSON.parse(usuarioString);
      usuario.idSucursal = sucursal.id;

      localStorage.setItem('usuario', JSON.stringify(usuario));

      window.location.href = getBaseUrl();
    } else {
      const usuario: Cliente = new Cliente();
      usuario.idSucursal = sucursal.id;

      localStorage.setItem('usuario', JSON.stringify(usuario));

      window.location.href = getBaseUrl();
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
            <div className="sucursal-card" onClick={() => handleSucursalClick(new Sucursal())}>
              <h2>Ingresar sin sucursal</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SucursalCards;
