import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { ArticuloVentaService } from "../services/ArticuloVentaService";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";

const ModalFlotanteRecomendacionesArticulo: React.FC<{ onCloseModal: () => void, onSelectArticuloVenta: (articulo: ArticuloVenta) => void }> = ({ onCloseModal, onSelectArticuloVenta }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<ArticuloVenta[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<ArticuloVenta[]>([]);

  useEffect(() => {
    ArticuloVentaService.getArticulos()
      .then(async articulos => {
        setRecomendaciones(articulos);
        setRecomendacionesFiltradas(articulos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
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
          <h2>&mdash; Filtrar artículos &mdash;</h2>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectArticuloVenta(recomendacion)}>
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

export default ModalFlotanteRecomendacionesArticulo;
