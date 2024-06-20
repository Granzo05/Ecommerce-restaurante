import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { Domicilio } from '../../types/Domicilio/Domicilio';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import ModalFlotanteRecomendacionesSucursales from '../../hooks/ModalFlotanteFiltroSucursales';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Pais } from '../../types/Domicilio/Pais';
import { formatearFechaDDMMYYYY, formatearFechaYYYYMMDD } from '../../utils/global_variables/functions';
import { Privilegios } from '../../types/Restaurante/Privilegios';
import { PrivilegiosService } from '../../services/PrivilegiosService';
import ModalFlotanteRecomendacionesRoles from '../../hooks/ModalFlotanteFiltroRoles';
import { RolesEmpleado } from '../../types/Restaurante/RolesEmpleados';
import { Roles } from '../../types/Restaurante/Roles';
import { PrivilegiosEmpleados } from '../../types/Restaurante/PrivilegiosEmpleado';
import { PrivilegiosSucursales } from '../../types/Restaurante/PrivilegiosSucursales';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
  onCloseModal: () => void;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal, onCloseModal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [email, setEmail] = useState(empleadoOriginal.email);
  const [cuil, setCuit] = useState(empleadoOriginal.cuil);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(empleadoOriginal.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date(empleadoOriginal.fechaNacimiento));
  const [sucursal, setSucursal] = useState(empleadoOriginal.sucursales[0]);

  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [indexDomicilioModificable, setIndexDomicilioModificable] = useState<number>(0);
  const [domiciliosModificable, setDomiciliosModificable] = useState<Domicilio[]>(empleadoOriginal.domicilios);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

  const [indexRoles, setIndexRoles] = useState<number>(0);
  const [indexRolesModificables, setIndexRolesModificables] = useState<number>(0);
  const [rolesModificables, setRolesModificables] = useState<RolesEmpleado[]>(empleadoOriginal.rolesEmpleado);
  const [roles, setRoles] = useState<RolesEmpleado[]>([]);
  const [rolesElegidos, setRolesElegidos] = useState<string[]>([]);

  const [privilegiosElegidos, setPrivilegiosElegidos] = useState<{ [nombre: string]: string[] }>({});
  const [privilegios, setPrivilegios] = useState<PrivilegiosSucursales[]>([]);



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
    setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
    setIndexDomicilio(prevIndex => prevIndex + 1);
  };

  const quitarCampoDomicilio = (index: number) => {
    if (indexDomicilio > 0) {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.splice(index, 1);
      setDomicilios(nuevosDomicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
      setIndexDomicilio(0);
    }
  };

  const quitarCampoDomicilioModificable = (index: number) => {
    if (domiciliosModificable.length > 0) {
      const nuevosDomicilios = [...domiciliosModificable];
      nuevosDomicilios.splice(index, 1);
      setDomiciliosModificable(nuevosDomicilios);

      if (indexDomicilioModificable > 0) {
        setIndexDomicilioModificable(indexDomicilioModificable - 1);
      }
    } else {
      setDomiciliosModificable([]);
      setIndexDomicilioModificable(0);
    }
  };

  const handleChangeRol = (index: number, rol: Roles) => {
    const nuevosRoles = [...roles];
    nuevosRoles[index].rol = rol;
    setRoles(nuevosRoles);

    const nuevosNombresRoles = [...rolesElegidos];
    nuevosNombresRoles[index] = rol.nombre;
    setRolesElegidos(nuevosNombresRoles);
  };

  const añadirCampoRol = () => {
    // SI no hay ingredientes que genere en valor 0 de index
    setRoles([...roles, { id: 0, rol: new Roles(), borrado: 'no' }]);
    setIndexRoles(prevIndex => prevIndex + 1);
  };

  const quitarCampoRol = (index: number) => {
    if (indexRoles > 0) {
      const nuevosRoles = [...roles];
      nuevosRoles.splice(index, 1);
      setRoles(nuevosRoles);

      if (indexRoles > 0) {
        setIndexRoles(indexRoles - 1);
      }
    } else {
      setRoles([]);
      setIndexRoles(0);
    }
  };

  const quitarCampoRolModificable = (index: number) => {
    if (rolesModificables.length > 0) {
      const nuevosRoles = [...rolesModificables];
      nuevosRoles.splice(index, 1);
      setRolesModificables(nuevosRoles);

      if (indexRolesModificables > 0) {
        setIndexRolesModificables(indexRolesModificables - 1);
      }
    } else {
      setRolesModificables([]);
      setIndexRolesModificables(0);
    }
  };

  useEffect(() => {
    PrivilegiosService.getPrivilegios()
      .then(data => {
        setPrivilegios(data);
        cargarPrivilegios();
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const cargarPrivilegios = () => {
    empleadoOriginal.privilegios?.forEach(privilegios => {
      setPrivilegiosElegidos(prevState => {
        const { nombre } = privilegios;
        const nuevosPrivilegios = [...(prevState[nombre] || []), ...privilegios.permisos];
        return { ...prevState, [nombre]: nuevosPrivilegios };
      });
    });
  };

  const handleModificarPrivilegios = (nombre: string, permiso: string) => {
    setPrivilegiosElegidos((prev) => {
      const permisosActuales = prev[nombre] || [];
      if (permisosActuales.includes(permiso)) {
        return {
          ...prev,
          [nombre]: permisosActuales.filter(p => p !== permiso)
        };
      } else {
        return {
          ...prev,
          [nombre]: [...permisosActuales, permiso]
        };
      }
    });
  };

  const desmarcarTarea = (nombre: string) => {
    setPrivilegiosElegidos((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [nombre]: _, ...rest } = prev; // Da error pero ta bien
      return rest;
    });
  };

  const marcarTarea = (nombre: string, permisos: string[]) => {
    setPrivilegiosElegidos((prev) => ({
      ...prev,
      [nombre]: permisos,
    }));
  };

  const [modalBusquedaSucursal, setModalBusquedaSucursal] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);
  const [modalBusquedaRol, setModalBusquedaRol] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
    setModalBusquedaPais(false)
    setModalBusquedaRol(false)
  };

  const formatDate = (date: Date) => {
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return new Date(year, month - 1, day);
  };

  async function editarEmpleado() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!email) {
      toast.error("Por favor, es necesaria el email");
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

    if (domiciliosModificable.length === 0 && domicilios.length === 0) {
      toast.info("Se debe agregar al menos un domicilio.");
      return;
    }

    if (rolesModificables.length === 0 && roles.length === 0) {
      toast.info("Se debe agregar al menos un domicilio.");
      return;
    }

    let domiciliosValidos = [...domiciliosModificable, ...domicilios].filter(domicilio =>
      domicilio.calle && domicilio.numero && domicilio.codigoPostal
    );

    if (domiciliosValidos.length === 0) {
      toast.info("Se debe agregar al menos un domicilio válido.");
      return;
    }


    const empleadoActualizado: Empleado = {
      ...empleadoOriginal,
      nombre,
      email,
      cuil,
      contraseña,
      fechaNacimiento: formatDate(new Date(fechaNacimiento)),
      telefono
    };

    domiciliosModificable.forEach((nuevoDomicilio) => {
      const existe = domicilios.some((domicilio) =>
        domicilio.numero === nuevoDomicilio.numero &&
        domicilio.calle === nuevoDomicilio.calle &&
        domicilio.codigoPostal === nuevoDomicilio.codigoPostal
      );

      if (!existe) {
        empleadoActualizado.domicilios.push(nuevoDomicilio);
      } else {
        empleadoActualizado.domicilios = empleadoActualizado.domicilios.filter(s => s.id !== nuevoDomicilio.id);
        empleadoActualizado.domicilios.push(nuevoDomicilio);
      }
    });

    rolesModificables.forEach((rol) => {
      const existe = roles.some((rolNuevo) =>
        rol.rol === rolNuevo.rol
      );

      if (!existe) {
        roles.push(rol);
      }
    });

    const empleadoPrivilegios: PrivilegiosEmpleados[] = Object.entries(privilegiosElegidos).map(([nombre, permisos]) => {
      return new PrivilegiosEmpleados(0, permisos, 0, nombre, 'NO');
    });

    empleadoActualizado.domicilios = domicilios;

    empleadoActualizado.privilegios = empleadoPrivilegios

    // Por las dudas, se busca si la sucursal existe, en ese caso se borra para evitar duplicaciones
    if (sucursal && !empleadoActualizado.sucursales.some(s => s.nombre === sucursal.nombre)) {
      empleadoActualizado.sucursales.push(sucursal);
    } else {
      empleadoActualizado.sucursales = empleadoActualizado.sucursales.filter(s => s.id !== sucursal.id);
      empleadoActualizado.sucursales.push(sucursal);
    }

    domicilios.forEach(domicilio => {
      if (domicilio && !empleadoActualizado.domicilios.some(s => s.calle === domicilio.calle && s.localidad === domicilio.localidad && s.codigoPostal === domicilio.codigoPostal)) {
        empleadoActualizado.domicilios.push(domicilio);
      } else {
        empleadoActualizado.domicilios = empleadoActualizado.domicilios.filter(s => s.id !== domicilio.id);
        empleadoActualizado.domicilios.push(domicilio);
      }
    });

    roles.forEach(rol => {
      if (rol && !empleadoActualizado.rolesEmpleado.some(s => s.rol === rol.rol)) {
        empleadoActualizado.rolesEmpleado.push(rol);
      } else {
        empleadoActualizado.rolesEmpleado = empleadoActualizado.rolesEmpleado.filter(s => s.id !== rol.id);
        empleadoActualizado.rolesEmpleado.push(rol);
      }
    });

    empleadoActualizado.borrado = 'NO';

    empleadoActualizado.rolesEmpleado = roles;

    toast.promise(EmpleadoService.updateEmpleado(empleadoActualizado), {
      loading: 'Actualizando empleado...',
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
            <h4>Datos</h4>
            <div className="inputBox">
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
              <span>Nombre del empleado</span>
            </div>
            <div className="inputBox">
              <input type="text" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Email del empleado</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={cuil.replace(/-/g, '')} onChange={(e) => { setCuit(e.target.value) }} />
              <span>Cuil del empleado</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña del empleado</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Telefono del empleado</span>
            </div>
            <div className="inputBox">
              <input type="date" required={true} value={formatearFechaYYYYMMDD(new Date(fechaNacimiento))} onChange={(e) => setFechaNacimiento(new Date(e.target.value))} />
              <span>Fecha de nacimiento</span>
            </div>
            <InputComponent disabled={false} placeHolder='Seleccionar sucursal...' onInputClick={() => setModalBusquedaSucursal(true)} selectedProduct={sucursal?.nombre ?? ''} />
            {modalBusquedaSucursal && <ModalFlotanteRecomendacionesSucursales datosOmitidos={sucursal?.nombre ?? ''} onCloseModal={handleModalClose} onSelectSucursal={(sucursal) => { setSucursal(sucursal); handleModalClose(); }} />}
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Roles</h4>
            {rolesModificables && rolesModificables.map((roles, index) => (
              <div key={'domicilioMod' + index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoRolModificable(index)}>X</p>

                <h2>Rol actual {index + 1}</h2>
                <div className="inputBox">
                  <input type="text" disabled={true} required={true} value={roles.rol.nombre} />
                </div>
              </div>
            ))}
            {roles && roles.map((rol, index) => (
              <>
                <div key={'domicilio' + index}>
                  <h2>Rol nuevo {index + 1}</h2>
                  <p onClick={() => quitarCampoRol(index)}>X</p>
                  <InputComponent disabled={false} placeHolder='Seleccionar rol...' onInputClick={() => setModalBusquedaRol(true)} selectedProduct={rol.rol.nombre ?? ''} />
                  {modalBusquedaRol && <ModalFlotanteRecomendacionesRoles datosOmitidos={rolesElegidos} onCloseModal={handleModalClose} onSelectRol={(rol) => { handleChangeRol(index, rol); handleModalClose(); }} />}
                </div >
                <hr />
              </>
            ))}
            <button onClick={añadirCampoRol}>Añadir rol</button>
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
            <h4>Domicilio/os</h4>
            {domiciliosModificable && domiciliosModificable.map((domicilio, index) => (
              <div key={'domicilioMod' + index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilioModificable(index)}>X</p>
                <h2>Domicilio actual {index + 1}</h2>
                <div className="inputBox">
                  <input type="text" required={true} value={domicilio.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                  <span>Nombre de calle</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio.numero} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                  <span>Número de domicilio</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio.codigoPostal} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
                  <span>Código Postal</span>
                </div>
                <div className="inputBox">
                  <input type="text" disabled required={true} value={domicilio.localidad?.nombre} />
                </div>
              </div>
            ))}
            {domicilios && domicilios.map((domicilio, index) => (
              <div key={'domicilio' + index}>
                <h2>Domicilio nuevo {index + 1}</h2>
                <hr /><p onClick={() => quitarCampoDomicilio(index)}>X</p>
                <div className="inputBox">
                  <input type="text" required={true} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                  <span>Nombre de calle</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                  <span>Número de domicilio</span>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
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
      case 4:
        return (
          <>
            <h4>Privilegios comúnes</h4>
            {privilegios && privilegios.map((privilegio, index) => (
              <div key={index}>
                {privilegio.nombre !== 'Empleados' && privilegio.nombre !== 'Sucursales' && privilegio.nombre !== 'Estadísticas' && privilegio.nombre !== 'Empresas' && (
                  <>
                    <hr />
                    <p className='cierre-ingrediente' onClick={() => desmarcarTarea(privilegio.nombre)}>Desmarcar todo</p>
                    <p className='cierre-ingrediente' onClick={() => marcarTarea(privilegio.nombre, privilegio.permisos)}>Marcar todo</p>
                    <h4 style={{ fontSize: '18px' }}>Tarea: {privilegio.nombre}</h4>
                    {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                      <div key={permisoIndex}>
                        <input
                          type="checkbox"
                          value={permiso}
                          checked={privilegiosElegidos[privilegio.nombre]?.includes(permiso) || false}
                          onChange={() => handleModificarPrivilegios(privilegio.nombre, permiso)}
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
              <button className='btn-accion-completar' onClick={editarEmpleado}>Editar empleado ✓</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h4>Privilegios sensibles</h4>
            <p>Recomendamos que estos privilegios estén deshabilitados ya que pueden dar acceso a datos sensibles</p>
            {privilegios && privilegios.map((privilegio, index) => (
              <div key={index}>
                {(privilegio.nombre === 'Empleados' || privilegio.nombre === 'Sucursales' || privilegio.nombre === 'Estadísticas' || privilegio.nombre === 'Empresas') && (
                  <>
                    <hr />
                    <p className='cierre-ingrediente' onClick={() => desmarcarTarea(privilegio.nombre)}>Desmarcar todo</p>
                    <p className='cierre-ingrediente' onClick={() => marcarTarea(privilegio.nombre, privilegio.permisos)}>Marcar todo</p>
                    <h4 style={{ fontSize: '18px' }}>Tarea: {privilegio.nombre}</h4>
                    {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                      <div key={permisoIndex}>
                        <input
                          type="checkbox"
                          value={permiso}
                          checked={privilegiosElegidos[privilegio.nombre]?.includes(permiso) || false}
                          onChange={() => handleModificarPrivilegios(privilegio.nombre, permiso)}
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
              <button className='btn-accion-completar' onClick={editarEmpleado}>Editar empleado ✓</button>
            </div>
          </>
        )
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

export default EditarEmpleado;

