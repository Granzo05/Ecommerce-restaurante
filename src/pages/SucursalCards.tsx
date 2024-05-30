import React, { useEffect } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

const sucursales: Sucursal[] = [
  { id: 1, nombre: 'Sucursal 1', direccion: 'Dirección 1' },
  { id: 2, nombre: 'Sucursal 2', direccion: 'Dirección 2' },
  { id: 3, nombre: 'Sucursal 3', direccion: 'Dirección 3' },
  // Agrega más sucursales según sea necesario
];

const SucursalCards: React.FC = () => {
  const handleSucursalClick = (id: number) => {
    if (id === 0) {
      console.log('Ingresar sin seleccionar una sucursal específica');
    } else {
      console.log(`Sucursal seleccionada: ${id}`);
    }
    // Aquí puedes redirigir a otra página, hacer una llamada a una API, etc.
  };

  useEffect(() => {
    document.title = 'EBS - Seleccionar sucursal';
  }, []);

  return (
    <>
    <HeaderLogin></HeaderLogin>
    <div className="outer-container-sucursal-card">
      <div className="inner-container-sucursal-card">
        <h1 className="header-sucursal-card">&mdash; Selecciona una sucursal &mdash;</h1>
        <div className="sucursal-card-container">
          {sucursales.map((sucursal) => (
            <div key={sucursal.id} className="sucursal-card" onClick={() => window.location.href = '/${id}'}>
              <h2>{sucursal.nombre}</h2>
              <p>{sucursal.direccion}</p>
            </div>
          ))}
          <div className="sucursal-card" onClick={() => handleSucursalClick(0)}>
            <h2 onClick={() => window.location.href = '/'}>INGRESAR SIN SELECCIONAR UNA SUCURSAL ESPECÍFICA</h2>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default SucursalCards;
