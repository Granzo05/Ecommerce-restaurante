import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Medida } from "../types/Ingredientes/Medida";
import { MedidaService } from "../services/MedidaService";
import AgregarMedida from "../components/Medidas/AgregarMedida";
import ModalCrud from "../components/ModalCrud";

const ModalFlotanteRecomendacionesMedidas: React.FC<{ onCloseModal: () => void, onSelectMedida: (medida: Medida) => void, datosOmitidos: string }> = ({ onCloseModal, onSelectMedida, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const handleModalCargarMedidaClose = () => {
    setShowAgregarMedidaModal(false);
  }

  const [recomendaciones, setRecomendaciones] = useState<Medida[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Medida[]>([]);

  useEffect(() => {
    MedidaService.getMedidas()
      .then(async medidas => {
        const medidasFiltradas = medidas.filter(articulo =>
          !datosOmitidos.includes(articulo.nombre)
        );

        setRecomendaciones(medidasFiltradas);
        setRecomendacionesFiltradas(medidasFiltradas);
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

  const [showAgregarMedidaModal, setShowAgregarMedidaModal] = useState<boolean>(false);



  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar unidades de medidas &mdash;</h2>
          <div className="btns-stock">

            <button onClick={() => setShowAgregarMedidaModal(true)}>Añadir unidad de medida</button>
          </div>
          <hr />
          <ModalCrud isOpen={showAgregarMedidaModal} onClose={handleModalCargarMedidaClose}>
            <AgregarMedida />
          </ModalCrud>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectMedida(recomendacion)}>
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

export default ModalFlotanteRecomendacionesMedidas;
