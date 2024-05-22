import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import { LocalidadService } from '../../services/LocalidadService';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [email, setEmail] = useState(empleadoOriginal.email);
  const [cuil, setCuit] = useState(empleadoOriginal.cuil);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(empleadoOriginal.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(empleadoOriginal.fechaNacimiento.toString());
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [sucursalId, setSucursalId] = useState(empleadoOriginal.sucursal?.id);

  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [indexDomicilioModificable, setIndexDomicilioModificable] = useState<number>(0);
  const [domiciliosModificable, setDomiciliosModificable] = useState<Domicilio[]>(empleadoOriginal.domicilios);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);


  useEffect(() => {
    cargarSucursales();
  }, []);

  const isValidDate = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
      return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;

    if (isValidDate(dateString)) {
      setFechaNacimiento(dateString);
    }
  };


  function buscarLocalidades() {
    LocalidadService.getLocalidadesByNombreDepartamentoAndProvincia(inputDepartamento, inputProvincia)
      .then(async localidades => {
        setLocalidades(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
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

  const handleChangeCalle = (index: number, calle: string) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].calle = calle;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeNumeroCasa = (index: number, numero: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].numero = numero;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeCodigoPostal = (index: number, codigoPostal: number) => {
    const nuevosDomicilios = [...domicilios];
    nuevosDomicilios[index].codigoPostal = codigoPostal;
    setDomicilios(nuevosDomicilios);
  };

  const handleChangeLocalidad = (localidadNombre: string) => {
    const nuevosDomicilios = [...domicilios];
    let localidad = localidades.find(localidad => localidad.nombre === localidadNombre);
    console.log(localidad)

    if (localidad) {
      nuevosDomicilios[indexDomicilio].localidad = localidad;
      setDomicilios(nuevosDomicilios);
    }
  };

  const añadirCampoDomicilio = () => {
    // SI no hay ingredientes que genere en valor 0 de index
    if (domicilios.length === 0) {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad() }]);
    } else {
      setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad() }]);
      setIndexDomicilio(prevIndex => prevIndex + 1);
    }
  };

  const quitarCampoDomicilio = (index: number) => {
    if (domicilios.length > 0) {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.splice(index, 1);
      setDomicilios(nuevosDomicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
      setIndexDomicilio(0);
    }
  };


  const quitarCampoDomicilioModificable = (index: number) => {
    if (domiciliosModificable.length > 0) {
      const nuevosDomicilios = [...domiciliosModificable];
      nuevosDomicilios.splice(index, 1);
      setDomiciliosModificable(nuevosDomicilios);

      if (indexDomicilioModificable > 0) {
        setIndexDomicilioModificable(indexDomicilioModificable - 1);
      }
    } else {
      setDomiciliosModificable([]);
      setIndexDomicilioModificable(0);
    }
  };

  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [elementosABuscar, setElementosABuscar] = useState<string>('');
  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [inputDepartamento, setInputDepartamento] = useState<string>('');
  const [inputLocalidad, setInputLocalidad] = useState<string>('');

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
      buscarLocalidades();
      setInputLocalidad(selectedOption);
    }
  };

  const handleModalClose = () => {
    if (elementosABuscar === 'PROVINCIAS') {
      setModalBusquedaProvincia(false)
      setInputProvincia(selectedOption);
      setInputDepartamento('')
      setInputLocalidad('')
    } else if (elementosABuscar === 'DEPARTAMENTOS') {
      setModalBusquedaDepartamento(false)
      setInputDepartamento(selectedOption);
      setInputLocalidad('')
    } else if (elementosABuscar === 'LOCALIDADES') {
      setModalBusquedaLocalidad(false)
      setInputLocalidad(selectedOption);
      handleChangeLocalidad(selectedOption)
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return new Date(year, month - 1, day);
  };

  async function editarEmpleado() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!email) {
      toast.error("Por favor, es necesaria el email");
      return;
    } else if (!telefono) {
      toast.error("Por favor, es necesario el telefono");
      return;
    } else if (!cuil) {
      toast.error("Por favor, es necesario el cuil");
      return;
    } else if (!fechaNacimiento) {
      toast.error("Por favor, es necesaria la fecha de nacimiento");
      return;
    }

    if (domiciliosModificable.length === 0 && domicilios.length === 0) {
      toast.info("Se debe agregar al menos un domicilio.");
      return;
    }

    let domiciliosValidos = [...domiciliosModificable, ...domicilios].filter(domicilio =>
      domicilio.calle && domicilio.numero && domicilio.codigoPostal
    );

    if (domiciliosValidos.length === 0) {
      toast.info("Se debe agregar al menos un domicilio válido.");
      return;
    }

    const empleadoActualizado: Empleado = {
      ...empleadoOriginal,
      nombre,
      email,
      cuil,
      contraseña,
      fechaNacimiento: formatDate(new Date(fechaNacimiento)),
      telefono
    };

    domiciliosModificable.forEach((nuevoDomicilio) => {
      const existe = domicilios.some((domicilio) =>
        domicilio.numero === nuevoDomicilio.numero &&
        domicilio.calle === nuevoDomicilio.calle &&
        domicilio.codigoPostal === nuevoDomicilio.codigoPostal
      );

      if (!existe) {
        domicilios.push(nuevoDomicilio);
      }
    });

    empleadoActualizado.domicilios = domicilios;

    let sucursal = sucursales.find(sucursal => sucursal.id === sucursalId);

    if (sucursal) empleadoActualizado.sucursal = sucursal;
    empleadoActualizado.borrado = 'NO';

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
      <form>
        <div className="inputBox">
          <input type="text" required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre del empleado</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
          <span>Email del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} value={cuil} onChange={(e) => { setCuit(e.target.value) }} />
          <span>Cuil del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
          <span>Contraseña del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} value={telefono} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
          <span>Telefono del empleado</span>
        </div>
        <div className="inputBox">
          <input type="date" required={true} value={fechaNacimiento} onChange={handleDateChange} />
          <span>Fecha de nacimiento</span>
        </div>
        {domiciliosModificable && domiciliosModificable.map((domicilio, index) => (
          <div key={'domicilioMod' + index}>
            <p>Domicilio {index + 1}</p>
            <div className="inputBox">
              <input type="text" required={true} value={domicilio.calle} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
              <span>Nombre de calle</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={domicilio.numero} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
              <span>Número de domicilio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} value={domicilio.codigoPostal} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
              <span>Código Postal</span>
            </div>
            <div className="inputBox">
              <input type="text" disabled required={true} value={domicilio.localidad?.nombre} />
            </div>
            <p onClick={() => quitarCampoDomicilioModificable(index)}>X</p>
          </div>
        ))}
        {domicilios && indexDomicilio > 0 && domicilios.map((domicilio, index) => (
          <div key={'domicilio' + index}>
            <div className="inputBox">
              <input type="text" required={true} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
              <span>Nombre de calle</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
              <span>Número de domicilio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
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
            <p onClick={() => quitarCampoDomicilio(index)}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
        <br />
        <p>Sucursal: </p>
        <select value={sucursalId} onChange={(e) => setSucursalId(parseInt(e.target.value))}>
          {sucursales && sucursales.map(sucursal => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.domicilio?.localidad?.nombre}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button className='button-form' type='button' onClick={editarEmpleado}>Editar empleado</button>
      </form>
    </div>
  )
}

export default EditarEmpleado;

