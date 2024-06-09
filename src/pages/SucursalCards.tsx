import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { URL_API } from '../utils/global_variables/const';
import { SucursalService } from '../services/SucursalService';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { useNavigate } from 'react-router-dom';



const SucursalCards: React.FC = () => {

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

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

useEffect(() => {
  document.title = 'El Buen Sabor - Seleccionar sucursal';
}, []);


  const handleSucursalClick = (id: number) => {
    if (window.location.href.includes('/selec-sucursal#login')) {
      navigate('/login-cliente');
    } else if (id === 0) {
      window.location.href = '/';
    } else {
      window.location.href = `/#sucursal-${id}`;
    }
    
  };



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
                  <>
                  
                  <p style={{textAlign: 'left', textTransform: 'uppercase'}} key={index}><strong>DIRECCIÓN:</strong> {domicilio.calle}, {domicilio.numero}</p>
                  <p style={{textAlign: 'left'}} key={index}><strong>LOCALIDAD:</strong> {domicilio.localidad.nombre}, {domicilio.localidad.departamento.nombre}, {domicilio.localidad.departamento.provincia.nombre}</p>
                  <p style={{textAlign: 'left'}} key={index}><strong>TELÉFONO:</strong> {sucursal.telefono}</p>
                  </>
                  
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
