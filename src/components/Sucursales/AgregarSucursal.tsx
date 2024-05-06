import { useEffect, useState } from 'react';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { LocalidadService } from '../../services/LocalidadService';
import { Toaster, toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks';
import './agregarSucursal.css'

function AgregarSucursal() {
  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 5000);

  const [inputValueProvincia, setInputValueProvincia] = useState('');
  const [inputValueDepartamento, setInputValueDepartamento] = useState('');
  const [inputValueLocalidad, setInputValueLocalidad] = useState('');

  const [resultadosProvincias, setResultadosProvincias] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
  const [resultadosDepartamentos, setResultadosDepartamentos] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
  const [resultadosLocalidades, setResultadosLocalidades] = useState<Departamento[] | Localidad[] | Provincia[]>([]);

  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);
  const [telefono, setTelefono] = useState(0);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre, setHorarioCierre] = useState('');

  // Cargamos los departamentos de la provincia elegida en el select
  const [departamentos, setDepartamentos] = useState<Departamento[] | null>([]);
  // Cargamos las localidades disponibles, tanto para el domicilio de la sucursal como para los disponibles para el delivery
  //Select que nos permite filtrar para los departamentos de la sucursal asi no cargamos de más innecesariamente
  const [provincias, setProvincias] = useState<Provincia[] | null>([]);
  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [localidades, setLocalidades] = useState<Localidad[] | null>([]);
  // Id de la localidad para el domicilio de la sucursal
  const [idLocalidadDomicilioSucursal, setLocalidadDomicilioSucursal] = useState<number>(0)
  // Array que va guardando las checkboxes con los departamentos donde la sucursal hace delivery
  const [idDepartamentosElegidos, setDepartamentosDisponibles] = useState<Set<number>>(new Set<number>());
  // Array que va guardando las checkboxes con las localidades donde la sucursal hace delivery
  const [idLocalidadesElegidas, setLocalidadesDisponibles] = useState<Set<number>>(new Set<number>());

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Set<Localidad>>(new Set<Localidad>());

  useEffect(() => {
    cargarProvincias();
  }, []);

  useEffect(() => {
    // Si se deja de escribir de borran todas las recomendaciones
    setResultadosDepartamentos([])
    setResultadosLocalidades([])
    setResultadosProvincias([])
  }, [debouncedInputValue]);

  const handleDepartamentosCheckboxChange = (departamentoId: number) => {
    const updatedSelectedDepartamentos = new Set<number>(idDepartamentosElegidos);

    if (updatedSelectedDepartamentos.has(departamentoId)) {
      updatedSelectedDepartamentos.delete(departamentoId);
    } else {
      updatedSelectedDepartamentos.add(departamentoId);
    }
    console.log(updatedSelectedDepartamentos)
    Array.from(updatedSelectedDepartamentos).forEach(idDepartamentos => {
      cargarLocalidadesCheckBox(idDepartamentos);
    });

    setDepartamentosDisponibles(updatedSelectedDepartamentos);
  };


  const handleLocalidadesCheckboxChange = (localidadId: number) => {
    const updatedSelectedLocalidades = new Set(idLocalidadesElegidas);
    if (updatedSelectedLocalidades.has(localidadId)) {
      updatedSelectedLocalidades.delete(localidadId);
    } else {
      updatedSelectedLocalidades.add(localidadId);
    }
    setLocalidadesDisponibles(updatedSelectedLocalidades);
  };

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

  async function cargarLocalidadesCheckBox(idDepartamento: number) {
    try {
      const localidades = await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento);

      const localidadesSet = new Set(localidades);

      setLocalidadesMostrables(localidadesSet);
    } catch (error) {
      console.error('Error:', error);
    }
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


  const handleCargarNegocio = async () => {
    let sucursal: Sucursal = new Sucursal();

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;
    const localidad = localidades?.find(localidad => localidad.id === idLocalidadDomicilioSucursal);
    domicilio.localidad = localidad
    sucursal.domicilio = domicilio;

    sucursal.contraseña = contraseña;

    sucursal.telefono = telefono;

    sucursal.email = email;

    sucursal.horarioApertura = horarioApertura;

    sucursal.horarioCierre = horarioCierre;

    let localidadesDisponiblesDelivery: Localidad[] = [];

    idDepartamentosElegidos.forEach(id => {
      const localidad = localidades?.find(localidad => localidad.id === id);

      if (localidad) localidadesDisponiblesDelivery.push(localidad);
    });

    sucursal.localidadesDisponiblesDelivery = localidadesDisponiblesDelivery;

    console.log(sucursal)

    /*
    toast.promise(SucursalService.createRestaurant(sucursal), {
      loading: 'Guardando sucursal...',
      success: () => {
        return `Sucursal añadida correctamente`;
      },
      error: 'Error',
    });
    */
  };

  return (
    <div className='form-info'>
      <Toaster />

      <div>
        <h2>Crear una sucursal</h2>
        <div>
          <form>
            <input
              type="email"
              name="email"
              onChange={(e) => { setEmail(e.target.value) }}
              required
              placeholder="Correo electrónico"
            />
            <br />
            <input
              type="password"
              name="contraseña"

              onChange={(e) => { setContraseña(e.target.value) }}
              required
              placeholder="Contraseña"
            />
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
            <input
              type="number"
              name="telefono"

              onChange={(e) => { setTelefono(parseInt(e.target.value)) }}
              required
              placeholder="Telefono"
            />
            <br />
            <input
              type="time"
              onChange={(e) => { setHorarioApertura(e.target.value) }}
            />
            <input
              type="time"
              onChange={(e) => { setHorarioCierre(e.target.value) }}
            />
            <h2>Provincia</h2>
            <input
              value={inputValueProvincia}
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
                }}>
                  {departamento.nombre}
                </li>))}
            </ul>

            <br />
            <h2>Localidad</h2>
            <input
              type="text"
              value={inputValueLocalidad}
              onChange={(e) => { handleInputLocalidadChange(e.target.value) }}
              placeholder="Buscar localidad..."
            />
            <ul className='lista-recomendaciones'>
              {resultadosLocalidades?.map((localidad, index) => (
                <li className='opcion-recomendada' key={index} onClick={() => {
                  setInputValueLocalidad(localidad.nombre)
                  setResultadosLocalidades([])
                }}>
                  {localidad.nombre}
                </li>
              ))}
            </ul>

            <h3>Departamentos disponibles para delivery: </h3>
            {departamentos && (
              <div>
                {departamentos.map((departamento, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={`localidad-${index}`}
                      value={departamento.id}
                      checked={idDepartamentosElegidos.has(departamento.id)}
                      onChange={() => handleDepartamentosCheckboxChange(departamento.id)}
                    />
                    <label htmlFor={`departamento-${index}`}>{departamento.nombre}</label>
                  </div>
                ))}
              </div>
            )}

            <h3>Localidades disponibles para delivery: </h3>
            {localidadesMostrablesCheckbox && (
              <div>
                {Array.from(localidadesMostrablesCheckbox).map((localidad, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={`localidad-${index}`}
                      value={localidad.id}
                      checked={idLocalidadesElegidas.has(localidad.id)}
                      onChange={() => handleLocalidadesCheckboxChange(localidad.id)}
                    />
                    <label htmlFor={`localidad-${index}`}>{localidad.nombre}</label>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={handleCargarNegocio}>Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AgregarSucursal
