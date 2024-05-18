import { useEffect, useState } from "react";
import { IngredienteService } from "../services/IngredienteService";
import { Ingrediente } from "../types/Ingredientes/Ingrediente";
import { Localidad } from "../types/Domicilio/Localidad";
import { Departamento } from "../types/Domicilio/Departamento";
import { Provincia } from "../types/Domicilio/Provincia";
import { ProvinciaService } from "../services/ProvinciaService";
import { LocalidadService } from "../services/LocalidadService";
import { DepartamentoService } from "../services/DepartamentoService";
import { ArticuloVentaService } from "../services/ArticuloVentaService";
import { ArticuloVenta } from "../types/Productos/ArticuloVenta";
import CloseIcon from '@mui/icons-material/Close';
import '../styles/modals.css'
import SearchIcon from '@mui/icons-material/Search';
import '../styles/inputLabel.css'

const ModalFlotanteRecomendaciones: React.FC<{ onCloseModal: () => void, onSelectProduct: (product: string) => void, elementoBuscado: string, datoNecesario: string }> = ({ onCloseModal, onSelectProduct, elementoBuscado, datoNecesario }) => {
  const handleModalClose = () => {
    setRecomendaciones([])
    setRecomendacionesFiltradas([])
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Ingrediente[] | ArticuloVenta[] | Localidad[] | Departamento[] | Provincia[]>([]);
  const [recomendacionesFiltradas, setRecomendacionesFiltradas] = useState<Ingrediente[] | ArticuloVenta[] | Localidad[] | Departamento[] | Provincia[]>([]);

  useEffect(() => {
    if (elementoBuscado === 'INGREDIENTES') {
      IngredienteService.getIngredientes()
        .then(ingredientes => {
          setRecomendaciones(ingredientes);
          setRecomendacionesFiltradas(ingredientes);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (elementoBuscado === 'ARTICULOS') {
      ArticuloVentaService.getArticulos()
        .then(articulos => {
          setRecomendaciones(articulos);
          setRecomendacionesFiltradas(articulos);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (elementoBuscado === 'PROVINCIAS') {
      ProvinciaService.getProvincias()
        .then(provincias => {
          setRecomendaciones(provincias);
          setRecomendacionesFiltradas(provincias);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (elementoBuscado === 'DEPARTAMENTOS' && datoNecesario.length > 0) {
      DepartamentoService.getDepartamentosByNombreProvincia(datoNecesario)
        .then(async departamentos => {
          setRecomendaciones(departamentos);
          setRecomendacionesFiltradas(departamentos);
        })
        .catch(error => {
          console.error('Error:', error);
        })
    } else if (elementoBuscado === 'LOCALIDADES' && datoNecesario.length > 0) {
      LocalidadService.getLocalidadesByNombreDepartamento(datoNecesario)
        .then(async localidades => {
          setRecomendaciones(localidades);
          setRecomendacionesFiltradas(localidades);
        })
        .catch(error => {
          console.error('Error:', error);
        })
    }
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
      <div className="modal-overlay" onClick={handleModalClose}>

        <div className="modal-flotante-recom-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={handleModalClose}><CloseIcon /></button>
          <h2>Filtrar ingredientes</h2>
          <div className="inputBox">
            <SearchIcon className="search-icono" />
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
              {recomendacionesFiltradas.map(recomendacion => (
                <tr key={recomendacion.id} style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(recomendacion.nombre)}>
                  <td>{recomendacion.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModalFlotanteRecomendaciones;
