import { useEffect, useState } from 'react';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import { Toaster, toast } from 'sonner'
import { SubcategoriaService } from '../../services/SubcategoriaService';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';

interface EditarSubcategoriaProps {
  subcategoriaOriginal: Subcategoria;
  onCloseModal: () => void;
}

const EditarSubcategoria: React.FC<EditarSubcategoriaProps> = ({ subcategoriaOriginal, onCloseModal }) => {

  const [empresa] = useState<Empresa | null>(() => {
    const empresaString = localStorage.getItem('empresa');

    return empresaString ? (JSON.parse(empresaString) as Empresa) : null;
  });

  const [idsSucursalesElegidas, setIdsSucursalesElegidas] = useState<Set<number>>(new Set<number>());
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  useEffect(() => {
    SucursalService.getSucursales()
      .then(data => {
        setSucursales(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleSucursalesElegidas = (sucursalId: number) => {
    const updatedSelectedSucursales = new Set(idsSucursalesElegidas);
    if (updatedSelectedSucursales.has(sucursalId)) {
      updatedSelectedSucursales.delete(sucursalId);
    } else {
      updatedSelectedSucursales.add(sucursalId);
    }
    setIdsSucursalesElegidas(updatedSelectedSucursales);
  };

  const marcarSucursales = () => {
    setIdsSucursalesElegidas(new Set(sucursales.map(sucursal => sucursal.id)));
  };

  const desmarcarSucursales = () => {
    setIdsSucursalesElegidas(new Set());
  };

  const [nombre, setNombre] = useState(subcategoriaOriginal.nombre);

  function editarCategoria() {
    const subcategoria: Subcategoria = subcategoriaOriginal;

    if (!nombre || !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
      toast.info("Por favor, asigne un nombre válido");
      return;
    }

    subcategoria.nombre = nombre;
    toast.promise(SubcategoriaService.updateSubcategoria(subcategoria), {
      loading: 'Editando Subcategoria...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return "Subcategoría editada correctamente";
      },
      error: (message) => {
        return "No se pudo editar la subcategoría";
      },
    });
  }

  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="inputBox">
              <input type="text" required={true} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre de la subcategoria</span>
              <div className="error-message">El nombre debe contener letras y espacios.</div>

            </div>
            <div className='btns-pasos'>

              {empresa && empresa?.id > 0 ? (
                <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
              ) : (
                <button className='btn-accion-completar' onClick={editarCategoria}>Editar subcategoría ✓</button>
              )}
            </div >
          </>
        );
      case 2:
        return (
          <>
            <h4>Sucursales</h4>
            {sucursales && sucursales.map((sucursal, index) => (
              <div key={index}>
                <>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => desmarcarSucursales()}>Desmarcar todas</p>
                  <p className='cierre-ingrediente' onClick={() => marcarSucursales()}>Marcar todas</p>
                  <h4 style={{ fontSize: '18px' }}>Sucursal: {sucursal.nombre}</h4>
                  <input
                    type="checkbox"
                    value={sucursal.id}
                    checked={idsSucursalesElegidas.has(sucursal.id) || false}
                    onChange={() => handleSucursalesElegidas(sucursal.id)}
                  />
                  <label>{sucursal.nombre}</label>
                </>
              </div>
            ))}
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button onClick={editarCategoria}>Editar categoria</button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar ingrediente &mdash;</h2>
      <Toaster />
      {renderStep()}

    </div >
  );
}

export default EditarSubcategoria
