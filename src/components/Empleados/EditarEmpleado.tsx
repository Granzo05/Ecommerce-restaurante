import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { LocalidadService } from '../../services/LocalidadService';
import { Toaster, toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Localidad } from '../../types/Domicilio/Localidad';
import { Domicilio } from '../../types/Domicilio/Domicilio';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [email, setEmail] = useState(empleadoOriginal.nombre);
  const [cuil, setCuit] = useState(empleadoOriginal.nombre);
  const [contraseña, setContraseña] = useState(empleadoOriginal.nombre);
  const [telefono, setTelefono] = useState(empleadoOriginal.nombre);
  const [fechaNacimiento, setFechaNacimiento] = useState(empleadoOriginal.nombre);
  const [calle, setCalle] = useState(empleadoOriginal.nombre);
  const [numeroCalle, setNumeroCalle] = useState(empleadoOriginal.nombre);
  const [codigoPostal, setCodigoPostal] = useState(empleadoOriginal.nombre);

  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 5000);

  const [, setInputValueProvincia] = useState('');
  const [, setInputValueDepartamento] = useState('');
  const [, setInputValueLocalidad] = useState('');

  const [resultadosProvincias, setResultadosProvincias] = useState<Provincia[]>([]);
  const [resultadosDepartamentos, setResultadosDepartamentos] = useState<Departamento[]>([]);
  const [resultadosLocalidades, setResultadosLocalidades] = useState<Localidad[]>([]);

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
      setResultadosProvincias(provinciasFiltradas);
      cargarDepartamentos(provinciasFiltradas[0].id)
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
      setResultadosDepartamentos(departamentosFiltrados);
      cargarLocalidades(departamentosFiltrados[0].id)
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
      setResultadosLocalidades(localidadesFiltradas);
      setLocalidadDomicilioSucursal(localidadesFiltradas[0].id)
    }
  };

  async function editarEmpleado() {
    let domicilios: Domicilio[] = empleadoOriginal.domicilios;

    let domicilio: Domicilio = domicilios[0];
    domicilio.calle = calle;
    domicilio.numero = parseInt(numeroCalle);
    domicilio.codigoPostal = parseInt(codigoPostal);

    let localidad = localidades?.find(localidades => localidades.id === idLocalidadDomicilioSucursal);
    domicilio.localidad = localidad;

    const empleadoActualizado: Empleado = {
      ...empleadoOriginal,
      nombre,
      email,
      cuil,
      contraseña,
      fechaNacimiento: new Date(fechaNacimiento),
      telefono: parseInt(telefono),
      domicilios: domicilios
    };

    toast.promise(EmpleadoService.updateEmpleado(empleadoActualizado), {
      loading: 'Actualizando empleado...',
      success: () => {
        return `Empleado actualizado correctamente`;
      },
      error: 'Error',
    });
  }

  return (
    <div className="modal-info">
      <Toaster />
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Nombre del empleado" value={empleadoOriginal.nombre} onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Email del empleado" value={empleadoOriginal.email} onChange={(e) => { setEmail(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cuil del empleado" value={empleadoOriginal.cuil} onChange={(e) => { setCuit(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Contraseña del empleado" onChange={(e) => { setContraseña(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Telefono del empleado" value={empleadoOriginal.telefono} onChange={(e) => { setTelefono(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={fechaNacimiento ? fechaNacimiento.toString() : ''}
          onChange={(e) => {
            setFechaNacimiento(e.target.value)
          }}
        />
      </label>
      <br />

      <input
        type="text"
        name="calle"
        onChange={(e) => { setCalle(e.target.value) }}
        required
        value={empleadoOriginal.domicilios[0].calle}
        placeholder="Nombre de calle"
      />
      <br />
      <input
        type="text"
        name="numeroCalle"
        onChange={(e) => { setNumeroCalle(e.target.value) }}
        required
        value={empleadoOriginal.domicilios[0].numero}
        placeholder="Número de domicilio"
      />
      <br />
      <input
        type="text"
        name="codigoPostal"
        onChange={(e) => { setCodigoPostal(e.target.value) }}
        required
        value={empleadoOriginal.domicilios[0].codigoPostal}
        placeholder="Codigo Postal"
      />
      <br />
      <h2>Provincia</h2>
      <input
        value={empleadoOriginal.domicilios[0].localidad?.departamento.provincia?.nombre}
        type="text"
        onChange={(e) => { handleInputProvinciaChange(e.target.value) }}
        placeholder="Buscar provincia..."
      />
      <ul className='lista-recomendaciones'>
        {resultadosProvincias?.map((provincia, index) => (
          <li className='opcion-recomendada' key={index} onClick={() => {
            setInputValueProvincia(provincia.nombre)
            setResultadosProvincias([])
          }}>
            {provincia.nombre}
          </li>
        ))}
      </ul>
      <br />
      <h2>Departamento</h2>
      <input
        type="text"
        value={empleadoOriginal.domicilios[0].localidad?.departamento.nombre}
        onChange={(e) => { handleInputDepartamentoChange(e.target.value) }}
        placeholder="Buscar departamento..."
      />
      <ul className='lista-recomendaciones'>
        {resultadosDepartamentos?.map((departamento, index) => (
          <li className='opcion-recomendada' key={index} onClick={() => {
            setInputValueDepartamento(departamento.nombre)
            setResultadosDepartamentos([])
            cargarLocalidades(departamento.id)
          }}>
            {departamento.nombre}
          </li>))}
      </ul>

      <br />
      <h2>Localidad</h2>
      <input
        type="text"
        value={empleadoOriginal.domicilios[0].localidad?.nombre}
        onChange={(e) => { handleInputLocalidadChange(e.target.value) }}
        placeholder="Buscar localidad..."
      />
      <ul className='lista-recomendaciones'>
        {resultadosLocalidades?.map((localidad, index) => (
          <li className='opcion-recomendada' key={index} onClick={() => {
            setInputValueLocalidad(localidad.nombre)
            setResultadosLocalidades([])
            setLocalidadDomicilioSucursal(localidad.id)
          }}>
            {localidad.nombre}
          </li>
        ))}
      </ul>
      <input type="button" value="Editar empleado" onClick={editarEmpleado} />
    </div>
  )
}

export default EditarEmpleado;

