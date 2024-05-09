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
import { Domicilio } from '../../types/Domicilio/Domicilio';

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

  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [domicilioModificable, setDomicilioModificable] = useState<Domicilio>(empleadoOriginal.domicilios[indexDomicilio]);
  const [domicilios, setDomicilios] = useState(empleadoOriginal.domicilios);

  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 5000);

  const [inputValueProvincia, setInputValueProvincia] = useState(empleadoOriginal.domicilios[indexDomicilio].localidad?.departamento.provincia?.nombre);
  const [inputValueDepartamento, setInputValueDepartamento] = useState(empleadoOriginal.domicilios[indexDomicilio].localidad?.departamento.nombre);
  const [inputValueLocalidad, setInputValueLocalidad] = useState(empleadoOriginal.domicilios[indexDomicilio].localidad?.nombre);

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
    handleDomilicio(indexDomicilio)
    cargarProvincias();
    cargarSucursales();
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

  function handleChangeLocalidad(nombreLocalidad: string, index: number) {
    setInputValueLocalidad(nombreLocalidad);
    let localidad = localidades?.find(localidad => localidad.nombre === nombreLocalidad);
    if (localidad) domicilios[index].localidad = localidad;
  }

  const handleDomilicio = (value: number) => {
    setIndexDomicilio(value);
    let domicilio = domicilios[value];

    setDomicilioModificable(domicilio);
  };

  const handleInputProvinciaChange = (value: string) => {
    if (value.length === 0) {
      setInputValueDepartamento('');
      setInputValueLocalidad('')
    }

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
    }
  };

  const handleInputDepartamentoChange = (value: string) => {
    if (value.length === 0) {
      setInputValueLocalidad('')
    }

    setInputValue(value);
    setInputValueDepartamento(value);

    const departamentosFiltrados = departamentos?.filter(departamento =>
      departamento.nombre.toLowerCase().includes(value.toLowerCase())
    );

    if (departamentosFiltrados && departamentosFiltrados.length > 1) {
      setResultadosDepartamentos(departamentosFiltrados);
    } else if (departamentosFiltrados && [departamentosFiltrados].length === 1) {
      setResultadosDepartamentos([]);
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
    } else {
      if (localidades) setResultadosLocalidades(localidades);
    }
  };

  function handleChangeCalle(calle: string, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.calle = calle;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].calle = calle;
      return newDomicilios;
    });
  }

  function handleChangeNumeroCasa(numero: number, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.numero = numero;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].numero = numero;
      return newDomicilios;
    });
  }

  function handleChangeCodigoPostal(codigo: number, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.codigoPostal = codigo;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].codigoPostal = codigo;
      return newDomicilios;
    });
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

      <select
        name="domicilio"
        id=""
        onChange={(e) => handleDomilicio(parseInt(e.target.value))}
        value={indexDomicilio}
      >
        {empleadoOriginal.domicilios &&
          empleadoOriginal.domicilios.map((domicilio, index) => (
            <option key={index} value={index}>
              Domicilio {domicilio.calle}, {domicilio.localidad?.nombre}
            </option>
          ))}
      </select>

      <div>
        <h3>Domicilio {indexDomicilio + 1}</h3>
        <input
          value={inputValueProvincia}
          type="text"
          onChange={(e) => {
            handleInputProvinciaChange(e.target.value);
          }}
          placeholder="Buscar provincia..."
        />
        <ul className="lista-recomendaciones">
          {resultadosProvincias?.map((provincia, index) => (
            <li
              className="opcion-recomendada"
              key={index}
              onClick={() => {
                setInputValueProvincia(provincia.nombre);
                setResultadosProvincias([]);
                cargarDepartamentos(provincia.id)
                handleInputProvinciaChange(provincia.nombre);
              }}
            >
              {provincia.nombre}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={inputValueDepartamento}
          onClick={() => {
            handleInputDepartamentoChange('');
          }}
          onChange={(e) => {
            handleInputDepartamentoChange(e.target.value);
          }}
          placeholder="Buscar departamento..."
        />
        <ul className="lista-recomendaciones">
          {resultadosDepartamentos?.map((departamento, index) => (
            <li
              className="opcion-recomendada"
              key={index}
              onClick={() => {
                setInputValueDepartamento(departamento.nombre);
                setResultadosDepartamentos([]);
                cargarLocalidades(departamento.id);
                handleInputDepartamentoChange(departamento.nombre);
              }}
            >
              {departamento.nombre}
            </li>
          ))}
        </ul>
        <input
          type="text"
          value={inputValueLocalidad}
          onClick={() => {
            handleInputLocalidadChange('');
          }}
          onChange={(e) => {
            handleInputLocalidadChange(e.target.value);
          }}
          placeholder="Buscar localidad..."
        />
        <ul className="lista-recomendaciones">
          {resultadosLocalidades?.map((localidad, index) => (
            <li
              className="opcion-recomendada"
              key={index}
              onClick={() => {
                setResultadosLocalidades([]);
                handleChangeLocalidad(localidad.nombre, indexDomicilio);
              }}
            >
              {localidad.nombre}
            </li>
          ))}
        </ul>
        <input
          type="text"
          name="calle"
          onChange={(e) => {
            handleChangeCalle(e.target.value, indexDomicilio);
          }}
          required
          value={domicilioModificable?.calle}
          placeholder="Nombre de calle"
        />
        <br />
        <input
          type="number"
          name="numeroCalle"
          onChange={(e) => {
            handleChangeNumeroCasa(parseInt(e.target.value), indexDomicilio);
          }}
          required
          value={domicilioModificable?.numero}
          placeholder="Número de domicilio"
        />
        <br />
        <input
          type="number"
          name="codigoPostal"
          onChange={(e) => {
            handleChangeCodigoPostal(parseInt(e.target.value), indexDomicilio);
          }}
          required
          value={domicilioModificable?.codigoPostal}
          placeholder="Codigo Postal"
        />
        <br />
      </div>

      <br />
      <label htmlFor="sucursal">Sucursal: </label>
      <select name="sucursal" id="sucursal" value={sucursalId} onChange={(e) => setSucursalId(parseInt(e.target.value))}>
        {sucursales && sucursales.map(sucursal => (
          <option key={sucursal.id} value={sucursal.id}>{sucursal.domicilio?.localidad?.nombre}</option>
        ))}
      </select>
      <br />
      <br />
      <button className='button-form' onClick={editarEmpleado}>Editar empleado</button>
    </div>
  )
}

export default EditarEmpleado;

