import { useEffect, useState } from 'react';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Toaster, toast } from 'sonner'
import { LocalidadDelivery } from '../../types/Restaurante/LocalidadDelivery';
import InputComponent from '../InputFiltroComponent';
import { LocalidadService } from '../../services/LocalidadService';
import { clearInputs } from '../../utils/global_variables/functions';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Departamento } from '../../types/Domicilio/Departamento';

function AgregarSucursal() {
  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);
  const [telefono, setTelefono] = useState(0);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre, setHorarioCierre] = useState('');

  const [localidadesProvincia, setLocalidadesProvincia] = useState<Localidad[]>([]);

  const [localidadesMostrablesCheckbox, setLocalidadesMostrables] = useState<Localidad[]>([]);

  const [departamentosMostrablesCheckBox, setDepartamentosMostrablesCheckbox] = useState<Departamento[]>([]);

  const [idDepartamentosElegidos, setIdDepartamentosElegidos] = useState<Set<number>>(new Set<number>());

  const [idLocalidadesElegidas, setIdLocalidadesElegidas] = useState<Set<number>>(new Set<number>());

  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [inputDepartamento, setInputDepartamento] = useState<string>('');
  const [localidadSucursal, setLocalidadSucursal] = useState<Localidad>(new Localidad());

  function buscarLocalidadesProvincia() {
    LocalidadService.getLocalidadesByNombreProvincia(inputProvincia)
      .then(async localidades => {
        setLocalidadesProvincia(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }

  useEffect(() => {
    DepartamentoService.getDepartamentosByNombreProvincia(inputProvincia)
      .then(async departamentos => {
        setDepartamentosMostrablesCheckbox(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
  }, [inputProvincia]);

  const handleModalClose = () => {
    setModalBusquedaLocalidad(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaProvincia(false)
  };

  const handleDepartamentosCheckboxChange = async (departamentoId: number) => {
    if (localidadesProvincia.length === 0) {
      buscarLocalidadesProvincia();
    }
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

    // Inicializa el array nuevasLocalidades
    let nuevasLocalidades = [];

    for (const localidad of localidadesProvincia) {
      // Verifica si el idDepartamento de la localidad está en updatedSelectedDepartamentos
      if (updatedSelectedDepartamentos.has(localidad.departamento.id)) {
        // Añade la localidad a nuevasLocalidades
        nuevasLocalidades.push(localidad);
      }
    }

    // Actualiza el estado con las nuevas localidades
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

  const handleCargarNegocio = async () => {
    if (!email) {
      toast.error("Por favor, es necesario el email");
      return;
    } else if (!contraseña) {
      toast.error("Por favor, es necesaria la contraseña");
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

    const domicilio = new Domicilio();
    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;
    domicilio.localidad = localidadSucursal;

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
    sucursal.borrado = 'NO';
    toast.promise(SucursalService.createRestaurant(sucursal), {
      loading: 'Guardando sucursal...',
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
      <h2>Agregar sucursal</h2>
      <Toaster />
      <form>
        <div className="inputBox">
          <input autoComplete='false' type="text" required={true} onChange={(e) => { setEmail(e.target.value) }} />
          <span>Correo electrónico</span>
        </div>
        <div className="inputBox">
          <input type="password" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
          <span>Contraseña</span>
        </div>
        <div className="inputBox">
          <input type="phone" required={true} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
          <span>Telefono</span>
        </div>
        <div className="inputBox">
          <label style={{ display: 'flex', fontWeight: 'bold' }}>Horario de apertura:</label>
          <input type="time" required={true} onChange={(e) => { setHorarioApertura(e.target.value) }} />

        </div>
        <div className="inputBox">
          <label style={{ display: 'flex', fontWeight: 'bold' }}>Horario de cierre:</label>
          <input type="time" required={true} onChange={(e) => { setHorarioCierre(e.target.value) }} />

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
        <InputComponent placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
        {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); handleModalClose(); }} />}

        <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
        {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}

        <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={localidadSucursal.nombre ?? ''} />
        {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { setLocalidadSucursal(localidad); handleModalClose(); }} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}

        <div className="inputBox">
          <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamentos disponibles para delivery:</label>

        </div>
        {departamentosMostrablesCheckBox && (
          <table>
            <tbody>
              {departamentosMostrablesCheckBox.map((departamento, index) => (
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
        <div className="inputBox">

          <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidades disponibles para delivery:</label>
        </div>

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
      </form>
      <hr />
      <button type="button" onClick={handleCargarNegocio}>Agregar sucursal</button>

    </div>
  )
}

export default AgregarSucursal
