import { useEffect, useState } from 'react';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Toaster, toast } from 'sonner'
import { LocalidadService } from '../../services/LocalidadService';
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';

interface EditarSucursalProps {
  sucursalOriginal: Sucursal;
}

const EditarSucursal: React.FC<EditarSucursalProps> = ({ sucursalOriginal }) => {
  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState(sucursalOriginal.email);
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState(sucursalOriginal.domicilio?.calle);
  const [numeroCalle, setNumeroCalle] = useState(sucursalOriginal.domicilio?.numero);
  const [codigoPostal, setCodigoPostal] = useState(sucursalOriginal.domicilio?.codigoPostal);
  const [telefono, setTelefono] = useState(sucursalOriginal.telefono);
  const [horarioApertura, setHorarioApertura] = useState(sucursalOriginal.horarioApertura);
  const [horarioCierre, setHorarioCierre] = useState(sucursalOriginal.horarioCierre);

  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<LocalidadDelivery[] | null>(sucursalOriginal.localidadesDisponiblesDelivery);

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');
  const [inputProvincia, setInputProvincia] = useState<string | undefined>(sucursalOriginal.domicilio?.localidad?.departamento.provincia?.nombre);
  const [inputDepartamento, setInputDepartamento] = useState<string | undefined>(sucursalOriginal.domicilio?.localidad?.departamento?.nombre);
  const [inputLocalidad, setInputLocalidad] = useState<string | undefined>(sucursalOriginal.domicilio?.localidad?.nombre);

  const [idDepartamentosElegidos, setIdDepartamentosElegidos] = useState<Set<number>>(new Set<number>());

  const [idLocalidadesElegidas, setIdLocalidadesElegidas] = useState<Set<number>>(new Set<number>());

  useEffect(() => {
    if (inputProvincia)
      buscarDepartamentos(inputProvincia)
  }, [inputProvincia]);

  useEffect(() => {
    if (inputDepartamento)
    buscarLocalidades(inputDepartamento);
  }, [inputDepartamento]);

  function buscarDepartamentos(inputProvincia: string) {
    DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  function buscarLocalidades(inputDepartamento: string) {
    LocalidadService.getLocalidadesByNombreDepartamento(inputDepartamento)
      .then(async localidades => {
        setLocalidades(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  const handleSelectProduct = (option: string) => {
    setSelectedOption(option);
  };

  const handleAbrirRecomendaciones = (busqueda: string) => {
    setElementosABuscar(busqueda)
    setModalBusqueda(true);
  };

  const handleModalClose = () => {
    setModalBusqueda(false)
    if (elementosABuscar === 'PROVINCIAS') {
      setInputProvincia(selectedOption);
      setInputDepartamento('')
      setInputLocalidad('')
    } else if (elementosABuscar === 'DEPARTAMENTOS') {
      setInputDepartamento(selectedOption);
      setInputLocalidad('')
    } else if (elementosABuscar === 'LOCALIDADES') {
      setInputLocalidad(selectedOption);
    }
  };

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
    setIdDepartamentosElegidos(updatedSelectedDepartamentos);

    let nuevasLocalidades: LocalidadDelivery[] = [];
    // Iterar sobre los departamentos seleccionados y cargar las localidades correspondientes
    for (const idDepartamento of updatedSelectedDepartamentos) {
      let localidad = localidades.find(localidad => localidad.departamento.id === idDepartamento)

      if (localidad) nuevasLocalidades.push();
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
    setIdLocalidadesElegidas(updatedSelectedLocalidades);
  };

  const handleEditarNegocio = async () => {
    let sucursal: Sucursal = new Sucursal();

    const domicilio = new Domicilio();
    if (calle) domicilio.calle = calle;
    if (numeroCalle) domicilio.numero = numeroCalle;
    if (codigoPostal) domicilio.codigoPostal = codigoPostal;
    const localidad = localidades?.find(localidad => localidad.nombre === inputLocalidad);
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
        localidadNueva.localidad = localidadBuscada.localidad;
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
              <input type="email" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
              <span>Correo electrónico</span>
            </div>
            <div className="inputBox">
              <input type="password" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
              <span>Contraseña</span>
            </div>
            <div className="inputBox">
              <input type="phone" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
              <span>Telefono</span>
            </div>
            <div className="inputBox">
              <input type="time" required={true} value={horarioApertura} onChange={(e) => { setHorarioApertura(e.target.value) }} />
              <span>Horario de apertura</span>
            </div>
            <div className="inputBox">
              <input type="time" required={true} value={horarioCierre} onChange={(e) => { setHorarioCierre(e.target.value) }} />
              <span>Horario de cierre</span>
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
                    <label htmlFor={`localidad-${index}`}>{localidad.localidad?.nombre}</label>
                  </div>
                ))}
              </div>
            )}
            <button type="button" onClick={handleEditarNegocio}>Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarSucursal