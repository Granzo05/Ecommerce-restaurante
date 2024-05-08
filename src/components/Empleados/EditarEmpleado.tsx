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
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [email, setEmail] = useState(empleadoOriginal.email);
  const [cuil, setCuit] = useState(empleadoOriginal.cuil);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(empleadoOriginal.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date(empleadoOriginal.fechaNacimiento));
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalId, setSucursalId] = useState(empleadoOriginal.sucursal?.id);
  const [domicilios,] = useState(empleadoOriginal.domicilios);

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

  useEffect(() => {
    cargarProvincias();
    cargarSucursales();
    console.log(empleadoOriginal)
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

  async function cargarSucursales() {
    await SucursalService.getSucursales()
      .then(data => {
        setSucursales(data);
        console.log(data)
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
    }
  };

  function handleChangeCalle(calle: string, index: number) {
    domicilios[index].calle = calle;
  }

  function handleChangeNumeroCasa(numero: number, index: number) {
    domicilios[index].numero = numero;
  }

  function handleChangeCodigoPostal(codigo: number, index: number) {
    domicilios[index].codigoPostal = codigo;
  }

  function handleChangeLocalidad(idLocalidad: number, index: number) {
    let localidad = localidades?.find(localidad => localidad.id === idLocalidad);
    if (localidad) domicilios[index].localidad = localidad;
  }

  function handleChangeProvincia(idProvincia: number, index: number) {
    let provincia = provincias?.find(provincia => provincia.id === idProvincia);
    if (provincia && domicilios[index].localidad) domicilios[index].localidad.departamento.provincia = provincia;
  }

  function handleChangeDepartamento(idDepartamento: number, index: number) {
    let departamento = departamentos?.find(departamento => departamento.id === idDepartamento);
    if (departamento && domicilios[index].localidad) domicilios[index].localidad.departamento = departamento;
  }

  async function editarEmpleado() {

    const empleadoActualizado: Empleado = {
      ...empleadoOriginal,
      nombre,
      email,
      cuil,
      contraseña,
      fechaNacimiento: new Date(fechaNacimiento),
      telefono,
      domicilios
    };

    console.log(empleadoOriginal)
    console.log(empleadoActualizado)
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
        <input type="text" placeholder="Nombre del empleado" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Email del empleado" value={email} onChange={(e) => { setEmail(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Cuil del empleado" value={cuil} onChange={(e) => { setCuit(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Contraseña del empleado" onChange={(e) => { setContraseña(e.target.value) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input type="text" placeholder="Telefono del empleado" value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
      </label>
      <br />
      <label>
        <i className='bx bx-lock'></i>
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          value={fechaNacimiento.toISOString().split('T')[0]}
          onChange={(e) => {
            setFechaNacimiento(new Date(e.target.value))
          }}
        />
      </label>
      <br />

      {empleadoOriginal.domicilios && empleadoOriginal.domicilios.map((domicilio, index) => (
        <div key={index}>
          <h3>Domicilio {index + 1}</h3>
          <input
            value={domicilio.localidad?.departamento.provincia?.nombre}
            type="text"
            onChange={(e) => { handleInputProvinciaChange(e.target.value) }}
            placeholder="Buscar provincia..."
          />
          <ul className='lista-recomendaciones'>
            {resultadosProvincias?.map((provincia, index) => (
              <li className='opcion-recomendada' key={index} onClick={() => {
                setInputValueProvincia(provincia.nombre)
                setResultadosProvincias([])
                handleChangeProvincia(provincia.id, index)

              }}>
                {provincia.nombre}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={domicilio.localidad?.departamento.nombre}
            onChange={(e) => { handleInputDepartamentoChange(e.target.value) }}
            placeholder="Buscar departamento..."
          />
          <ul className='lista-recomendaciones'>
            {resultadosDepartamentos?.map((departamento, index) => (
              <li className='opcion-recomendada' key={index} onClick={() => {
                setInputValueDepartamento(departamento.nombre)
                setResultadosDepartamentos([])
                cargarLocalidades(departamento.id)
                handleChangeDepartamento(departamento.id, index)
              }}>
                {departamento.nombre}
              </li>))}
          </ul>
          <input
            type="text"
            value={domicilio.localidad?.nombre}
            onChange={(e) => { handleInputLocalidadChange(e.target.value) }}
            placeholder="Buscar localidad..."
          />
          <ul className='lista-recomendaciones'>
            {resultadosLocalidades?.map((localidad, index) => (
              <li className='opcion-recomendada' key={index} onClick={() => {
                setInputValueLocalidad(localidad.nombre)
                setResultadosLocalidades([])
                handleChangeLocalidad(localidad.id, index)
              }}>
                {localidad.nombre}
              </li>
            ))}
          </ul>
          <input
            type="text"
            name="calle"
            onChange={(e) => { handleChangeCalle(e.target.value, index) }}
            required
            value={domicilio.calle}
            placeholder="Nombre de calle"
          />
          <br />
          <input
            type="number"
            name="numeroCalle"
            onChange={(e) => { handleChangeNumeroCasa(parseInt(e.target.value), index) }}
            required
            value={domicilio.numero}
            placeholder="Número de domicilio"
          />
          <br />
          <input
            type="number"
            name="codigoPostal"
            onChange={(e) => { handleChangeCodigoPostal(parseInt(e.target.value), index) }}
            required
            value={domicilio.codigoPostal}
            placeholder="Codigo Postal"
          />
          <br />
        </div>
      ))}
      <select name="sucursal" id="sucursal" value={sucursalId} onChange={(e) => setSucursalId(parseInt(e.target.value))}>
        {sucursales && sucursales.map(sucursal => (
          <option key={sucursal.id} value={sucursal.id}>{sucursal.domicilio?.localidad?.nombre}</option>
        ))}
      </select>


      <button className='button-form' onClick={editarEmpleado}>Editar empleado</button>
    </div>
  )
}

export default EditarEmpleado;

