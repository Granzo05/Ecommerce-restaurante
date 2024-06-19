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
import ModalFlotanteRecomendacionesRoles from '../../hooks/ModalFlotanteFiltroRoles';
import { Roles } from '../../types/Restaurante/Roles';

interface AgregarEmpleadoProps {
  onCloseModal: () => void;
}

const AgregarEmpleado: React.FC<AgregarEmpleadoProps> = ({ onCloseModal }) => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cuil, setCuil] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [indexRoles, setIndexRoles] = useState<number>(0);
  const [roles, setRoles] = useState<Roles[]>([]);

  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaRoles, setModalBusquedaRoles] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);

  const [privilegiosElegidos, setPrivilegiosElegidos] = useState<{ [tarea: string]: string[] }>({});
  const [privilegios, setPrivilegios] = useState<Privilegios[]>([]);
  const [rolesElegidos, setRolesElegidos] = useState<string[]>([]);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
    setModalBusquedaPais(false)
    setModalBusquedaRoles(false)
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

  const handleChangeRol = (index: number, rol: Roles) => {
    const nuevosRoles = [...roles];
    nuevosRoles[index] = rol;
    setRoles(nuevosRoles);

    const nuevosNombresRoles = [...rolesElegidos];
    nuevosNombresRoles[index] = rol.nombre;
    setRolesElegidos(nuevosNombresRoles);
  };

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
      setDomicilios([...domicilios, { id: 0, calle: '', numero: parseInt(''), codigoPostal: parseInt(''), localidad: new Localidad(), borrado: 'NO' }]);
    } else {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: parseInt(''), codigoPostal: parseInt(''), localidad: new Localidad(), borrado: 'NO' }]);
      setIndexDomicilio(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoDomicilio = (index: number) => {
    if (domicilios.length > 0) {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.splice(index, 1); // Elimina el domicilio en la posición "index"
      setDomicilios(nuevosDomicilios); // Actualiza el estado con el nuevo array

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
      setIndexDomicilio(0);
    }
  };

  const añadirCampoRol = () => {
    if (roles.length === 0) {
      setRoles([...roles, { id: 0, nombre: '', borrado: 'NO', sucursales: [] }]);
    } else {
      setRoles([...roles, { id: 0, nombre: '', borrado: 'NO', sucursales: [] }]);
      setIndexDomicilio(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoRol = (index: number) => {
    if (roles.length > 0) {
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

  async function agregarEmpleado() {
    const empleadoPrivilegios: EmpleadoPrivilegio[] = Object.entries(privilegiosElegidos).map(([tarea, permisos]) => {
      const privilegio = new Privilegios(0, tarea, []);
      return new EmpleadoPrivilegio(0, privilegio, permisos);
    });

    const empleado = new Empleado();
    empleado.nombre = nombre;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = parseInt(telefono);
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

  const validateAndNextStep = () => {

    // Validación de fecha de nacimiento
    const hoy = new Date();
    const fechaMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate()); // Fecha actual menos 18 años

    if (!nombre || !nombre.match(/^[a-zA-Z\s]+$/)) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
      toast.error("Por favor, es necesaria el email");
      return;
    } else if (!contraseña || contraseña.length < 8) {
      toast.error("Por favor, es necesaria la contraseña");
      return;
    } else if (!telefono || telefono.length < 10) {
      toast.error("Por favor, es necesario el telefono");
      return;
    } else if (!cuil || cuil.length !== 13) {
      toast.error("Por favor, es necesario el cuil");
      return;
    } else if (!fechaNacimiento || fechaNacimiento > fechaMinima) {
      toast.error("Por favor, es necesaria una fecha de nacimiento válida. (Empleado mayor a 18 años)");
      return;
    } else if (!roles && rolesElegidos[0].length === 0) {
      toast.error("Por favor, es necesario el rol del empleado");
      return;
    } else {
      nextStep();
    }
  }

  const validateAndNextStep2 = () => {

    for (let i = 0; i < domicilios.length; i++) {
      const calle = domicilios[i].calle;
      const numero = domicilios[i].numero;
      const codigoPostal = domicilios[i].codigoPostal;
      const pais = domicilios[i].localidad.departamento.provincia.pais;
      const provincia = domicilios[i].localidad.departamento.provincia;
      const departamento = domicilios[i].localidad.departamento;
      const localidad = domicilios[i].localidad;

      if (!calle || !calle.match(/^[a-zA-Z\s]+$/)) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una calle`);
        return;
      } else if (!numero || (numero > 9999 || numero < 1)) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un numero de casa`);
      } else if (!codigoPostal || (codigoPostal > 9431 || codigoPostal < 1001)) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un código postal`);
      } else if (pais.nombre == '') {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un país`);
      } else if (provincia.nombre == '') {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una provincia`);
      } else if (departamento.nombre == '') {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un departamento`);
      } else if (localidad.nombre == '') {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una localidad`);
      }
    }

    if (domicilios) {
      nextStep();
    }


  }



  //VALIDAR CUIL

  const formatearCuil = (value: string) => {
    // Eliminar todos los caracteres no numéricos
    const soloNumeros = value.replace(/\D/g, "");

    // Insertar los guiones en las posiciones correctas
    let cuilFormateado = "";
    if (soloNumeros.length > 2) {
      cuilFormateado += soloNumeros.slice(0, 2) + "-";
      if (soloNumeros.length > 10) {
        cuilFormateado += soloNumeros.slice(2, 10) + "-";
        cuilFormateado += soloNumeros.slice(10, 11);
      } else {
        cuilFormateado += soloNumeros.slice(2);
      }
    } else {
      cuilFormateado = soloNumeros;
    }

    return cuilFormateado;
  };


  const handleCuilChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    const cuilFormateado = formatearCuil(value);
    setCuil(cuilFormateado);
  };

  const handleTelefonoChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    // Permitir solo valores numéricos
    if (/^\d*$/.test(value)) {
      setTelefono(value);
    }
  };

  const estanTodosMarcados = (privilegiosElegidos: { [x: string]: string | any[] | string[]; }, privilegio: Privilegios) => {
    return privilegio.permisos.every((permiso: any) => privilegiosElegidos[privilegio.tarea]?.includes(permiso));
  };

  const estanTodosDesmarcados = (privilegiosElegidos: { [x: string]: string | any[] | string[]; }, privilegio: Privilegios) => {
    return privilegio.permisos.every((permiso: any) => !privilegiosElegidos[privilegio.tarea]?.includes(permiso));
  };

  const filteredPrivilegios = privilegios?.filter(
    (privilegio) =>
      privilegio.tarea !== 'Empleados' &&
      privilegio.tarea !== 'Sucursales' &&
      privilegio.tarea !== 'Estadísticas' &&
      privilegio.tarea !== 'Empresas'
  );

  const filteredPrivilegiosOpcionales = privilegios?.filter(
    (privilegio) =>
      privilegio.tarea == 'Empleados' || privilegio.tarea == 'Sucursales' || privilegio.tarea == 'Estadísticas' || privilegio.tarea == 'Empresas'
  );


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} pattern="[a-zA-Z\s]+" />
              <span>Nombre del empleado</span>
              <div className="error-message">El nombre debe contener letras y espacios.</div>
            </div>
            <div className="inputBox">
              <input type="email" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Email del empleado</span>
              <div className="error-message">Formato incorrecto de e-mail.</div>
            </div>
            <div className="inputBox">
              <input type="text" pattern=".{13}" required={true} value={cuil} onChange={handleCuilChange} maxLength={13} />
              <span>CUIL del empleado</span>
              <div className="error-message">El CUIL debe contener sus 11 dígitos.</div>
            </div>
            <div className="inputBox">
              <input type="password" pattern=".{8,}" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña del empleado</span>
              <div className="error-message">La contraseña debe tener mínimo 8 dígitos.</div>
            </div>
            <div className="inputBox">
              <input type="text" pattern="\d{10}" required={true} value={telefono} onChange={handleTelefonoChange} />
              <span>Telefono del empleado</span>
              <div className="error-message">El número de teléfono no es válido. Mínimo 10 dígitos</div>
            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de nacimiento:</label>
              <input type="date" required value={formatearFechaYYYYMMDD(fechaNacimiento)} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
              <div className="error-message">El empleado debe ser mayor a 18 años.</div>
              <hr />
            </div>
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Rol del empleado:</label>

            {roles && roles.map((roles, index) => (
              <div key={index}>
                <p className='cierre-ingrediente' onClick={() => quitarCampoRol(index)}>X</p>
                <h4 style={{ fontSize: '18px' }}>Rol {index + 1}</h4>
                <InputComponent disabled={false} placeHolder='Seleccionar rol...' onInputClick={() => setModalBusquedaRoles(true)} selectedProduct={roles.nombre ?? ''} />
                {modalBusquedaRoles && <ModalFlotanteRecomendacionesRoles datosOmitidos={rolesElegidos} onCloseModal={handleModalClose} onSelectRol={(rol) => { handleChangeRol(index, rol); handleModalClose(); }} />}
              </div>
            ))}
            <button onClick={añadirCampoRol}>Añadir rol</button>
            <br /><br />
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Domicilio/os</h4>
            {domicilios && domicilios.map((domicilio, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilio(index)}>X</p>
                <h4 style={{ fontSize: '18px' }}>Domicilio {index + 1}</h4>

                <div className="inputBox">
                  <input type="text" required={true} value={domicilio?.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} pattern="[a-zA-Z\s]+" />
                  <span>Nombre de calle</span>
                  <div className="error-message">El nombre de la calle debe contener letras y espacios.</div>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio?.numero} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} min={1} max={9999} />
                  <span>Número de domicilio</span>
                  <div className="error-message">El número de la calle no es válido.</div>
                </div>
                <div className="inputBox">
                  <input type="number" required={true} value={domicilio?.codigoPostal} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} min={1001} max={9431} />
                  <span>Código Postal</span>
                  <div className="error-message">El codigo postal no es válido.</div>
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
              <button className='btn-accion-adelante' onClick={validateAndNextStep2}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4 className="paso-titulo">Paso 3 - Privilegios comunes</h4>
            <div className="privilegios-container">
              {filteredPrivilegios && filteredPrivilegios.map((privilegio, index) => (
                <div key={index} className="privilegio">
                  {privilegio.tarea !== 'Empleados' && privilegio.tarea !== 'Sucursales' && privilegio.tarea !== 'Estadísticas' && privilegio.tarea !== 'Empresas' && (
                    <>
                      <div className="marcajes">
                        <p
                          className={`cierre-privilegios ${estanTodosDesmarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosDesmarcados(privilegiosElegidos, privilegio) && desmarcarTarea(privilegio.tarea)}
                        >
                          Desmarcar todo
                        </p>
                        <p
                          className={`cierre-privilegios ${estanTodosMarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosMarcados(privilegiosElegidos, privilegio) && marcarTarea(privilegio.tarea, privilegio.permisos)}
                        >
                          Marcar todo
                        </p>
                      </div>
                      <h4 className="privilegio-titulo">&mdash; {privilegio.tarea} &mdash;</h4>
                      <div className="permisos-container">
                        {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                          <div key={permisoIndex} className="permiso">
                            <input
                              type="checkbox"
                              value={permiso}
                              checked={privilegiosElegidos[privilegio.tarea]?.includes(permiso) || false}
                              onChange={() => handleModificarPrivilegios(privilegio.tarea, permiso)}
                            />
                            <label>{permiso}</label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion btn-accion-adelante' onClick={nextStep}>Siguiente (opcional) ⭢</button>
              <button className='btn-accion btn-accion-completar' onClick={agregarEmpleado}>Agregar empleado ✓</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4 className="paso-titulo">Paso opcional - Privilegios sensibles</h4>
            <p>Recomendamos que estos privilegios estén deshabilitados ya que pueden dar acceso a datos sensibles</p>
            <div className="privilegios-container">
              {filteredPrivilegiosOpcionales && filteredPrivilegiosOpcionales.map((privilegio, index) => (
                <div key={index} className='privilegio-opcional'>
                  {(privilegio.tarea === 'Empleados' || privilegio.tarea === 'Sucursales' || privilegio.tarea === 'Estadísticas' || privilegio.tarea === 'Empresas') && (
                    <>
                      <div className="marcajes">
                        <p
                          className={`cierre-privilegios ${estanTodosDesmarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosDesmarcados(privilegiosElegidos, privilegio) && desmarcarTarea(privilegio.tarea)}
                        >
                          Desmarcar todo
                        </p>
                        <p
                          className={`cierre-privilegios ${estanTodosMarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosMarcados(privilegiosElegidos, privilegio) && marcarTarea(privilegio.tarea, privilegio.permisos)}
                        >
                          Marcar todo
                        </p>
                      </div>
                      <h4 className="privilegio-titulo" style={{ fontSize: '18px' }}>&mdash; {privilegio.tarea} &mdash;</h4>
                      <div className="permisos-container">
                        {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                          <div key={permisoIndex} className="permiso">
                            <input
                              type="checkbox"
                              value={permiso}
                              checked={privilegiosElegidos[privilegio.tarea]?.includes(permiso) || false}
                              onChange={() => handleModificarPrivilegios(privilegio.tarea, permiso)}
                            />
                            <label>{permiso}</label>
                          </div>
                        ))}
                      </div>


                    </>
                  )}
                </div>
              ))}
            </div>

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
