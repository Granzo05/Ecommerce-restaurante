import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import ModalCrud from "../components/ModalCrud";
import { ArticuloVentaService } from "../services/ArticuloVentaService";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";
import AgregarArticuloVenta from "../components/ArticulosVenta/AgregarArticulo";

const ModalFlotanteRecomendacionesArticulosSinStock: React.FC<{ onCloseModal: () => void, onSelectArticulo: (articulo: ArticuloVenta) => void, datosOmitidos: string[] | string }> = ({ onCloseModal, onSelectArticulo, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<ArticuloVenta[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<ArticuloVenta[]>([]);

  useEffect(() => {
    buscarIngredientes();
  }, []);

  async function buscarIngredientes() {
    ArticuloVentaService.getArticulosVacios()
      .then(async articulos => {
        if (datosOmitidos?.length > 0) {
          const articulosFiltrados = articulos.filter(articulo =>
            !datosOmitidos.includes(articulo.nombre)
          );

          articulosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(articulosFiltrados);
          setRecomendacionesFiltradas(articulosFiltrados);
        } else {
          articulos.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(articulos);
          setRecomendacionesFiltradas(articulos);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  function filtrarRecomendaciones(filtro: string) {
    let recomendacionesFiltradas = recomendaciones;

    if (filtro.length > 0) {
      recomendacionesFiltradas = recomendaciones.filter(recomendacion =>
        recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
      recomendacionesFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));

      setRecomendacionesFiltradas(recomendacionesFiltradas);
    } else {
      recomendaciones.sort((a, b) => a.nombre.localeCompare(b.nombre));

      setRecomendacionesFiltradas(recomendaciones);
    }
  }

  const [showAgregarModal, setShowAgregarModal] = useState(false);

  const handleAgregarIngrediente = () => {
    setShowAgregarModal(true);
  };

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ModalCrud isOpen={showAgregarModal} onClose={buscarIngredientes}>
            <AgregarArticuloVenta onCloseModal={handleModalClose} />
          </ModalCrud>
          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar artículo</button>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectArticulo(recomendacion)}>
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

export default ModalFlotanteRecomendacionesArticulosSinStock;
