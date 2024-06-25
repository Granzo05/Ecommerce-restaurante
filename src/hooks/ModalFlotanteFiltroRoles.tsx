import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import ModalCrud from "../components/ModalCrud";
import AgregarSubcategoria from "../components/Subcategorias/AgregarSubcategoria";
import { Roles } from "../types/Restaurante/Roles";
import { RolesService } from "../services/RolesService";
import AgregarRoles from "../components/Roles/AgregarRol";

const ModalFlotanteRecomendacionesRoles: React.FC<{ onCloseModal: () => void, onSelectRol: (rol: Roles) => void, datosOmitidos: string[] }> = ({ onSelectRol, onCloseModal, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Roles[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Roles[]>([]);

  const [showAgregarSubcategoriaModal, setShowAgregarSubcategoriaModal] = useState(false);

  useEffect(() => {
    buscarRoles();
  }, []);

  async function buscarRoles() {
    setShowAgregarSubcategoriaModal(false);
    RolesService.getRoles()
      .then(roles => {
        if (datosOmitidos?.length > 0) {
          const rolesFiltrados = roles.filter(rol =>
            !datosOmitidos.includes(rol.nombre)
          );
          rolesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(rolesFiltrados);
          setRecomendacionesFiltradas(rolesFiltrados);
        } else {
          roles.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(roles);
          setRecomendacionesFiltradas(roles);
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

  return (
    <div>
      <div className="modal-overlay">

        <div className="modal-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>&mdash; Filtrar roles &mdash;</h2>
          <div className="btns-filtrado">
            <button className="btn-agregar" onClick={() => setShowAgregarSubcategoriaModal(true)}>+ Agregar rol al inventario</button>
          </div>
          <ModalCrud isOpen={showAgregarSubcategoriaModal} onClose={() => setShowAgregarSubcategoriaModal(false)}>
            <AgregarRoles onCloseModal={buscarRoles} />
          </ModalCrud>
          <div style={{ marginBottom: '0px' }} className="inputBox">
            <input type="text" required onChange={(e) => filtrarRecomendaciones(e.target.value)} />
            <span>Filtrar por nombre...</span>
          </div>
          <button onClick={() => onSelectRol(new Roles())}>BORRAR OPCIÓN ELEGIDA</button>
          <table className="tabla-recomendaciones">
            <thead>
              <tr>
                <th>NOMBRE</th>
              </tr>
            </thead>
            <tbody>
              {recomendacionesFiltradas && recomendacionesFiltradas.length > 0 ? (
                recomendacionesFiltradas.map(recomendacion => (
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectRol(recomendacion)}>
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

export default ModalFlotanteRecomendacionesRoles;
