import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { URL_API } from '../utils/global_variables/const';

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}


const SucursalCards: React.FC = () => {

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await fetch(URL_API + 'sucursales/'+1);//ARREGLAR LA URL PARA QUE TRAIGA LAS SUCURSALES BIEN
        const data = await response.json();
        setSucursales(data);
      } catch (error) {
        console.error('Error fetching sucursales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSucursales();
    document.title = 'El Buen Sabor - Seleccionar sucursal';
  }, []);


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
                <p>{sucursal.direccion}</p>
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
