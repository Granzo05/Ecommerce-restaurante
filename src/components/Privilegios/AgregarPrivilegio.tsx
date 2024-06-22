import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner'
import { PrivilegiosService } from '../../services/PrivilegiosService';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';
import { PrivilegiosSucursales } from '../../types/Restaurante/PrivilegiosSucursales';

interface AgregarPrivilegiosProps {
  onCloseModal: () => void;
}

const AgregarPrivilegios: React.FC<AgregarPrivilegiosProps> = ({ onCloseModal }) => {
  const [tarea, setTarea] = useState('');
  const [permisos, setPermisos] = useState<string[]>([]);
  const opcionesDisponibles = ["CREATE", "READ", "UPDATE", "DELETE", "ACTIVATE"];

  async function agregarPrivilegios() {
    const privilegio: PrivilegiosSucursales = new PrivilegiosSucursales(0, permisos, 0, tarea, 'NO');

    if (!tarea || !tarea.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)) {
      toast.info("Por favor, asigne el tarea");
      return;
    }

    privilegio.nombre = tarea;
    privilegio.borrado = 'NO';

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    privilegio.sucursales = sucursalesElegidas;

    toast.promise(PrivilegiosService.createPrivilegio(privilegio), {
      loading: 'Creando Privilegios...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return 'Privilegio creado correctamente';
      },
      error: (message) => {
        return 'No se pudo crear el privilegio';
      },
    });
  }

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

  const handlePermisoChange = (permiso: string, index: number) => {
    const nuevosPermisos = [...permisos];
    nuevosPermisos[index] = permiso;
    setPermisos(nuevosPermisos);
  };

  const añadirCampoPermiso = () => {
    setPermisos([...permisos, '']);
  };

  const quitarCampoPermiso = (index: number) => {
    const nuevosPermisos = permisos.filter((_, i) => i !== index);
    setPermisos(nuevosPermisos);
  };

  const getOpcionesDisponibles = (index: number) => {
    const opcionesSeleccionadas = permisos.filter((_, i) => i !== index);
    return opcionesDisponibles.filter(opcion => !opcionesSeleccionadas.includes(opcion));
  };

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
              <Toaster />
              <div className="inputBox">
                <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+" required={true} onChange={(e) => { setTarea(e.target.value) }} />
                <span>Nombre de la tarea</span>
                <div className="error-message">El nombre debe contener letras y espacios.</div>
              </div>
              <div>
                {permisos.map((permiso, index) => (
                  <div className="inputBox" key={index}>
                    <p className='cierre-ingrediente' onClick={() => quitarCampoPermiso(index)}>X</p>
                    <select
                      required={true}
                      value={permiso}
                      onChange={(e) => handlePermisoChange(e.target.value, index)}
                    >
                      <option value="">Seleccionar una opción</option>
                      {getOpcionesDisponibles(index).map(opcion => (
                        <option key={opcion} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <button onClick={añadirCampoPermiso}>Añadir permiso</button>
              </div>

              <div className="btns-pasos">
                {empresa && empresa?.id > 0 ? (
                  <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
                ) : (
                  <button className='btn-accion-completar' value="Agregar privilegio" id="agregarPrivilegios" onClick={agregarPrivilegios}>Agregar privilegio ✓</button>
                )}
              </div>
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
              <button value="Agregar privilegio" id="agregarPrivilegios" onClick={agregarPrivilegios}>Cargar </button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar privilegio &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div >
  );
}


export default AgregarPrivilegios
