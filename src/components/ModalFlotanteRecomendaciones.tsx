import { useEffect, useState } from "react";
import { IngredienteService } from "../services/IngredienteService";
import { Ingrediente } from "../types/Ingredientes/Ingrediente";
import { Localidad } from "../types/Domicilio/Localidad";
import { Departamento } from "../types/Domicilio/Departamento";
import { Provincia } from "../types/Domicilio/Provincia";
import { ProvinciaService } from "../services/ProvinciaService";
import { LocalidadService } from "../services/LocalidadService";
import { DepartamentoService } from "../services/DepartamentoService";

const ModalFlotanteRecomendaciones: React.FC<{ onCloseModal: () => void, onSelectProduct: (product: string) => void, elementoBuscado: string, datoNecesario: number }> = ({ onCloseModal, onSelectProduct, elementoBuscado, datoNecesario }) => {
  const handleModalClose = () => {
    onCloseModal();
  };

  const [recomendaciones, setRecomendaciones] = useState<Ingrediente[] | Localidad[] | Departamento[] | Provincia[]>([]);

  useEffect(() => {
    if (elementoBuscado === 'INGREDIENTES') {
      IngredienteService.getIngredientes()
        .then(data => {
          setRecomendaciones(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (elementoBuscado === 'PROVINCIAS') {
      ProvinciaService.getProvincias()
        .then(data => {
          setRecomendaciones(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else if (elementoBuscado === 'DEPARTAMENTOS') {
      DepartamentoService.getDepartamentosByProvinciaId(datoNecesario)
        .then(async departamentos => {
          setRecomendaciones(departamentos);
        })
        .catch(error => {
          console.error('Error:', error);
        })
    } else if (elementoBuscado === 'LOCALIDADES') {
      LocalidadService.getLocalidadesByDepartamentoId(datoNecesario)
        .then(async localidades => {
          setRecomendaciones(localidades);
        })
        .catch(error => {
          console.error('Error:', error);
        })
    }
  }, []);

  return (
    <div>
      <div className="modal-overlay" onClick={handleModalClose}>
        <div className="modal-flotante-content" onClick={(e) => e.stopPropagation()}>
          {recomendaciones.map(recomendacion => (
            <li key={recomendacion.id} onClick={() => {             
              onSelectProduct(recomendacion.nombre)
              handleModalClose();
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
