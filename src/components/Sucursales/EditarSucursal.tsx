import { useEffect, useState } from 'react';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import { DepartamentoService } from '../../services/DepartamentoService';
import { LocalidadService } from '../../services/LocalidadService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { clearInputs } from '../../utils/global_variables/functions';

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
  const [localidadesProvincia, setLocalidadesProvincia] = useState<Localidad[]>([]);

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Localidad[]>([]);

  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');
  const [inputProvincia, setInputProvincia] = useState<string>(sucursalOriginal.domicilio?.localidad?.departamento.provincia?.nombre);
  const [inputDepartamento, setInputDepartamento] = useState<string>(sucursalOriginal.domicilio?.localidad?.departamento.provincia?.nombre);
  const [inputLocalidad, setInputLocalidad] = useState<string>(sucursalOriginal.domicilio?.localidad?.nombre);

  const [idDepartamentosElegidos, setIdDepartamentosElegidos] = useState<Set<number>>(new Set<number>());

  const [idLocalidadesElegidas, setIdLocalidadesElegidas] = useState<Set<number>>(new Set<number>());

  useEffect(() => {
    buscarDepartamentos();
    buscarLocalidadesDeptoyProvincia();
    buscarLocalidadesProvincia();
  }, []);

  const [localidadesCargadas, setLocalidadesCargadas] = useState(false);

  useEffect(() => {
    if (!localidadesCargadas && sucursalOriginal.localidadesDisponiblesDelivery.length > 0) {
      const uniqueDepartamentos = new Set<number>();
      const uniqueLocalidades = new Set<number>();
      const nuevasLocalidades: Localidad[] = [];

      sucursalOriginal.localidadesDisponiblesDelivery.forEach(localidadDelivery => {
        const localidadId = localidadDelivery.localidad?.id;
        const departamentoId = localidadDelivery.localidad?.departamento?.id;

        if (localidadId && departamentoId) {
          uniqueDepartamentos.add(departamentoId);
          uniqueLocalidades.add(localidadId);

          const localidad: Localidad = {
            nombre: localidadDelivery.localidad?.nombre,
            departamento: localidadDelivery.localidad?.departamento,
            id: localidadId
          };

          nuevasLocalidades.push(localidad);
        }
      });

      setIdDepartamentosElegidos(uniqueDepartamentos);
      setIdLocalidadesElegidas(uniqueLocalidades);
      setLocalidadesMostrables(nuevasLocalidades);
      setLocalidadesCargadas(true);
    }
  }, [localidadesCargadas, sucursalOriginal.localidadesDisponiblesDelivery]);


  function buscarDepartamentos() {
    DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  function buscarLocalidadesDeptoyProvincia() {
    LocalidadService.getLocalidadesByNombreDepartamentoAndProvincia(inputDepartamento, inputProvincia)
      .then(async localidades => {
        setLocalidades(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  function buscarLocalidadesProvincia() {
    LocalidadService.getLocalidadesByNombreProvincia(inputProvincia)
      .then(async localidades => {
        setLocalidadesProvincia(localidades);

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
    if (busqueda === 'PROVINCIAS') {
      setModalBusquedaProvincia(true)
      setInputProvincia(selectedOption);
      setInputDepartamento('')
      setInputLocalidad('')
    } else if (busqueda === 'DEPARTAMENTOS') {
      setModalBusquedaDepartamento(true)
      setInputDepartamento(selectedOption);
      setInputLocalidad('')
    } else if (busqueda === 'LOCALIDADES') {
      setModalBusquedaLocalidad(true)
      setInputLocalidad(selectedOption);
    }
  };

  const handleModalClose = () => {
    if (elementosABuscar === 'PROVINCIAS') {
      setInputProvincia(selectedOption);
      buscarDepartamentos();
      setInputDepartamento('');
      setInputLocalidad('');
      setModalBusquedaProvincia(false);

    } else if (elementosABuscar === 'DEPARTAMENTOS') {
      setInputDepartamento(selectedOption);
      buscarLocalidadesDeptoyProvincia();
      setModalBusquedaDepartamento(false);

      setInputLocalidad('')
    } else if (elementosABuscar === 'LOCALIDADES') {
      setInputLocalidad(selectedOption);
      setModalBusquedaLocalidad(false);

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
    // Inicializar el array nuevasLocalidades

    const nuevasLocalidades: Localidad[] = [];

    localidadesProvincia.forEach(localidad => {
      updatedSelectedDepartamentos.forEach(idDepartamento => {
        if (localidad.departamento.id === idDepartamento) nuevasLocalidades.push(localidad);

      });
    });

    // Actualizar el estado con las nuevas localidades
    if (nuevasLocalidades.length > 0) setLocalidadesMostrables(nuevasLocalidades);
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

  const handleCargarNegocio = async () => {
    if (!email) {
      toast.error("Por favor, es necesario el email");
      return;
    } else if (!telefono) {
      toast.error("Por favor, es necesario el telefono");
      return;
    } else if (!calle) {
      toast.error("Por favor, es necesario la calle para el domicilio");
      return;
    } else if (!numeroCalle) {
      toast.error("Por favor, es necesario el numero del domicilio");
      return;
    } else if (!codigoPostal) {
      toast.error("Por favor, es necesario el código postal del domicilio");
      return;
    } else if (!inputLocalidad) {
      toast.error("Por favor, es necesario la localidad para asignar el domicilio");
      return;
    } else if (!horarioApertura) {
      toast.error("Por favor, es necesaria la hora de apertura");
      return;
    } else if (!horarioCierre) {
      toast.error("Por favor, es necesaria la hora de cierre");
      return;
    } else if (localidadesMostrablesCheckbox.length === 0) {
      toast.error("Por favor, es necesaria aunque sea una localidad donde alcance el delivery");
      return;
    }

    let sucursal: Sucursal = new Sucursal();

    sucursal.id = sucursalOriginal.id;

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;

    let localidad = localidadesProvincia?.find(localidad => localidad.nombre === inputLocalidad);
    if (localidad) domicilio.localidad = localidad;

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

    // Usar un bucle inverso para evitar problemas al modificar el array durante la iteración
    for (let i = localidadesDelivery.length - 1; i >= 0; i--) {
      const localidad = localidadesDelivery[i];
      // Verificar si la localidad pertenece a algún departamento elegido
      const guardarLocalidad = idDepartamentosElegidos.has(localidad.localidad.departamento.id);

      // Si no pertenece a ningún departamento elegido, eliminar la localidad del array
      if (!guardarLocalidad) {
        localidadesDelivery.splice(i, 1);
      }
    }

    sucursal.borrado = 'NO';
    sucursal.localidadesDisponiblesDelivery = localidadesDelivery;
    
    toast.promise(SucursalService.updateRestaurant(sucursal), {
      loading: 'Actualizando la sucursal...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  };

  return (
    <div className='modal-info'>
      <Toaster />
      <form>
        <div className="inputBox">
          <input autoComplete='false' type="email" value={email} required={true} onChange={(e) => { setEmail(e.target.value) }} />
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
        {modalBusquedaProvincia && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputProvincia='' inputDepartamento='' />}
        <br />
        <h2>Departamento</h2>
        <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => handleAbrirRecomendaciones('DEPARTAMENTOS')} selectedProduct={inputDepartamento ?? ''} />
        {modalBusquedaDepartamento && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputProvincia={selectedOption} inputDepartamento='' />}

        <br />
        <h2>Localidad</h2>
        <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => handleAbrirRecomendaciones('LOCALIDADES')} selectedProduct={inputLocalidad ?? ''} />
        {modalBusquedaLocalidad && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}


        <h3>Departamentos disponibles para delivery: </h3>
        {departamentos && (
          <table>
            <tbody>

              {departamentos.map((departamento, index) => (
                <tr key={index}>
                  <td>{departamento.nombre}</td>
                  <td>
                    <input
                      type="checkbox"
                      id={`localidad-${index}`}
                      value={departamento.id}
                      checked={idDepartamentosElegidos.has(departamento.id)}
                      onChange={() => handleDepartamentosCheckboxChange(departamento.id)}
                    />
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        )}

        <h3>Localidades disponibles para delivery: </h3>
        {localidadesMostrablesCheckbox && (
          <table>
            <tbody>
              {localidadesMostrablesCheckbox.map((localidad, index) => (
                <tr key={index}>
                  <td>{localidad.nombre}</td>
                  <td>
                    <input
                      type="checkbox"
                      value={localidad.id}
                      checked={idLocalidadesElegidas.has(localidad.id)}
                      onChange={() => handleLocalidadesCheckboxChange(localidad.id)}
                    />
                  </td>
                </tr>

              ))}
            </tbody>
          </table>
        )}
        <button type="button" onClick={handleCargarNegocio}>Editar sucursal</button>
      </form>
    </div>
  )
}

export default EditarSucursal
