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
  const [domiciliosModificable, setDomiciliosModificable] = useState<Domicilio[]>(empleadoOriginal.domicilios);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

  useEffect(() => {
    cargarSucursales();
  }, []);

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
    if (nuevosDomicilios && nuevosDomicilios[index].calle) {
      nuevosDomicilios[index].calle = calle;
      setDomicilios(nuevosDomicilios);
    }
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
      setDomicilios(domicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      const nuevosDomicilios = [...domicilios];
      nuevosDomicilios.pop();
      setDomicilios(nuevosDomicilios);
      setIndexDomicilio(0);
    }
  };

  const quitarCampoDomicilioModificable = (index: number) => {
    if (domiciliosModificable.length > 0) {
      const nuevosDomicilios = [...domiciliosModificable];
      nuevosDomicilios.splice(index, 1);
      setDomiciliosModificable(domiciliosModificable);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      const nuevosDomicilios = [...domiciliosModificable];
      nuevosDomicilios.pop();
      setDomiciliosModificable(domiciliosModificable);
      setIndexDomicilio(0);
    }
  };

  const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
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

  async function editarEmpleado() {

    if (!nombre || !email || !telefono || !cuil || !fechaNacimiento) {
      toast.info("Por favor, complete todos los campos requeridos.");
      return;
    }

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


    let sucursal = sucursales.find(sucursal => sucursal.id === sucursalId);

    if (sucursal) empleadoActualizado.sucursal = sucursal;

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
          <input type="date" required={true} value={fechaNacimiento.toLocaleDateString()} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
          <span>Fecha de nacimiento</span>
        </div>
        {domiciliosModificable && domiciliosModificable.map((domicilio, index) => (
          <div>
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
              <input type="number" disabled required={true} value={domicilio.localidad?.nombre} />
              <span>Localidad</span>
            </div>
            <p onClick={() => quitarCampoDomicilioModificable(index)}>X</p>
          </div>
        ))}
        {domicilios && domicilios.map((domicilio, index) => (
          <div>
            <div className="inputBox">
              <input type="text" required={true} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
              <span>Nombre de calle</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { handleChangeNumeroCasa(parseInt(e.target.value), index) }} />
              <span>Número de domicilio</span>
            </div>
            <div className="inputBox">
              <input type="number" required={true} onChange={(e) => { handleChangeCodigoPostal(parseInt(e.target.value), index) }} />
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
            <p onClick={() => quitarCampoDomicilio(index)}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>

        <select value={sucursalId} onChange={(e) => setSucursalId(parseInt(e.target.value))}>
          {sucursales && sucursales.map(sucursal => (
            <option key={sucursal.id} value={sucursal.id}>
              {sucursal.domicilio?.localidad?.nombre}
            </option>
          ))}
        </select>
        <button className='button-form' type='button' onClick={editarEmpleado}>Editar empleado</button>
      </form>
    </div>
  )
}

export default EditarEmpleado;

