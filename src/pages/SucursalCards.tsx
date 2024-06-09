import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { URL_API } from '../utils/global_variables/const';
import { SucursalService } from '../services/SucursalService';
import { Sucursal } from '../types/Restaurante/Sucursal';



const SucursalCards: React.FC = () => {

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sucursales.length === 0) fetchSucursales();
}, [sucursales]);

const fetchSucursales = async () => {
    SucursalService.getSucursales()
        .then(data => {
            setSucursales(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


  const handleSucursalClick = (id: number) => {
    if (id === 0) {
      window.location.href = '/';
    } else {
      window.location.href = `/${id}`;
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }


  return (
    <>
      <HeaderLogin></HeaderLogin>
      <div className="outer-container-sucursal-card">
        <div className="inner-container-sucursal-card">
          <h1 className="header-sucursal-card">&mdash; Selecciona una sucursal &mdash;</h1>
          <div className="sucursal-card-container">
            {sucursales.map((sucursal) => (
              <div
                key={sucursal.id}
                className="sucursal-card"
                onClick={() => handleSucursalClick(sucursal.id)}
              >
                <h2>{sucursal.nombre}</h2>
                {sucursal.domicilios.map((domicilio, index) => (
                    <p key={index}>{domicilio.calle}, {domicilio.numero}</p>
                  ))}
              </div>
            ))}
            <div className="sucursal-card" onClick={() => handleSucursalClick(0)}>
              <h2>Ingresar sin sucursal</h2>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default SucursalCards;
