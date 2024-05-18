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
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';

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

  let [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Localidad[] | null>([]);

  useEffect(() => {
    cargarProvincias();
  }, []);

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

    setLocalidadesMostrables(nuevasLocalidades);
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
    let localidadesDelivery: LocalidadDelivery[] = [];

    idLocalidadesElegidas.forEach(id => {
      let localidadBuscada = localidadesMostrablesCheckbox?.find(localidad => localidad.id === id);
      let localidadNueva: LocalidadDelivery = new LocalidadDelivery();

      if (localidadBuscada) {
        localidadNueva.localidad = localidadBuscada;
        localidadesDelivery.push(localidadNueva);
      }
    });

    sucursal.localidadesDisponiblesDelivery = localidadesDelivery;


    toast.promise(SucursalService.createRestaurant(sucursal), {
      loading: 'Guardando sucursal...',
      success: () => {
        return `Sucursal añadida correctamente`;
      },
      error: 'Error',
    });

  };

  return (
    <div className='form-info'>
      <Toaster />
      <div>
        <h2>Crear una sucursal</h2>
        <div>
          <form>
            <div className="inputBox">
              <input type="email" required={true} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Correo electrónico</span>
            </div>
            <div className="inputBox">
              <input type="password" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
            </div>
            <div className="inputBox">
              <input type="text" required={true} onChange={(e) => { setCalle(e.target.value) }} />
              <span>Nombre de calle</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }} />
              <span>Número de domicilio</span>
            </div>

            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
              <span>Código Postal</span>
            </div>
            <div className="inputBox">
              <input type="phone" required={true} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Telefono</span>
            </div>
            <div className="inputBox">
              <input type="time" required={true} onChange={(e) => { setHorarioApertura(e.target.value) }} />
              <span>Horario de apertura</span>
            </div>
            <div className="inputBox">
              <input type="time" required={true} onChange={(e) => { setHorarioCierre(e.target.value) }} />
              <span>Horario de cierre</span>
            </div>
            <h2>Provincia</h2>
            <InputComponent placeHolder='Seleccionar provincia...' onInputClick={() => handleAbrirRecomendaciones('PROVINCIAS')} selectedProduct={inputProvincia ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={''} />}
            <br />
            <h2>Departamento</h2>
            <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => handleAbrirRecomendaciones('DEPARTAMENTOS')} selectedProduct={inputDepartamento ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={selectedOption} />}

            <br />
            <h2>Localidad</h2>
            <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => handleAbrirRecomendaciones('LOCALIDADES')} selectedProduct={inputLocalidad ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={selectedOption} />}


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
                {localidadesMostrablesCheckbox.map((localidad, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
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
