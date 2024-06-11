import '../styles/footer.css';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png';
import React, { useEffect, useState } from 'react';
import { SucursalService } from '../services/SucursalService';
import { SucursalDTO } from '../types/Restaurante/SucursalDTO';
import { useNavigate } from 'react-router-dom';
import { Sucursal } from '../types/Restaurante/Sucursal';

const Footer = () => {
  const [sucursal, setSucursal] = useState<SucursalDTO | null>(null);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedBranchId = localStorage.getItem('selectedBranchId');
    if (selectedBranchId) {
      fetchSucursalById(parseInt(selectedBranchId));
    }

    if (sucursales.length === 0) {
      fetchSucursales();
    }
  }, [sucursales]);

  const fetchSucursales = async () => {
    try {
      const data = await SucursalService.getSucursales();
      setSucursales(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSucursalById = async (id: number) => {
    try {
      const sucursal = await SucursalService.getSucursalDTOById(id);
      if (sucursal) setSucursal(sucursal);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <footer id='contactos' className='footer'>
      <div className="footer-content container">
      {sucursal && (
          <>
          <div>
          <h3 style={{ color: '#FFFFFF' }}>{sucursal.nombre}</h3>
            <a className='selec-otra-sucur' style={{ textDecoration: 'underline', display: 'flex' }} onClick={() => window.location.href = '/selec-sucursal'}>SELECCIONAR OTRA SUCURSAL</a>
          
          </div>
          </>
        )}<div className="link">
          <ul>
            <li>
              <h3 style={{ fontSize: '19px', color: '#FFFFFF' }}>&mdash; Contacto &mdash;</h3>
              <ul>
                <li><a href="https://instagram.com" style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                <li><a href="https://twitter.com" style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">Twitter</a></li>
                <li><a href="https://whatsapp.com" style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              </ul>
            </li>
            <li>
              <h3 style={{ fontSize: '19px', color: '#FFFFFF' }}>&mdash; Ubicación &mdash;</h3>
              <ul>
                {sucursal ? (
                  <>
                    <li><a href={`https://maps.google.com?q=${sucursal.domicilio}`} style={{ textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">Google Maps</a></li>
                  </>
                ) : (
                  <>
                    <li><a>NO HA SELECCIONADO UNA SUCURSAL. </a><a href="/selec-sucursal" style={{ textDecoration: 'underline' }}>HÁGALO AHORA</a></li>
                  </>
                )}
              </ul>
            </li>
            <li>
              <h3 style={{ fontSize: '19px', color: '#FFFFFF' }}>&mdash; Horario &mdash;</h3>

              {sucursal ? (
                <>
                  <h4 style={{ textAlign: 'center' }}><a>DE LUNES A DOMINGO:</a></h4>
                  <ul>
                    <li><a>Horario de apertura: {sucursal.horarioApertura}</a></li>
                    <li><a>Horario de cierre: {sucursal.horarioCierre}</a></li>
                  </ul>
                </>
              ) : (
                <><ul>
                  <li><a>NO HA SELECCIONADO UNA SUCURSAL. </a><a href="/selec-sucursal" style={{ textDecoration: 'underline' }}>HÁGALO AHORA</a></li>
                </ul>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
