import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner'
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';
import { PrivilegiosService } from '../../services/PrivilegiosService';
import { PrivilegiosSucursales } from '../../types/Restaurante/PrivilegiosSucursales';

interface EditarMedidaProps {
  privilegioOriginal: PrivilegiosSucursales;
  onCloseModal: () => void;
}

const EditarPrivilegio: React.FC<EditarMedidaProps> = ({ privilegioOriginal, onCloseModal }) => {

  const [tarea, setTarea] = useState(privilegioOriginal.nombre);
  const [permisos, setPermisos] = useState<string[]>([]);


  useEffect(() => {
    setPermisos(privilegioOriginal.permisos)
  }, []);
  const opcionesDisponibles = ["CREATE", "READ", "UPDATE", "DELETE", "ACTIVATE"];

  function editarMedida() {
    privilegioOriginal.borrado = 'NO';

    if (!tarea) {
      toast.info("Por favor, asigne la tarea");
      return;
    }

    privilegioOriginal.nombre = tarea;

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    privilegioOriginal.sucursales = sucursalesElegidas;

    privilegioOriginal.permisos = permisos;

    toast.promise(PrivilegiosService.updatePrivilegios(privilegioOriginal), {
      loading: 'Editando privilegio...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return 'Privilegio editado correctamente';
      },
      error: (message) => {
        return 'No se pudo editar el privilegio';
      },
    });
  }

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
            <div >
              <Toaster />
              <div className="modal-info">
                <h2>Editar privilegio</h2>
                <Toaster />
                <div className="inputBox">
                  <input type="text" required={true} value={tarea} onChange={(e) => { setTarea(e.target.value) }} />
                  <span>Tarea</span>
                </div>
              </div>
              <div className="btns-pasos">
                <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2>Permisos actuales</h2>
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
            </div>
            {permisos.length < 5 && (
              <button onClick={añadirCampoPermiso}>Añadir permiso</button>
            )}
            <br />
            <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
            {empresa && empresa?.id > 0 ? (
              <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
            ) : (
              <button onClick={editarMedida}>Editar privilegio</button>
            )}
          </>
        );
      case 3:
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
              <button onClick={editarMedida}>Editar privilegio</button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <Toaster />
      {renderStep()}
    </div >
  );
}


export default EditarPrivilegio
