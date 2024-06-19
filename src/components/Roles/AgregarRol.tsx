import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner'
import { RolesService } from '../../services/RolesService';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Empresa } from '../../types/Restaurante/Empresa';
import { Roles } from '../../types/Restaurante/Roles';

interface AgregarRolesProps {
  onCloseModal: () => void;
}


const AgregarRoles: React.FC<AgregarRolesProps> = ({ onCloseModal }) => {
  const [nombre, setNombre] = useState('');

  async function agregarRoles() {
    const rol: Roles = new Roles();

    if (!nombre) {
      toast.info("Por favor, asigne el nombre");
      return;
    }

    rol.nombre = nombre;
    rol.borrado = 'NO';

    let sucursalesElegidas: Sucursal[] = [];

    idsSucursalesElegidas.forEach(idSucursal => {
      let sucursal: Sucursal = new Sucursal();
      sucursal.id = idSucursal;
      sucursalesElegidas.push(sucursal);
    });

    rol.sucursales = sucursalesElegidas;

    toast.promise(RolesService.createRol(rol), {
      loading: 'Creando Roles...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
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
              <div className="inputBox">
                <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
                <span>Nombre del rol</span>
              </div>
              <div className="btns-pasos">
                <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                {empresa && empresa?.id > 0 ? (
                  <button className='btn-accion-adelante' onClick={nextStep}>Seleccionar sucursales ⭢</button>
                ) : (
                  <button value="Agregar rol" id="agregarRoles" onClick={agregarRoles}>Cargar </button>
                )}
              </div>
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
              <button value="Agregar rol" id="agregarRoles" onClick={agregarRoles}>Cargar </button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar rol &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div >
  );
}


export default AgregarRoles
