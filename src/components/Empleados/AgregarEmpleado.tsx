import { useEffect, useState } from 'react';
import { Empleado } from '../../types/Restaurante/Empleado';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Toaster, toast } from 'sonner'
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import { formatearFechaYYYYMMDD } from '../../utils/global_variables/functions';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Departamento } from '../../types/Domicilio/Departamento';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';
import { Pais } from '../../types/Domicilio/Pais';
import { Privilegios } from '../../types/Restaurante/Privilegios';
import { PrivilegiosService } from '../../services/PrivilegiosService';
import { EmpleadoPrivilegio } from '../../types/Restaurante/EmpleadoPrivilegio';

interface AgregarEmpleadoProps {
  onCloseModal: () => void;
}

const AgregarEmpleado: React.FC<AgregarEmpleadoProps> = ({ onCloseModal }) => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cuil, setCuit] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);

  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);

  const [privilegiosElegidos, setPrivilegiosElegidos] = useState<{ [tarea: string]: string[] }>({});
  const [privilegios, setPrivilegios] = useState<Privilegios[]>([]);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
    setModalBusquedaPais(false)
  };

  useEffect(() => {
    PrivilegiosService.getPrivilegios()
      .then(data => {
        setPrivilegios(data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleModificarPrivilegios = (tarea: string, permiso: string) => {
    setPrivilegiosElegidos((prev) => {
      const permisosActuales = prev[tarea] || [];
      if (permisosActuales.includes(permiso)) {
        return {
          ...prev,
          [tarea]: permisosActuales.filter(p => p !== permiso)
        };
      } else {
        return {
          ...prev,
          [tarea]: [...permisosActuales, permiso]
        };
      }
    });
  };

  const desmarcarTarea = (tarea: string) => {
    setPrivilegiosElegidos((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [tarea]: _, ...rest } = prev; // Da error pero ta bien
      return rest;
    });
  };

  const marcarTarea = (tarea: string, permisos: string[]) => {
    setPrivilegiosElegidos((prev) => ({
      ...prev,
      [tarea]: permisos,
    }));
  };

  const handleChangeCalle = (index: number, calle: string) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].calle = calle;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeNumeroCasa = (index: number, numero: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].numero = numero;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeCodigoPostal = (index: number, codigoPostal: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].codigoPostal = codigoPostal;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangePais = (index: number, pais: Pais) => {
    const nuevosDomicilios = [...domicilios];
    if (pais) {
      nuevosDomicilios[index].localidad.departamento.provincia.pais = pais;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeProvincia = (index: number, provincia: Provincia) => {
    const nuevosDomicilios = [...domicilios];
    if (provincia) {
      nuevosDomicilios[index].localidad.departamento.provincia = provincia;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeDepartamento = (index: number, departamento: Departamento) => {
    const nuevosDomicilios = [...domicilios];
    if (departamento) {
      nuevosDomicilios[index].localidad.departamento = departamento;
      setDomicilios(nuevosDomicilios);
    }
  };


  const handleChangeLocalidad = (index: number, localidad: Localidad) => {
    const nuevosDomicilios = [...domicilios];
    if (localidad) {
      nuevosDomicilios[index].localidad = localidad;
      setDomicilios(nuevosDomicilios);
    }
  };

  const añadirCampoDomicilio = () => {
    // SI no hay ingredientes que genere en valor 0 de index
    if (domicilios.length === 0) {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
    } else {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
      setIndexDomicilio(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoDomicilio = (index: number) => {
    if (domicilios.length > 0) {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.splice(index, 1);
      setDomicilios(domicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
      setIndexDomicilio(0);
    }
  };

  async function agregarEmpleado() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!email) {
      toast.error("Por favor, es necesaria el email");
      return;
    } else if (!contraseña) {
      toast.error("Por favor, es necesaria la contraseña");
      return;
    } else if (!telefono) {
      toast.error("Por favor, es necesario el telefono");
      return;
    } else if (!cuil) {
      toast.error("Por favor, es necesario el cuil");
      return;
    } else if (!fechaNacimiento) {
      toast.error("Por favor, es necesaria la fecha de nacimiento");
      return;
    }

    for (let i = 0; i < domicilios.length; i++) {
      const calle = domicilios[i].calle;
      const numero = domicilios[i].numero;
      const codigoPostal = domicilios[i].codigoPostal;
      const localidad = domicilios[i].localidad;

      if (!calle) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una calle`);
        return;
      } else if (numero === 0) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un numero de casa`);
      } else if (codigoPostal === 0) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un código postal`);
      } else if (!localidad) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una localidad`);
      }
    }

    const empleadoPrivilegios: EmpleadoPrivilegio[] = Object.entries(privilegiosElegidos).map(([tarea, permisos]) => {
      const privilegio = new Privilegios(0, tarea, []);
      return new EmpleadoPrivilegio(0, privilegio, permisos);
    });

    const empleado = new Empleado();
    empleado.nombre = nombre;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = telefono;
    empleado.cuil = cuil;
    empleado.fechaNacimiento = fechaNacimiento;
    empleado.empleadoPrivilegios = empleadoPrivilegios;

    const sucursalStr = localStorage.getItem('usuario');
    const sucursal = sucursalStr ? JSON.parse(sucursalStr) : new Sucursal();

    empleado.sucursales.push(sucursal);

    empleado.domicilios = domicilios;

    empleado.borrado = 'NO';
    toast.promise(EmpleadoService.createEmpleado(empleado), {
      loading: 'Creando empleado...',
      success: (message: string) => {
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

  //SEPARAR EN PASOS
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
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del empleado</span>
            </div>
            <div className="inputBox">
              <input type="text" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Email del empleado</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={cuil} onChange={(e) => { setCuit(e.target.value) }} />
              <span>Cuil del empleado</span>
            </div>
            <div className="inputBox">
              <input type="password" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña del empleado</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Telefono del empleado</span>
            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de nacimiento:</label>
              <input type="date" value={formatearFechaYYYYMMDD(fechaNacimiento)} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
              <hr />
            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso final - Domicilio/os</h4>
            {domicilios && domicilios.map((domicilio, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilio(index)}>X</p>
                <h4 style={{ fontSize: '18px' }}>Domicilio {index + 1}</h4>

                <div className="inputBox">
                  <input type="text" required={true} value={domicilio?.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                  <span>Nombre de calle</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio?.numero} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                  <span>Número de domicilio</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio?.codigoPostal} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
                  <span>Código Postal</span>
                </div>
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
                <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.pais?.nombre ?? ''} />
                {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { handleChangePais(index, pais); handleModalClose(); }} />}
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
                <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.pais.nombre.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.nombre ?? ''} />
                {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { handleChangeProvincia(index, provincia); handleModalClose(); }} />}
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
                <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.nombre.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={domicilio.localidad?.departamento?.nombre ?? ''} />
                {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { handleChangeDepartamento(index, departamento); handleModalClose(); }} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
                <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
                <InputComponent disabled={domicilio.localidad?.departamento?.nombre.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={domicilio.localidad.nombre ?? ''} />
                {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { handleChangeLocalidad(index, localidad); handleModalClose(); }} inputDepartamento={domicilio.localidad?.departamento?.nombre} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
                <hr />
              </div>
            ))}
            <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Privilegios comúnes</h4>
            {privilegios && privilegios.map((privilegio, index) => (
              <div key={index}>
                {privilegio.tarea !== 'Empleados' && privilegio.tarea !== 'Sucursales' && privilegio.tarea !== 'Estadísticas' && privilegio.tarea !== 'Empresas' && (
                  <>
                    <hr />
                    <p className='cierre-ingrediente' onClick={() => desmarcarTarea(privilegio.tarea)}>Desmarcar todo</p>
                    <p className='cierre-ingrediente' onClick={() => marcarTarea(privilegio.tarea, privilegio.permisos)}>Marcar todo</p>
                    <h4 style={{ fontSize: '18px' }}>Tarea: {privilegio.tarea}</h4>
                    {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                      <div key={permisoIndex}>
                        <input
                          type="checkbox"
                          value={permiso}
                          checked={privilegiosElegidos[privilegio.tarea]?.includes(permiso) || false}
                          onChange={() => handleModificarPrivilegios(privilegio.tarea, permiso)}
                        />
                        <label>{permiso}</label>
                      </div>
                    ))}
                    <hr />
                  </>
                )}
              </div>
            ))}
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarEmpleado}>Agregar empleado ✓</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4>Privilegios sensibles</h4>
            <p>Recomendamos que estos privilegios estén deshabilitados ya que pueden dar acceso a datos sensibles</p>
            {privilegios && privilegios.map((privilegio, index) => (
              <div key={index}>
                {(privilegio.tarea === 'Empleados' || privilegio.tarea === 'Sucursales' || privilegio.tarea === 'Estadísticas' || privilegio.tarea === 'Empresas') && (
                  <>
                    <hr />
                    <p className='cierre-ingrediente' onClick={() => desmarcarTarea(privilegio.tarea)}>Desmarcar todo</p>
                    <p className='cierre-ingrediente' onClick={() => marcarTarea(privilegio.tarea, privilegio.permisos)}>Marcar todo</p>
                    <h4 style={{ fontSize: '18px' }}>Tarea: {privilegio.tarea}</h4>
                    {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                      <div key={permisoIndex}>
                        <input
                          type="checkbox"
                          value={permiso}
                          checked={privilegiosElegidos[privilegio.tarea]?.includes(permiso) || false}
                          onChange={() => handleModificarPrivilegios(privilegio.tarea, permiso)}
                        />
                        <label>{permiso}</label>
                      </div>
                    ))}
                    <hr />
                  </>
                )}
              </div>
            ))}
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-completar' onClick={agregarEmpleado}>Agregar empleado ✓</button>
            </div>
          </>
        );
    }

  }

  return (
    <div className="modal-info">
      <h2>&mdash; Agregar empleado &mdash;</h2>
      <Toaster />
      {renderStep()}
    </div>
  )
}

export default AgregarEmpleado
