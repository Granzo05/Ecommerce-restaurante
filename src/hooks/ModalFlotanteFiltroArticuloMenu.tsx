import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { ArticuloMenu } from "../types/Productos/ArticuloMenu";
import { MenuService } from "../services/MenuService";
import ModalCrud from "../components/ModalCrud";
import AgregarMenu from "../components/Menus/AgregarMenu";

const ModalFlotanteRecomendacionesArticuloMenu: React.FC<{ onCloseModal: () => void, onSelectArticuloMenu: (articulo: ArticuloMenu) => void, datosOmitidos: string[] | string | undefined }> = ({ onCloseModal, onSelectArticuloMenu, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<ArticuloMenu[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<ArticuloMenu[]>([]);

  useEffect(() => {
    buscarMenus();
  }, []);

  async function buscarMenus() {
    setShowAgregarModal(false);
    MenuService.getMenus()
      .then(async articulos => {
        if (datosOmitidos && datosOmitidos?.length > 0) {
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
      });
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

  const handleAgregar = () => {
    setShowAgregarModal(true);
  };

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar menús &mdash;</h2>
          <div className="btns-filtrado">
            <button className="btn-agregar" onClick={() => onSelectArticuloMenu(new ArticuloMenu())}>BORRAR OPCIÓN ELEGIDA</button>
            <button className="btn-agregar" onClick={() => handleAgregar()}> + Agregar menú</button>
          </div>
          <ModalCrud isOpen={showAgregarModal} onClose={() => setShowAgregarModal(false)}>
            <AgregarMenu onCloseModal={buscarMenus} />
          </ModalCrud>
          <div className="inputBox" style={{ marginBottom: '0px' }}>
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
