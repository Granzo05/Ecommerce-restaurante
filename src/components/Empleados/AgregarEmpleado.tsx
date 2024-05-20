import { useState } from 'react';
import { Empleado } from '../../types/Restaurante/Empleado';
import { EmpleadoService } from '../../services/EmpleadoService';
import { clearInputs } from '../../utils/global_variables/functions';
import { Toaster, toast } from 'sonner'
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import InputComponent from '../InputFiltroComponent';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import { Localidad } from '../../types/Domicilio/Localidad';

function AgregarEmpleado() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cuil, setCuit] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);

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

  async function agregarEmpleado() {
    if (!nombre) {
      toast.error("Por favor, es necesario el nombre");
      return;
    } else if (!email) {
      toast.error("Por favor, es necesaria el email");
      return;
    } else if (!contraseña) {
      toast.error("Por favor, es necesaria la contraseña");
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
    } else if (!inputLocalidad) {
      toast.error("Por favor, es necesario la localidad para asignar el domicilio");
      return;
    }

    const empleado = new Empleado();

    empleado.nombre = nombre;
    empleado.email = email;
    empleado.contraseña = contraseña;
    empleado.telefono = telefono;
    empleado.cuil = cuil;
    empleado.fechaNacimiento = fechaNacimiento;
    empleado.privilegios = 'COCINERO';

    const sucursalStr = localStorage.getItem('usuario');
    const sucursal = sucursalStr ? JSON.parse(sucursalStr) : new Sucursal();
    empleado.sucursal = sucursal;

    empleado.domicilios = domicilios;

    empleado.borrado = 'NO';

    toast.promise(EmpleadoService.createEmpleado(empleado), {
      loading: 'Creando empleado...',
      success: (message) => {
        clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <Toaster />
      <br />
      <form>
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { setNombre(e.target.value) }} />
          <span>Nombre del empleado</span>
        </div>
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { setEmail(e.target.value) }} />
          <span>Email del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { setCuit(e.target.value) }} />
          <span>Cuil del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
          <span>Contraseña del empleado</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
          <span>Telefono del empleado</span>
        </div>
        <div className="inputBox">
          <input type="date" required={true} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
          <span>Fecha de nacimiento</span>
        </div>
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
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputProvincia={''} inputDepartamento='' />}
            <br />
            <h2>Departamento</h2>
            <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => handleAbrirRecomendaciones('DEPARTAMENTOS')} selectedProduct={inputDepartamento ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputProvincia={inputProvincia} inputDepartamento='' />}

            <br />
            <h2>Localidad</h2>
            <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => handleAbrirRecomendaciones('LOCALIDADES')} selectedProduct={inputLocalidad ?? ''} />
            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} inputProvincia={inputProvincia} inputDepartamento={inputDepartamento} />}
            <p onClick={() => quitarCampoDomicilio(index)}>X</p>
          </div>
        ))}
        <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>

        <button className='button-form' type='button' onClick={agregarEmpleado}>Agregar empleado</button>
      </form>
    </div>
  )
}

export default AgregarEmpleado
