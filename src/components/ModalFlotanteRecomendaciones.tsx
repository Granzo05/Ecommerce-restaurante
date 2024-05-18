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
        <div className="modal-flotante-content" onClick={(e) => e.stopPropagation()}>
          <input type="text" onChange={(e) => filtrarRecomendaciones(e.target.value)} placeholder="Filtrar" />
          {recomendacionesFiltradas.map(recomendacion => (
            <li key={recomendacion.id} style={{ cursor: 'pointer', padding: '10px', marginBottom: '5px' }} onClick={() => {
              onSelectProduct(recomendacion.nombre)
            }
            }>{recomendacion.nombre}</li>
          ))}
          <button className="modal-close" onClick={handleModalClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalFlotanteRecomendaciones;
