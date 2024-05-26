import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Subcategoria } from "../types/Ingredientes/Subcategoria";
import { Categoria } from "../types/Ingredientes/Categoria";
import { SubcategoriaService } from "../services/SubcategoriaService";

const ModalFlotanteRecomendacionesSubcategoria: React.FC<{ onCloseModal: () => void, onSelectSubcategoria: (subcategoria: Subcategoria) => void, categoria: Categoria }> = ({ onCloseModal, onSelectSubcategoria, categoria }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Subcategoria[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Subcategoria[]>([]);

  useEffect(() => {
    console.log(categoria.id)
    SubcategoriaService.getSubcategoriasByCategoriaId(categoria.id)
      .then(subcategorias => {
        setRecomendaciones(subcategorias);
        setRecomendacionesFiltradas(subcategorias);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, [categoria]);

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

        <div className="modal-flotante-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>FILTRAR SUBCATEGORIAS</h2>
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
