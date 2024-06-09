import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { ArticuloMenu } from "../types/Productos/ArticuloMenu";
import { MenuService } from "../services/MenuService";

const ModalFlotanteRecomendacionesArticuloMenu: React.FC<{ onCloseModal: () => void, onSelectArticuloMenu: (articulo: ArticuloMenu) => void, datosOmitidos: string[] | string }> = ({ onCloseModal, onSelectArticuloMenu, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<ArticuloMenu[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<ArticuloMenu[]>([]);

  useEffect(() => {
    MenuService.getMenus()
      .then(async articulos => {
        if (datosOmitidos?.length > 0) {
          const articulosFiltrados = articulos.filter(articulo =>
            !datosOmitidos.includes(articulo.nombre)
          );

          setRecomendaciones(articulosFiltrados);
          setRecomendacionesFiltradas(articulosFiltrados);
        } else {
          setRecomendaciones(articulos);
          setRecomendacionesFiltradas(articulos);
        }
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
          <h2>&mdash; Filtrar menús &mdash;</h2>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectArticuloMenu(recomendacion)}>
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

export default ModalFlotanteRecomendacionesArticuloMenu;
