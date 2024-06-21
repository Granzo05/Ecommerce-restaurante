import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Ingrediente } from "../types/Ingredientes/Ingrediente";
import { IngredienteService } from "../services/IngredienteService";
import ModalCrud from "../components/ModalCrud";
import AgregarIngrediente from "../components/Ingrediente/AgregarIngrediente";

const ModalFlotanteRecomendacionesIngredientes: React.FC<{ onCloseModal: () => void, onSelectIngrediente: (ingrediente: Ingrediente) => void, datosOmitidos: string[] | string }> = ({ onCloseModal, onSelectIngrediente, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    setShowAgregarModalIngrediente(false)
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Ingrediente[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Ingrediente[]>([]);

  useEffect(() => {
    buscarIngredientes();
  }, []);

  async function buscarIngredientes() {
    IngredienteService.getIngredientes()
      .then(async ingredientes => {
        if (datosOmitidos?.length > 0) {
          const ingredientesFiltrados = ingredientes.filter(articulo =>
            !datosOmitidos.includes(articulo.nombre)
          );

          ingredientesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(ingredientesFiltrados);
          setRecomendacionesFiltradas(ingredientesFiltrados);
        } else {
          ingredientes.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(ingredientes);
          setRecomendacionesFiltradas(ingredientes);
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

  const [showAgregarModalIngrediente, setShowAgregarModalIngrediente] = useState(false);

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <ModalCrud isOpen={showAgregarModalIngrediente} onClose={() => buscarIngredientes}>
            <AgregarIngrediente onCloseModal={() => {setShowAgregarModalIngrediente(false); buscarIngredientes()}}/>
          </ModalCrud>
          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <button className="btn-agregar" onClick={() => setShowAgregarModalIngrediente(true)}> + Agregar ingrediente</button>
          <h2>&mdash; Filtrar ingredientes &mdash;</h2>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectIngrediente(recomendacion)}>
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

export default ModalFlotanteRecomendacionesIngredientes;
