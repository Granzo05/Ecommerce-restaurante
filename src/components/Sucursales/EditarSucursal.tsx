import { useEffect, useState } from 'react';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Toaster, toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks';
import { LocalidadService } from '../../services/LocalidadService';
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';

interface EditarSucursalProps {
  sucursalOriginal: Sucursal;
}

const EditarEmpleado: React.FC<EditarSucursalProps> = ({ sucursalOriginal }) => {
  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState(sucursalOriginal.email);
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState(sucursalOriginal.domicilio?.calle);
  const [numeroCalle, setNumeroCalle] = useState(sucursalOriginal.domicilio?.numero);
  const [codigoPostal, setCodigoPostal] = useState(sucursalOriginal.domicilio?.codigoPostal);
  const [telefono, setTelefono] = useState(sucursalOriginal.telefono);
  const [horarioApertura, setHorarioApertura] = useState(sucursalOriginal.horarioApertura);
  const [horarioCierre, setHorarioCierre] = useState(sucursalOriginal.horarioCierre);

  const [inputValue, setInputValue] = useState('');
  const debouncedInputValue = useDebounce(inputValue, 5000);

  const [inputValueProvincia, setInputValueProvincia] = useState(sucursalOriginal.domicilio?.localidad?.departamento?.provincia?.nombre);
  const [inputValueDepartamento, setInputValueDepartamento] = useState(sucursalOriginal.domicilio?.localidad?.departamento?.nombre);
  const [inputValueLocalidad, setInputValueLocalidad] = useState(sucursalOriginal.domicilio?.localidad?.nombre);

  const [resultadosProvincias, setResultadosProvincias] = useState<Provincia[]>([]);
  const [resultadosDepartamentos, setResultadosDepartamentos] = useState<Departamento[]>([]);
  const [resultadosLocalidades, setResultadosLocalidades] = useState<Localidad[]>([]);
  // Cargamos los departamentos de la provincia elegida en el select
  const [departamentos, setDepartamentos] = useState<Departamento[] | null>([]);
  // Cargamos las localidades disponibles, tanto para el domicilio de la sucursal como para los disponibles para el delivery
  //Select que nos permite filtrar para los departamentos de la sucursal asi no cargamos de más innecesariamente
  const [provincias, setProvincias] = useState<Provincia[] | null>([]);
  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  const [idLocalidadDomicilioSucursal, setLocalidadDomicilioSucursal] = useState<number>(0)
  // Array que va guardando las checkboxes con los departamentos donde la sucursal hace delivery
  const [idDepartamentosElegidos, setDepartamentosDisponibles] = useState<Set<number>>(new Set<number>());
  // Array que va guardando las checkboxes con las localidades donde la sucursal hace delivery
  const [idLocalidadesElegidas, setLocalidadesDisponibles] = useState<Set<number>>(new Set<number>());

  let [localidadesMostrablesCheckbox,] = useState<Localidad[] | null>([]);

  const [loadingLocalidadesDelivery, setLoadingLocalidadesDelivery] = useState(false);

  useEffect(() => {
    if (departamentos?.length === 0 && sucursalOriginal.domicilio?.localidad?.departamento?.provincia?.id) {
      cargarDepartamentos(sucursalOriginal.domicilio?.localidad?.departamento?.provincia?.id);
    }

    // Solo ejecuta cargarLocalidadesDelivery si no está en proceso de carga
    if (!loadingLocalidadesDelivery && localidades?.length === 0) {
      cargarLocalidadesDelivery();
      setLoadingLocalidadesDelivery(true);
    }

    if (inputValueProvincia) cargarProvincias();
  }, [inputValueProvincia]);

  async function cargarLocalidadesDelivery() {
    try {
      let localidadesDelivery = await LocalidadService.getLocalidadesDeliveryByIdSucursal(sucursalOriginal.id);
      if (localidadesDelivery) {
        const departamentosProcesados = new Set<number>();
        localidadesDelivery.forEach(delivery => {
          if (delivery.localidad?.id) idLocalidadesElegidas.add(delivery.localidad?.id);
          if (delivery.localidad?.departamento?.id) {
            const departamentoId = delivery.localidad.departamento.id;
            if (!departamentosProcesados.has(departamentoId)) {
              departamentosProcesados.add(departamentoId);
              idDepartamentosElegidos.add(delivery.localidad?.departamento.id);
              cargarLocalidades(departamentoId);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error al cargar localidades:', error);
    }
  }


  useEffect(() => {
    // Si se deja de escribir de borran todas las recomendaciones
    setResultadosDepartamentos([])
    setResultadosLocalidades([])
    setResultadosProvincias([])
  }, [debouncedInputValue]);

  const handleDepartamentosCheckboxChange = async (departamentoId: number) => {
    // Obtener una copia del conjunto de departamentos seleccionados
    const updatedSelectedDepartamentos = new Set<number>(idDepartamentosElegidos);

    // Alternar el estado del departamento
    if (updatedSelectedDepartamentos.has(departamentoId)) {
      updatedSelectedDepartamentos.delete(departamentoId);

      
      if (localidades) {
        localidades.forEach(localidad => {
          if (localidad.departamento?.id === departamentoId) {
            idLocalidadesElegidas.delete(localidad.id);
          }
        });
      }

    } else {
      updatedSelectedDepartamentos.add(departamentoId);
    }

    // Actualizar el conjunto de departamentos seleccionados
    setDepartamentosDisponibles(updatedSelectedDepartamentos);

    let nuevasLocalidades: Localidad[] = [];
    // Iterar sobre los departamentos seleccionados y cargar las localidades correspondientes
    for (const idDepartamento of updatedSelectedDepartamentos) {
      nuevasLocalidades.push(...await cargarLocalidadesCheckBox(idDepartamento));
    }
    console.log(nuevasLocalidades)
    setLocalidades(nuevasLocalidades);
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
    try {
      const localidadesDB = await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento);

      // Filtrar localidadesDB para excluir las localidades que ya están en localidades
      const nuevasLocalidades = localidadesDB.filter(localidadDB => {
        return !localidades.some(localidad => localidad.id === localidadDB.id);
      });
      console.log(nuevasLocalidades)

      // Agregar las nuevas localidades al estado localidades
      setLocalidades(prevLocalidades => [...prevLocalidades, ...nuevasLocalidades]);
    } catch (error) {
      console.error('Error:', error);
    }
  }


  async function cargarLocalidadesCheckBox(idDepartamento: number): Promise<Localidad[]> {
    try {
      return await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento);
    } catch (error) {
      console.error('Error:', error);
    }
    return [];
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
      localidad?.nombre.toLowerCase().includes(value.toLowerCase())
    );

    if (localidadesFiltradas && localidadesFiltradas.length > 1) {
      setResultadosLocalidades(localidadesFiltradas);
    } else if (localidadesFiltradas && localidadesFiltradas.length === 1) {
      setResultadosLocalidades(localidadesFiltradas);
      setLocalidadDomicilioSucursal(localidadesFiltradas[0].id)
    }
  };

  async function editarSucursal() {
    let sucursalActualizada: Sucursal = sucursalOriginal;

    const domicilio = new Domicilio();

    if (calle) domicilio.calle = calle;
    if (numeroCalle) domicilio.numero = numeroCalle;
    if (codigoPostal) domicilio.codigoPostal = codigoPostal;

    const localidad = localidades?.find(localidad => localidad.id === idLocalidadDomicilioSucursal);
    domicilio.localidad = localidad

    sucursalActualizada.domicilio = domicilio;

    if (contraseña) sucursalActualizada.contraseña = contraseña;

    sucursalActualizada.telefono = telefono;

    sucursalActualizada.email = email;

    sucursalActualizada.horarioApertura = horarioApertura;

    sucursalActualizada.horarioCierre = horarioCierre;
    let localidadesDelivery: LocalidadDelivery[] = [];

    idLocalidadesElegidas.forEach(id => {
      let localidadBuscada = localidadesMostrablesCheckbox?.find(localidad => localidad.id === id);
      let localidadNueva: LocalidadDelivery = new LocalidadDelivery();

      if (localidadBuscada && localidadBuscada instanceof LocalidadDelivery) {
        localidadNueva = localidadBuscada;
        localidadesDelivery.push(localidadNueva);
      }
    });

    sucursalActualizada.localidadesDisponiblesDelivery = localidadesDelivery;


    toast.promise(await SucursalService.updateRestaurant(sucursalActualizada), {
      loading: 'Guardando sucursal...',
      success: () => {
        return `Sucursal añadida correctamente`;
      },
      error: 'Error',
    });
  }

  return (
    <div className='form-info'>
      <Toaster />

      <div>
        <h2>Crear una sucursal</h2>
        <div>
          <form>
            <input
              type="email"
              value={email}
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
              value={calle}
              name="calle"
              onChange={(e) => { setCalle(e.target.value) }}
              required
              placeholder="Nombre de calle"
            />
            <br />
            <input
              type="text"
              value={numeroCalle}
              name="numeroCalle"
              onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }}
              required
              placeholder="Número de domicilio"
            />
            <br />
            <input
              type="text"
              name="codigoPostal"
              value={codigoPostal}
              onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
              required
              placeholder="Codigo Postal"
            />
            <br />
            <input
              type="number"
              name="telefono"
              value={telefono}

              onChange={(e) => { setTelefono(parseInt(e.target.value)) }}
              required
              placeholder="Telefono"
            />
            <br />
            <input
              type="time"
              onChange={(e) => { setHorarioApertura(e.target.value) }}
              value={horarioApertura}

            />
            <input
              type="time"
              onChange={(e) => { setHorarioCierre(e.target.value) }}
              value={horarioCierre}

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
                  setLocalidadDomicilioSucursal(localidad.id)
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
            {localidades && (
              <div>
                {localidades.map((localidad, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      value={localidad.id}
                      checked={idLocalidadesElegidas.has(localidad.id)}
                      onChange={() => handleLocalidadesCheckboxChange(localidad.id)}
                    />
                    <label htmlFor={`localidad-${index}`}>{localidad?.nombre}</label>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={editarSucursal}>Actualizar</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarEmpleado;

