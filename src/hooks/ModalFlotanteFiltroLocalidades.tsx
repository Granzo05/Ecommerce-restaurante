import { useEffect, useState } from "react";
import { Localidad } from "../types/Domicilio/Localidad";
import { LocalidadService } from "../services/LocalidadService";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'

const ModalFlotanteRecomendacionesLocalidades: React.FC<{ onCloseModal: () => void, onSelectLocalidad: (localidad: Localidad) => void, inputDepartamento: string, inputProvincia: string }> = ({ onCloseModal, onSelectLocalidad, inputDepartamento, inputProvincia }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Localidad[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Localidad[]>([]);

  useEffect(() => {
    LocalidadService.getLocalidadesByNombreDepartamentoAndProvincia(inputDepartamento, inputProvincia)
      .then(async localidades => {

        localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setRecomendaciones(localidades);
        setRecomendacionesFiltradas(localidades);

      })
      .catch(error => {
        console.error('Error:', error);
      })
  }, [inputDepartamento, inputProvincia]);

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

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar localidades &mdash;</h2>
          <div className="inputBox">
            <input type="text" required onChange={(e) => filtrarRecomendaciones(e.target.value)} />
            <span>Filtrar por nombre...</span>
          </div>
          <button onClick={() => onSelectLocalidad(new Localidad())}>BORRAR OPCIÓN ELEGIDA</button>
          <table className="tabla-recomendaciones">
            <thead>
              <tr>
                <th>NOMBRE</th>
              </tr>
            </thead>
            <tbody>
              {recomendacionesFiltradas && recomendacionesFiltradas.length > 0 ? (
                recomendacionesFiltradas.map(recomendacion => (
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectLocalidad(recomendacion)}>
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

export default ModalFlotanteRecomendacionesLocalidades;
