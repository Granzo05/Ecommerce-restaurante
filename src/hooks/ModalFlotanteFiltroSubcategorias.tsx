import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Subcategoria } from "../types/Ingredientes/Subcategoria";
import { Categoria } from "../types/Ingredientes/Categoria";
import { SubcategoriaService } from "../services/SubcategoriaService";
import ModalCrud from "../components/ModalCrud";
import AgregarSubcategoria from "../components/Subcategorias/AgregarSubcategoria";

const ModalFlotanteRecomendacionesSubcategoria: React.FC<{ onCloseModal: () => void, onSelectSubcategoria: (subcategoria: Subcategoria) => void, categoria: Categoria, datosOmitidos: string }> = ({ onCloseModal, onSelectSubcategoria, categoria, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const handleModalAddSubClose = () => {
    setShowAgregarSubcategoriaModal(false)
  };

  const [recomendaciones, setRecomendaciones] = useState<Subcategoria[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Subcategoria[]>([]);

  const [showAgregarSubcategoriaModal, setShowAgregarSubcategoriaModal] = useState(false);

  useEffect(() => {
    SubcategoriaService.getSubcategoriasByCategoriaId(categoria.id)
      .then(subcategorias => {
        const subcategoriasFiltrados = subcategorias.filter(articulo =>
          !datosOmitidos.includes(articulo.nombre)
        );

        setRecomendaciones(subcategoriasFiltrados);
        setRecomendacionesFiltradas(subcategoriasFiltrados);
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
          <h2>&mdash; Filtrar subcategorías &mdash;</h2>
          <div className="btns-stock">
            <button onClick={() => setShowAgregarSubcategoriaModal(true)}>Cargar nueva subcategoria</button>

          </div>
          <ModalCrud isOpen={showAgregarSubcategoriaModal} onClose={handleModalAddSubClose}>
            <AgregarSubcategoria />
          </ModalCrud>
          <hr />
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectSubcategoria(recomendacion)}>
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

export default ModalFlotanteRecomendacionesSubcategoria;
