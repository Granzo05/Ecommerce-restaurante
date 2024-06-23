import { useEffect, useState } from "react";
import { Departamento } from "../types/Domicilio/Departamento";
import { DepartamentoService } from "../services/DepartamentoService";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'

const ModalFlotanteRecomendacionesDepartamentos: React.FC<{ onCloseModal: () => void, onSelectDepartamento: (departamento: Departamento) => void, inputProvincia: string }> = ({ onCloseModal, onSelectDepartamento, inputProvincia }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Departamento[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Departamento[]>([]);

  useEffect(() => {
    DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
      .then(async departamentos => {
        departamentos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setRecomendaciones(departamentos);
        setRecomendacionesFiltradas(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }, [inputProvincia]);

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
          <h2>&mdash; Filtrar departamentos &mdash;</h2>
          <div className="btns-filtrado">
            <button className="btn-agregar" onClick={() => onSelectDepartamento(new Departamento())}>Eliminar opción elegida</button>

          </div>
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
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectDepartamento(recomendacion)}>
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

export default ModalFlotanteRecomendacionesDepartamentos;
