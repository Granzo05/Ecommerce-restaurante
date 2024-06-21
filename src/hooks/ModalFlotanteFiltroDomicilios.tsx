import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Domicilio } from "../types/Domicilio/Domicilio";
import { Cliente } from "../types/Cliente/Cliente";
import { ClienteService } from "../services/ClienteService";

const ModalFlotanteRecomendacionesDomicilios: React.FC<{ onCloseModal: () => void, onSelectedDomicilio: (domicilio: Domicilio) => void, cliente: Cliente | null, datosOmitidos: string[] | string }> = ({ onCloseModal, onSelectedDomicilio, cliente, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Domicilio[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Domicilio[]>([]);

  useEffect(() => {
    if (cliente) {
      ClienteService.getDomicilios(cliente.id)
        .then(async domicilios => {
          if (datosOmitidos?.length > 0) {
            const domiciliosFiltrados = domicilios.filter(articulo =>
              !datosOmitidos.includes(articulo.calle)
            );

            domiciliosFiltrados.sort((a, b) => a.calle.localeCompare(b.calle));
            setRecomendaciones(domiciliosFiltrados);
            setRecomendacionesFiltradas(domiciliosFiltrados);
          } else {
            domicilios.sort((a, b) => a.calle.localeCompare(b.calle));
            setRecomendaciones(domicilios);
            setRecomendacionesFiltradas(domicilios);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        })
    }

  }, [cliente]);

  function filtrarRecomendaciones(filtro: string) {
    let recomendacionesFiltradas = recomendaciones;

    if (filtro.length > 0) {
      recomendacionesFiltradas = recomendaciones.filter(recomendacion =>
        recomendacion.calle.toLowerCase().includes(filtro.toLowerCase())
      );
      recomendacionesFiltradas.sort((a, b) => a.calle.localeCompare(b.calle));

      setRecomendacionesFiltradas(recomendacionesFiltradas);
    } else {
      recomendaciones.sort((a, b) => a.calle.localeCompare(b.calle));

      setRecomendacionesFiltradas(recomendaciones);
    }
  }

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar domicilios &mdash;</h2>
          <div className="inputBox">
            <input type="text" required onChange={(e) => filtrarRecomendaciones(e.target.value)} />
            <span>Filtrar por nombre de la calle...</span>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectedDomicilio(recomendacion)}>
                    <td>{recomendacion.calle} {recomendacion.numero} - {recomendacion.localidad.nombre}, {recomendacion.localidad.departamento.nombre}, {recomendacion.localidad.departamento.provincia.nombre}</td>
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

export default ModalFlotanteRecomendacionesDomicilios;
