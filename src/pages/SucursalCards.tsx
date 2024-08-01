import React, { useEffect, useState } from 'react';
import '../styles/sucursalCards.css';
import HeaderLogin from '../components/headerLogin';
import { SucursalService } from '../services/SucursalService';
import { Sucursal } from '../types/Restaurante/Sucursal';
import { getBaseUrl } from '../utils/global_variables/const';
import { Cliente } from '../types/Cliente/Cliente';
import InputComponent from '../components/InputFiltroComponent';
import ModalFlotanteRecomendacionesProvincias from '../hooks/ModalFlotanteFiltroProvincia';
import { ClienteService } from '../services/ClienteService';
import ModalFlotanteRecomendacionesDepartamentos from '../hooks/ModalFlotanteFiltroDepartamentos';
import { toast, Toaster } from 'sonner';

const SucursalCards: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  const [usuario] = useState<Cliente | null>(() => {
    const usuarioString = localStorage.getItem('usuario');
    return usuarioString ? (JSON.parse(usuarioString) as Cliente) : null;
  });


  useEffect(() => {
    fetchDomiciliosYSucursales();
  }, [usuario]);

  const fetchDomiciliosYSucursales = async () => {
    if (usuario) {
      try {
        const domicilios = await ClienteService.getDomicilios(usuario.id);
        if (domicilios.length > 0 && domicilios[0].localidad.nombre.length > 0) {
          fetchSucursalesProvincia(domicilios[0].localidad.departamento.provincia.nombre);
          setInputProvincia(domicilios[0].localidad.departamento.provincia.nombre);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const fetchSucursalesProvincia = async (provincia: string) => {
    try {
      const data = await SucursalService.getSucursalesByProvincia(provincia);
      if (data.length > 0) {
        setSucursales(data);
      } else {
        toast.info('No hay sucursales disponibles en la provincia elegida')
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    document.title = 'El Buen Sabor - Seleccionar sucursal';
    console.log(process.env.URL_API)
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

      const baseUrl = getBaseUrl();

      window.location.href = baseUrl;
    }
  }

  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [inputDepartamento, setInputDepartamento] = useState<string>('');
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);


  const handleModalClose = () => {
    setModalBusquedaDepartamento(false)
    setModalBusquedaProvincia(false)
  };

  function filtrarSucursalesDepartamento(filtro: string) {
    if (filtro.length > 0) {
      const filtradas = sucursales.filter(recomendacion =>
        recomendacion.domicilios[0].localidad.departamento.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
      console.log(sucursales)
      if (filtradas.length > 0) {
        setSucursales(filtradas);
      } else {
        toast.info('No hay sucursales disponibles en el departamento elegido')
      }
    } else {
      setSucursales(sucursales);
    }
  }

  return (
    <>
      <HeaderLogin />
      <div className="outer-container-sucursal-card">
        <Toaster />

        <div className="inner-container-sucursal-card">
          <h1 className="header-sucursal-card">&mdash; Selecciona una sucursal &mdash;</h1>
          <div className='filtros-cards' >
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Coloca tu provincia:</label>
            <InputComponent disabled={false} placeHolder='Filtrar por provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
            {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); fetchSucursalesProvincia(provincia.nombre); handleModalClose(); }} />}
          </div>
          <div className='filtros-cards' >
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Si ya colocaste tu provincia, podés filtrar por tu departamento</label>
            <InputComponent disabled={inputProvincia.length === 0} placeHolder='Filtrar por departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
            {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); filtrarSucursalesDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}
          </div>
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
