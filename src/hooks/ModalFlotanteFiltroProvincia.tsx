import { useEffect, useState } from "react";
import { Provincia } from "../types/Domicilio/Provincia";
import { ProvinciaService } from "../services/ProvinciaService";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'

const ModalFlotanteRecomendacionesProvincias: React.FC<{ onCloseModal: () => void, onSelectProvincia: (provincia: Provincia) => void}> = ({ onCloseModal, onSelectProvincia }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Provincia[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Provincia[]>([]);

  useEffect(() => {
    ProvinciaService.getProvincias()
      .then(provincias => {
        setRecomendaciones(provincias);
        setRecomendacionesFiltradas(provincias);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  function filtrarRecomendaciones(filtro: string) {
    if (filtro.length > 0) {
      setRecomendacionesFiltradas(recomendaciones.filter(recomendacion => recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())));
    } else {
      setRecomendacionesFiltradas(recomendaciones);
    }
  }

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar provincias &mdash;</h2>
          <div className="inputBox">
            <input type="text" required onChange={(e) => filtrarRecomendaciones(e.target.value)} />
            <span>Filtrar por nombre...</span>
          </div>
          <table className="tabla-recomendaciones">
            <thead>
              <tr>
                <th>NOMBRE</th>
              </tr>
            </thead>
            <tbody>
              {recomendacionesFiltradas && recomendacionesFiltradas.length > 0 ? (
                recomendacionesFiltradas.map(recomendacion => (
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectProvincia(recomendacion)}>
                    <td>{recomendacion.nombre}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No se encontraron datos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModalFlotanteRecomendacionesProvincias;
