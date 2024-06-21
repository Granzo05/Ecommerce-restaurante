import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modalFlotante.css'
import '../styles/modalCrud.css'
import { Sucursal } from "../types/Restaurante/Sucursal";
import { SucursalService } from "../services/SucursalService";

const ModalFlotanteRecomendacionesSucursales: React.FC<{ onCloseModal: () => void, onSelectSucursal: (sucursal: Sucursal) => void, datosOmitidos: string }> = ({ onCloseModal, onSelectSucursal, datosOmitidos }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Sucursal[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Sucursal[]>([]);

  useEffect(() => {
    SucursalService.getSucursales()
      .then(async sucursales => {
        if (datosOmitidos?.length > 0) {
          const sucursalesFiltrados = sucursales.filter(articulo =>
            !datosOmitidos.includes(articulo.nombre)
          );
          sucursalesFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(sucursalesFiltrados);
          setRecomendacionesFiltradas(sucursalesFiltrados);
        } else {
          sucursales.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setRecomendaciones(sucursales);
          setRecomendacionesFiltradas(sucursales);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }, []);

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

        <div className="modal-flotante-content" onClick={(e) => e.stopPropagation()}>

          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>FILTRAR SUCURSALES</h2>
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
                recomendacionesFiltradas.map((recomendacion, index) => (
                  <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectSucursal(recomendacion)}>
                    <td>{recomendacion.id} - {recomendacion.domicilios[index].localidad.departamento.nombre}, {recomendacion.domicilios[index].localidad.departamento.provincia.nombre}</td>
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

export default ModalFlotanteRecomendacionesSucursales;
