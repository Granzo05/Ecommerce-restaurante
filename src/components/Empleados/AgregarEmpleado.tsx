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
import { PrivilegiosService } from '../../services/PrivilegiosService';
import ModalFlotanteRecomendacionesRoles from '../../hooks/ModalFlotanteFiltroRoles';
import { Roles } from '../../types/Restaurante/Roles';
import { RolesEmpleado } from '../../types/Restaurante/RolesEmpleados';
import { PrivilegiosEmpleados } from '../../types/Restaurante/PrivilegiosEmpleado';
import { PrivilegiosSucursales } from '../../types/Restaurante/PrivilegiosSucursales';
import { Imagenes } from '../../types/Productos/Imagenes';

interface AgregarEmpleadoProps {
  onCloseModal: () => void;
}

const AgregarEmpleado: React.FC<AgregarEmpleadoProps> = ({ onCloseModal }) => {
  const [imagenes, setImagenes] = useState<Imagenes[]>([]);
  const [selectIndex, setSelectIndex] = useState<number>(0);

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

  const [privilegiosElegidos, setPrivilegiosElegidos] = useState<{ [nombre: string]: string[] }>({});
  const [privilegios, setPrivilegios] = useState<PrivilegiosSucursales[]>([]);
  const [rolesElegidos, setRolesElegidos] = useState<string[]>([]);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
    setModalBusquedaPais(false)
    setModalBusquedaRoles(false)
  };

  const handleImagen = (index: number, file: File | null) => {
    if (file) {
      const newImagenes = [...imagenes];
      newImagenes[index] = { ...newImagenes[index], file };
      setImagenes(newImagenes);
    }
  };

  const añadirCampoImagen = () => {
    setImagenes([...imagenes, { index: imagenes.length, file: null } as Imagenes]);
  };

  const quitarCampoImagen = () => {
    if (imagenes.length > 0) {
      const nuevasImagenes = [...imagenes];
      nuevasImagenes.pop();
      setImagenes(nuevasImagenes);

      if (selectIndex > 0) {
        setSelectIndex(prevIndex => prevIndex - 1);
      }
    }
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

    rellenarPrivilegios(rol);
  };

  const rellenarPrivilegios = (rol: Roles) => {
    let newPrivilegios = { ...privilegiosElegidos };

    switch (rol.nombre) {
      case 'ADMINISTRATIVO' || 'CAJERO':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ'],
          'Artículos menú': ['READ'],
          'Categorias': ['READ'],
          'Ingredientes': ['READ'],
          'Medidas': ['READ'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ', 'UPDATE'],
          'Pedidos en camino': ['READ', 'UPDATE'],
          'Pedidos entrantes': ['READ', 'UPDATE'],
          'Pedidos entregados': ['READ'],
          'Promociones': ['READ'],
          'Stock': ['READ'],
          'Stock entrante': ['READ'],
          'Subcategorias': ['READ'],
        };
        break;
      case 'BARTENDER':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ', 'UPDATE'],
          'Pedidos en camino': ['READ', 'UPDATE'],
          'Pedidos entrantes': ['READ', 'UPDATE'],
          'Pedidos entregados': ['READ'],
          'Promociones': ['READ'],
          'Stock': ['READ'],
        };
        break;
      case 'COCINERO_AYUDANTE':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ'],
          'Artículos menú': ['READ'],
          'Ingredientes': ['READ'],
          'Medidas': ['READ'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ'],
          'Pedidos entregados': ['READ'],
          'Promociones': ['READ'],
          'Stock': ['READ'],
          'Stock entrante': ['READ'],
        };
        break;
      case 'COCINERO_JEFE':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ'],
          'Artículos menú': ['READ'],
          'Ingredientes': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ'],
          'Pedidos entrantes': ['READ'],
          'Pedidos entregados': ['READ'],
          'Promociones': ['READ'],
          'Stock': ['READ', 'CREATE', 'UPDATE'],
          'Stock entrante': ['READ', 'CREATE'],
        };
        break;
      case 'DELIVERY':
        newPrivilegios = {
          ...newPrivilegios,
          'Pedidos cocinados': ['READ'],
        };
        break;
      case 'ENCARGADO':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Artículos menú': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Categorias': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Clientes': ['READ', 'DELETE', 'ACTIVATE'],
          'Ingredientes': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Medidas': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ', 'UPDATE'],
          'Pedidos en camino': ['READ', 'UPDATE'],
          'Pedidos entrantes': ['READ', 'UPDATE'],
          'Pedidos entregados': ['READ', 'UPDATE'],
          'Promociones': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Stock': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Roles': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Stock entrante': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Subcategorias': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
        };
        break;
      case 'MANEJO_DE_STOCK':
        newPrivilegios = {
          ...newPrivilegios,
          'Stock': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Stock entrante': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
        };
        break;
      case 'MOZO':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ'],
          'Artículos menú': ['READ'],
          'Pedidos aceptados': ['READ'],
          'Pedidos cocinados': ['READ'],
          'Pedidos en camino': ['READ'],
          'Pedidos entrantes': ['READ'],
          'Pedidos entregados': ['READ', 'UPDATE'],
          'Promociones': ['READ'],
        };
        break;
      case 'SUPERVISOR':
        newPrivilegios = {
          ...newPrivilegios,
          'Articulos de venta': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Artículos menú': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Categorias': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Clientes': ['READ', 'DELETE', 'ACTIVATE'],
          'Empleados': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Estadísticas': ['READ'],
          'Ingredientes': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Medidas': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Pedidos aceptados': ['READ', 'UPDATE'],
          'Pedidos cocinados': ['READ', 'UPDATE'],
          'Pedidos en camino': ['READ', 'UPDATE'],
          'Pedidos entrantes': ['READ', 'UPDATE'],
          'Pedidos entregados': ['READ', 'UPDATE'],
          'Promociones': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Stock': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Roles': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Stock entrante': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Subcategorias': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
          'Sucursales': ['READ', 'CREATE', 'UPDATE', 'DELETE', 'ACTIVATE'],
        };
        break;
      default:
        break;
    }

    setPrivilegiosElegidos(newPrivilegios);
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
    // SI no hay ingredientes que genere en valor 0 de index
    if (roles.length === 0) {
      setRoles([...roles, { id: 0, nombre: '', borrado: 'NO', sucursales: [] }]);
    } else {
      setRoles([...roles, { id: 0, nombre: '', borrado: 'NO', sucursales: [] }]);
      setIndexRoles(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoRol = (nombreRol: string, index: number) => {
    const nuevosNombres = rolesElegidos.filter(nombre => nombre !== nombreRol);
    setRolesElegidos(nuevosNombres);

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

  const [isLoading, setIsLoading] = useState(false);

  async function agregarEmpleado() {
    setIsLoading(true);
    const empleado = new Empleado();
    empleado.nombre = nombre;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = parseInt(telefono);
    empleado.cuil = cuil;
    empleado.fechaNacimiento = fechaNacimiento;
    empleado.domicilios = domicilios;
    empleado.borrado = 'NO';

    const empleadoPrivilegios: PrivilegiosEmpleados[] = Object.entries(privilegiosElegidos).map(([nombre, permisos]) => {
      return new PrivilegiosEmpleados(0, permisos, 0, nombre, 'NO');
    });

    empleado.privilegios = empleadoPrivilegios;

    roles.forEach(rol => {
      let rolEmpleado: RolesEmpleado = new RolesEmpleado();

      rolEmpleado.rol = rol;
      empleado.roles.push(rolEmpleado)
    });

    toast.promise(EmpleadoService.createEmpleado(empleado, imagenes), {
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
      finally: () => {
        setIsLoading(false);
      }
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

    if (!nombre || !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
      toast.error("Por favor, es necesario un nombre válido");
      return;
    } else if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
      toast.error("Por favor, es necesario un e-mail válido");
      return;
    } else if (!contraseña || contraseña.length < 8) {
      toast.error("Por favor, es necesario una contraseña válida");
      return;
    } else if (!telefono || telefono.length < 10) {
      toast.error("Por favor, es necesario un número de teléfono válido");
      return;
    } else if (!cuil || cuil.length !== 13) {
      toast.error("Por favor, es necesario un CUIL válido");
      return;
    } else if (!fechaNacimiento || fechaNacimiento > fechaMinima) {
      toast.error("Por favor, es necesaria una fecha de nacimiento válida. (Empleado mayor a 18 años)");
      return;
    } else {
      nextStep();
    }

  }

  const validateAndNextStep2 = () => {

    if (!domicilios || domicilios.length === 0) {
      toast.info("Por favor, es necesario asignarle mínimo un domicilio al empleado");
      return;
    }

    for (let i = 0; i < domicilios.length; i++) {
      const calle = domicilios[i].calle;
      const numero = domicilios[i].numero;
      const codigoPostal = domicilios[i].codigoPostal;
      const pais = domicilios[i].localidad.departamento.provincia.pais;
      const provincia = domicilios[i].localidad.departamento.provincia;
      const departamento = domicilios[i].localidad.departamento;
      const localidad = domicilios[i].localidad;

      if (!calle || !calle.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
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

  const validateAndNextStep3 = () => {

    if (!roles || rolesElegidos.length === 0) {
      toast.info("Por favor, es necesario asignarle mínimo un rol al empleado");
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      const rol = roles[i].nombre


      if (!rol) {
        toast.info(`Complete el rol ${i + 1} que desea asignar`);
        return;
      }

    }

    if (roles) {
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

  const estanTodosMarcados = (privilegiosElegidos: { [x: string]: string | any[] | string[]; }, privilegio: PrivilegiosSucursales) => {
    return privilegio.permisos.every((permiso: any) => privilegiosElegidos[privilegio.nombre]?.includes(permiso));
  };

  const estanTodosDesmarcados = (privilegiosElegidos: { [x: string]: string | any[] | string[]; }, privilegio: PrivilegiosSucursales) => {
    return privilegio.permisos.every((permiso: any) => !privilegiosElegidos[privilegio.nombre]?.includes(permiso));
  };

  const filteredPrivilegios = privilegios?.filter(
    (privilegio) =>
      privilegio.nombre !== 'Empleados' &&
      privilegio.nombre !== 'Sucursales' &&
      privilegio.nombre !== 'Estadísticas' &&
      privilegio.nombre !== 'Empresas'
  );

  const filteredPrivilegiosOpcionales = privilegios?.filter(
    (privilegio) =>
      privilegio.nombre == 'Empleados' || privilegio.nombre == 'Sucursales' || privilegio.nombre == 'Estadísticas' || privilegio.nombre == 'Empresas'
  );


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h4>Paso 1 - Datos</h4>
            <div className="inputBox">
              <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" />
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
              <span>Teléfono del empleado</span>
              <div className="error-message">El número de teléfono no es válido. Mínimo 10 dígitos</div>
            </div>
            <div className="inputBox">
              <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de nacimiento:</label>
              <input type="date" required value={formatearFechaYYYYMMDD(fechaNacimiento)} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
              <div className="error-message" style={{ marginTop: '70px' }}>No es una fecha válida. (El empleado debe ser mayor a 18 años)</div>

            </div>
            <div className="btns-pasos">
              <button className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h4>Paso 2 - Imagenes (opcional)</h4>
            <div >
              {imagenes.map((imagen, index) => (
                <div key={index} className='inputBox'>
                  <hr />
                  <p className='cierre-ingrediente' onClick={() => quitarCampoImagen()}>X</p>
                  <h4 style={{ fontSize: '18px' }}>Imagen {index + 1}</h4>
                  <br />
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${index}`}
                      className="file-input"
                      onChange={(e) => handleImagen(index, e.target.files?.[0] ?? null)}
                    />
                    <label htmlFor={`file-input-${index}`} className="file-input-label">
                      {imagen.file ? (
                        <p>Archivo seleccionado: {imagen.file.name}</p>
                      ) : (
                        <p>Seleccionar un archivo</p>
                      )}
                    </label>
                  </div>
                </div>
              ))}

            </div>
            <button onClick={añadirCampoImagen}>Añadir imagen</button>
            <br />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h4>Paso 4 - Roles</h4>

            {roles && roles.map((roles, index) => (
              <div key={index}>
                <p className='cierre-ingrediente' onClick={() => quitarCampoRol(roles.nombre, index)}>X</p>
                <h4 style={{ fontSize: '18px' }}>Rol {index + 1}</h4>

                <label style={{ display: 'flex', fontWeight: 'bold' }}>Rol del empleado:</label>
                <InputComponent disabled={false} placeHolder='Filtrar roles...' onInputClick={() => setModalBusquedaRoles(true)} selectedProduct={roles.nombre ?? ''} />
                {modalBusquedaRoles && <ModalFlotanteRecomendacionesRoles datosOmitidos={rolesElegidos} onCloseModal={handleModalClose} onSelectRol={(rol) => { handleChangeRol(index, rol); handleModalClose(); }} />}
              </div>
            ))}
            <button onClick={añadirCampoRol}>Añadir rol</button>
            <br /><br />
            <hr />
            <div className="btns-pasos">
              <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
              <button className='btn-accion-adelante' onClick={validateAndNextStep3}>Siguiente ⭢</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h4>Paso 3 - Domicilio/os</h4>
            {domicilios && domicilios.map((domicilio, index) => (
              <div key={index}>
                <hr />
                <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilio(index)}>X</p>
                <h4 style={{ fontSize: '18px' }}>Domicilio {index + 1}</h4>

                <div className="inputBox">
                  <input type="text" required={true} value={domicilio?.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" />
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
      case 5:
        return (
          <>
            <h4 className="paso-titulo">Paso 5 - Privilegios comunes</h4>
            <div className="privilegios-container">
              {filteredPrivilegios && filteredPrivilegios.map((privilegio, index) => (
                <div key={index} className="privilegio">
                  {privilegio.nombre !== 'Empleados' && privilegio.nombre !== 'Sucursales' && privilegio.nombre !== 'Estadísticas' && privilegio.nombre !== 'Empresas' && (
                    <>
                      <div className="marcajes">
                        <p
                          className={`cierre-privilegios ${estanTodosDesmarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosDesmarcados(privilegiosElegidos, privilegio) && desmarcarTarea(privilegio.nombre)}
                        >
                          Desmarcar todo
                        </p>
                        <p
                          className={`cierre-privilegios ${estanTodosMarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosMarcados(privilegiosElegidos, privilegio) && marcarTarea(privilegio.nombre, privilegio.permisos)}
                        >
                          Marcar todo
                        </p>
                      </div>
                      <h4 className="privilegio-titulo">&mdash; {privilegio.nombre} &mdash;</h4>
                      <div className="permisos-container">
                        {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                          <div key={permisoIndex} className="permiso">
                            <input
                              type="checkbox"
                              value={permiso}
                              checked={privilegiosElegidos[privilegio.nombre]?.includes(permiso) || false}
                              onChange={() => handleModificarPrivilegios(privilegio.nombre, permiso)}
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
              <button className='btn-accion btn-accion-adelante' onClick={nextStep}>Privilegios sensibles (opcional) ⭢</button>
              <button className='btn-accion-completar' onClick={agregarEmpleado} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Agregar empleado ✓'}
              </button>            </div>
          </>
        );
      case 6:
        return (
          <>
            <h4 className="paso-titulo">Paso opcional - Privilegios sensibles</h4>
            <p>Recomendamos que estos privilegios estén deshabilitados ya que pueden dar acceso a datos sensibles</p>
            <div className="privilegios-container">
              {filteredPrivilegiosOpcionales && filteredPrivilegiosOpcionales.map((privilegio, index) => (
                <div key={index} className='privilegio-opcional'>
                  {(privilegio.nombre === 'Empleados' || privilegio.nombre === 'Sucursales' || privilegio.nombre === 'Estadísticas' || privilegio.nombre === 'Empresas') && (
                    <>
                      <div className="marcajes">
                        <p
                          className={`cierre-privilegios ${estanTodosDesmarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosDesmarcados(privilegiosElegidos, privilegio) && desmarcarTarea(privilegio.nombre)}
                        >
                          Desmarcar todo
                        </p>
                        <p
                          className={`cierre-privilegios ${estanTodosMarcados(privilegiosElegidos, privilegio) ? 'desactivado' : ''}`}
                          onClick={() => !estanTodosMarcados(privilegiosElegidos, privilegio) && marcarTarea(privilegio.nombre, privilegio.permisos)}
                        >
                          Marcar todo
                        </p>
                      </div>
                      <h4 className="privilegio-titulo" style={{ fontSize: '18px' }}>&mdash; {privilegio.nombre} &mdash;</h4>
                      <div className="permisos-container">
                        {privilegio.permisos && privilegio.permisos.map((permiso, permisoIndex) => (
                          <div key={permisoIndex} className="permiso">
                            <input
                              type="checkbox"
                              value={permiso}
                              checked={privilegiosElegidos[privilegio.nombre]?.includes(permiso) || false}
                              onChange={() => handleModificarPrivilegios(privilegio.nombre, permiso)}
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
              <button className='btn-accion-completar' onClick={agregarEmpleado} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Agregar empleado ✓'}
              </button>
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
