import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Categoria } from "../types/Ingredientes/Categoria";
import { CategoriaService } from "../services/CategoriaService";
import ModalCrud from "../components/ModalCrud";
import AgregarCategoria from "../components/Categorias/AgregarCategoria";

const ModalFlotanteRecomendacionesCategoria: React.FC<{ onCloseModal: () => void, onSelectCategoria: (categoria: Categoria) => void, datosOmitidos: string | undefined }> = ({ onCloseModal, onSelectCategoria, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Categoria[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Categoria[]>([]);

  useEffect(() => {
    buscarCategorias();
  }, []);

  async function buscarCategorias() {
    setShowAgregarModal(false);
    CategoriaService.getCategoriasNoBorradas()
      .then(async categorias => {
        if (datosOmitidos && datosOmitidos?.length > 0) {
          const categoriasFiltradas = categorias.filter(articulo =>
            !datosOmitidos.includes(articulo.nombre)
          );
          categoriasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(categoriasFiltradas);
          setRecomendacionesFiltradas(categoriasFiltradas);
        } else {
          categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(categorias);
          setRecomendacionesFiltradas(categorias);

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

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar categorías &mdash;</h2>
          <div className="btns-filtrado">

            <button className="btn-agregar" style={{ marginRight: '10px' }} onClick={() => onSelectCategoria(new Categoria())}>Eliminar opción elegida</button>
            <button className="btn-agregar" onClick={() => setShowAgregarModal(true)}>+ Agregar categoría en el inventario</button>
          </div>
          <ModalCrud isOpen={showAgregarModal} onClose={() => setShowAgregarModal(false)}>
            <AgregarCategoria onCloseModal={buscarCategorias} />
          </ModalCrud>

          <div style={{ marginBottom: '0px' }} className="inputBox">
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectCategoria(recomendacion)}>
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

export default ModalFlotanteRecomendacionesCategoria;
