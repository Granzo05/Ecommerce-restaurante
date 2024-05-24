import { useState } from 'react';
import { Empleado } from '../../types/Restaurante/Empleado';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Toaster, toast } from 'sonner'
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import '../../styles/modalCrud.css'
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';

function AgregarEmpleado() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [cuil, setCuit] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);

  const [inputProvincia, setInputProvincia] = useState<string>('');
  const [inputDepartamento, setInputDepartamento] = useState<string>('');

  
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
  };

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


  const handleChangeLocalidad = (index: number, localidad: Localidad) => {
    const nuevosDomicilios = [...domicilios];
    if (localidad) {
      nuevosDomicilios[index].localidad = localidad;
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
      setDomicilios(domicilios);

      if (indexDomicilio > 0) {
        setIndexDomicilio(indexDomicilio - 1);
      }
    } else {
      setDomicilios([]);
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
    }

    for (let i = 0; i < domicilios.length; i++) {
      const calle = domicilios[i].calle;
      const numero = domicilios[i].numero;
      const codigoPostal = domicilios[i].codigoPostal;
      const localidad = domicilios[i].localidad;

      if (!calle) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una calle`);
        return;
      } else if (numero === 0) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un numero de casa`);
      } else if (codigoPostal === 0) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener un código postal`);
      } else if (!localidad) {
        toast.info(`Por favor, el domicilio ${i + 1} debe contener una localidad`);
      }
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
        //clearInputs();
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Agregar empleado</h2>
      <Toaster />
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
          <label style={{ display: 'flex', fontWeight: 'bold' }}>Fecha de nacimiento:</label>
          <input type="date" required={true} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
          <hr />
        </div>

        {domicilios && domicilios.map((domicilio, index) => (
          <div key={index}>
            <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilio(index)}>X</p>
            <h2>Domicilio {index + 1}</h2>

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
            <InputComponent placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
            {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); handleModalClose(); }} />}

            <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
            {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}

            <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={domicilio.localidad.nombre ?? ''} />
            {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { handleChangeLocalidad(index, localidad); handleModalClose(); }} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}
            <hr />
          </div>
        ))}

      </form>
      <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
      <hr />
      <button className='button-form' type='button' onClick={agregarEmpleado}>Agregar empleado</button>

    </div>
  )
}

export default AgregarEmpleado
