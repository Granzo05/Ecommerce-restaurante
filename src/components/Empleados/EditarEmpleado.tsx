import { useEffect, useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';
import { LocalidadService } from '../../services/LocalidadService';
import { Toaster, toast } from 'sonner'
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import ModalFlotanteRecomendaciones from '../ModalFlotanteRecomendaciones';
import InputComponent from '../InputFiltroComponent';

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
  const [domicilioModificable, setDomicilioModificable] = useState<Domicilio>(empleadoOriginal.domicilios[indexDomicilio]);
  const [domicilios, setDomicilios] = useState(empleadoOriginal.domicilios);

  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [localidades, setLocalidades] = useState<Localidad[] | null>([]);

  useEffect(() => {
    cargarSucursales();
  }, []);



  async function cargarLocalidades(idDepartamento: number) {
    await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento)
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


  function handleChangeCalle(calle: string, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.calle = calle;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].calle = calle;
      return newDomicilios;
    });
  }

  function handleChangeNumeroCasa(numero: number, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.numero = numero;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].numero = numero;
      return newDomicilios;
    });
  }

  function handleChangeCodigoPostal(codigo: number, index: number) {
    setDomicilioModificable(prevState => {
      const newDomicilio = { ...prevState };
      newDomicilio.codigoPostal = codigo;
      return newDomicilio;
    });

    setDomicilios(prevState => {
      const newDomicilios = [...prevState];
      newDomicilios[index].codigoPostal = codigo;
      return newDomicilios;
    });
  }

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
        <div className="inputBox">
          <input type="text" required={true} onChange={(e) => { handleChangeCalle(e.target.value) }} />
          <span>Nombre de calle</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { handleChangeNumeroCasa(parseInt(e.target.value)) }} />
          <span>Número de domicilio</span>
        </div>
        <div className="inputBox">
          <input type="number" required={true} onChange={(e) => { handleChangeCodigoPostal(parseInt(e.target.value)) }} />
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

        <button className='button-form' type='button' onClick={agregarEmpleado}>Agregar empleado</button>
      </form>
    </div>
  )
}

export default EditarEmpleado;

