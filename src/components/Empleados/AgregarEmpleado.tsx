import { useEffect, useState } from 'react';
import { Empleado } from '../../types/Restaurante/Empleado';
import { EmpleadoService } from '../../services/EmpleadoService';
import { clearInputs } from '../../utils/global_variables/functions';
import { Toaster, toast } from 'sonner'
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Localidad } from '../../types/Domicilio/Localidad';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { LocalidadService } from '../../services/LocalidadService';
import { useDebounce } from '@uidotdev/usehooks';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';

function AgregarEmpleado() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cuil, setCuit] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [calle, setCalle] = useState('');
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);

  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 5000);

  const [inputValueProvincia, setInputValueProvincia] = useState('');
  const [inputValueDepartamento, setInputValueDepartamento] = useState('');
  const [inputValueLocalidad, setInputValueLocalidad] = useState('');

  const [resultadosProvincias, setResultadosProvincias] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
  const [resultadosDepartamentos, setResultadosDepartamentos] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
  const [resultadosLocalidades, setResultadosLocalidades] = useState<Departamento[] | Localidad[] | Provincia[]>([]);

  // Cargamos los departamentos de la provincia elegida en el select
  const [departamentos, setDepartamentos] = useState<Departamento[] | null>([]);
  // Cargamos las localidades disponibles, tanto para el domicilio de la sucursal como para los disponibles para el delivery
  //Select que nos permite filtrar para los departamentos de la sucursal asi no cargamos de más innecesariamente
  const [provincias, setProvincias] = useState<Provincia[] | null>([]);
  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [localidades, setLocalidades] = useState<Localidad[] | null>([]);
  // Id de la localidad para el domicilio de la sucursal
  const [idLocalidadDomicilioSucursal, setLocalidadDomicilioSucursal] = useState<number>(0)

  useEffect(() => {
    cargarProvincias();
  }, []);

  useEffect(() => {
    // Si se deja de escribir de borran todas las recomendaciones
    setResultadosDepartamentos([])
    setResultadosLocalidades([])
    setResultadosProvincias([])
  }, [debouncedInputValue]);

  // Una vez cargadas las provincias vuelvo a cargar el select
  async function cargarProvincias() {
    await ProvinciaService.getProvincias()
      .then(data => {
        setProvincias(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Al seleccionar una provincia cargo los departamentos asociados
  async function cargarDepartamentos(idProvincia: number) {
    await DepartamentoService.getDepartamentosByProvinciaId(idProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  async function cargarLocalidades(idDepartamento: number) {
    await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento)
      .then(async localidades => {
        setLocalidades(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  const handleInputProvinciaChange = (value: string) => {
    setInputValue(value);
    setInputValueProvincia(value);

    const provinciasFiltradas = provincias?.filter(provincia =>
      provincia.nombre.toLowerCase().includes(value.toLowerCase())
    );

    if (provinciasFiltradas && provinciasFiltradas.length > 1) {
      setResultadosProvincias(provinciasFiltradas);
    } else if (provinciasFiltradas && provinciasFiltradas.length === 1) {
      // Si solamente tengo un resultado entonces actualizo el valor del Input a ese
      setResultadosProvincias([]);
      cargarDepartamentos(provinciasFiltradas[0].id)
    } else {
      if (provincias) setResultadosProvincias(provincias);
    }
  };

  const handleInputDepartamentoChange = (value: string) => {
    setInputValue(value);
    setInputValueDepartamento(value);
    const departamentosFiltrados = departamentos?.filter(departamento =>
      departamento.nombre.toLowerCase().includes(value.toLowerCase())
    );

    if (departamentosFiltrados && departamentosFiltrados.length > 1) {
      setResultadosDepartamentos(departamentosFiltrados);
    } else if (departamentosFiltrados && departamentosFiltrados.length === 1) {
      setResultadosDepartamentos([]);
      cargarLocalidades(departamentosFiltrados[0].id)
    } else {
      if (departamentos) setResultadosDepartamentos(departamentos);
    }
  };

  const handleInputLocalidadChange = (value: string) => {
    setInputValue(value);
    setInputValueLocalidad(value);

    const localidadesFiltradas = localidades?.filter(localidad =>
      localidad.nombre.toLowerCase().includes(value.toLowerCase())
    );

    if (localidadesFiltradas && localidadesFiltradas.length > 1) {
      setResultadosLocalidades(localidadesFiltradas);
    } else if (localidadesFiltradas && localidadesFiltradas.length === 1) {
      setResultadosLocalidades([]);
      setLocalidadDomicilioSucursal(localidadesFiltradas[0].id)
    } else {
      if (localidades) setResultadosLocalidades(localidades);
    }
  };

  async function agregarEmpleado() {
    // Verificar si todos los campos requeridos están llenos
    if (!nombre || !email || !contraseña || !telefono || !cuil || !fechaNacimiento || !calle || !numeroCalle || !codigoPostal || !idLocalidadDomicilioSucursal) {
      // Mostrar un mensaje de error o realizar alguna acción apropiada
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

    const empleado = new Empleado();

    empleado.nombre = nombre;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = telefono;
    empleado.cuil = cuil;
    empleado.fechaNacimiento = fechaNacimiento;
    empleado.privilegios = 'COCINERO';

    const sucursalStr = localStorage.getItem('usuario');
    const sucursal = sucursalStr ? JSON.parse(sucursalStr) : new Sucursal();
    empleado.sucursal = sucursal;

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;
    const localidad = localidades?.find(localidad => localidad.id === idLocalidadDomicilioSucursal);
    domicilio.localidad = localidad

    empleado.domicilios.push(domicilio);
    
    toast.promise(EmpleadoService.createEmpleado(empleado), {
      loading: 'Creando empleado...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster />
      <br />
      <form>
        <input required type="text" placeholder="Nombre del empleado" id="nombreEmpleado" onChange={(e) => { setNombre(e.target.value) }} />
        <br />
        <input required type="text" placeholder="Email del empleado" id="emailEmpleado" onChange={(e) => { setEmail(e.target.value) }} />
        <br />
        <input required type="text" placeholder="Cuil del empleado" id="cuilEmpleado" onChange={(e) => { setCuit(e.target.value) }} />
        <br />
        <input required type="text" placeholder="Contraseña del empleado" id="contraseñaEmpleado" onChange={(e) => { setContraseña(e.target.value) }} />
        <br />
        <input required type="text" placeholder="Telefono del empleado" id="telefonoEmpleado" onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
        <br />
        <input required type="date" placeholder="Fecha de nacimiento" onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
        <br />
        <input
          type="text"
          name="calle"
          onChange={(e) => { setCalle(e.target.value) }}
          required
          placeholder="Nombre de calle"
        />
        <br />
        <input
          type="text"
          name="numeroCalle"
          onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }}
          required
          placeholder="Número de domicilio"
        />
        <br />
        <input
          type="text"
          name="codigoPostal"
          onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
          required
          placeholder="Codigo Postal"
        />
        <br />
        <h2>Provincia</h2>
        <input
          value={inputValueProvincia}
          type="text"
          required
          onClick={() => {
            handleInputProvinciaChange('');
          }}
          onChange={(e) => { handleInputProvinciaChange(e.target.value) }}
          placeholder="Buscar provincia..."
        />
        <ul className='lista-recomendaciones'>
          {resultadosProvincias?.map((provincia, index) => (
            <li className='opcion-recomendada' key={index} onClick={() => {
              setInputValueProvincia(provincia.nombre)
              setResultadosProvincias([])
              cargarDepartamentos(provincia.id)
              handleInputProvinciaChange(provincia.nombre);
            }}>
              {provincia.nombre}
            </li>
          ))}
        </ul>
        <br />
        <h2>Departamento</h2>
        <input
          type="text"
          required
          onClick={() => {
            handleInputDepartamentoChange('');
          }}
          value={inputValueDepartamento}
          onChange={(e) => { handleInputDepartamentoChange(e.target.value) }}
          placeholder="Buscar departamento..."
        />
        <ul className='lista-recomendaciones'>
          {resultadosDepartamentos?.map((departamento, index) => (
            <li className='opcion-recomendada' key={index} onClick={() => {
              setInputValueDepartamento(departamento.nombre)
              setResultadosDepartamentos([])
              cargarLocalidades(departamento.id)
              handleInputDepartamentoChange(departamento.nombre);
            }}>
              {departamento.nombre}
            </li>))}
        </ul>
        <br />
        <h2>Localidad</h2>
        <input
          type="text"
          value={inputValueLocalidad}
          required
          onClick={() => {
            handleInputLocalidadChange('');
          }}
          onChange={(e) => { handleInputLocalidadChange(e.target.value) }}
          placeholder="Buscar localidad..."
        />
        <ul className='lista-recomendaciones'>
          {resultadosLocalidades?.map((localidad, index) => (
            <li className='opcion-recomendada' key={index} onClick={() => {
              setInputValueLocalidad(localidad.nombre)
              setResultadosLocalidades([])
              setLocalidadDomicilioSucursal(localidad.id)
              handleInputLocalidadChange(localidad.nombre);
            }}>
              {localidad.nombre}
            </li>
          ))}
        </ul>
        <button className='button-form' type='button' onClick={agregarEmpleado}>Agregar empleado</button>
      </form>
    </div>
  )
}

export default AgregarEmpleado
