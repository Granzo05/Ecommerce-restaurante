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
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';

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

  const [loadingLocalidadesDelivery, setLoadingLocalidadesDelivery] = useState(false);

  useEffect(() => {
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

    sucursalActualizada.contraseña = contraseña;

    sucursalActualizada.horarioCierre = horarioCierre;
    let localidadesDelivery: LocalidadDelivery[] = [];

    idLocalidadesElegidas.forEach(id => {
      let localidadBuscada = localidades?.find(localidad => localidad.id === id);
      let localidadNueva: LocalidadDelivery = new LocalidadDelivery();

      if (localidadBuscada) {
        localidadNueva.localidad = localidadBuscada;
        localidadesDelivery.push(localidadNueva);
      }
    });

    sucursalActualizada.localidadesDisponiblesDelivery = localidadesDelivery;

    toast.promise(SucursalService.updateRestaurant(sucursalActualizada), {
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
            <div className="inputBox">
              <input type="email" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Correo electrónico</span>
            </div>
            <div className="inputBox">
              <input type="password" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
            </div>
            <div className="inputBox">
              <input type="text" required={true} value={calle} onChange={(e) => { setCalle(e.target.value) }} />
              <span>Nombre de calle</span>
            </div>

            <div className="inputBox">
              <input type="number" required={true} value={numeroCalle} onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }} />
              <span>Número de domicilio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={codigoPostal} onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
              <span>Código Postal</span>
            </div>

            <div className="inputBox">
              <input type="number" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Teléfono</span>
            </div>

            <div className="inputBox">
              <input type="time" required={true} value={horarioApertura} onChange={(e) => { setHorarioApertura(e.target.value) }} />
              <span>Horario apertura</span>
            </div>

            <div className="inputBox">
              <input type="time" required={true} value={horarioCierre} onChange={(e) => { setHorarioCierre(e.target.value) }} />
              <span>Horario cierre</span>
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

