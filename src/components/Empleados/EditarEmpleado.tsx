import { useState } from 'react';
import { EmpleadoService } from '../../services/EmpleadoService';
import { Empleado } from '../../types/Restaurante/Empleado';
import '../../styles/empleados.css';
import { Toaster, toast } from 'sonner'
import { Domicilio } from '../../types/Domicilio/Domicilio';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import ModalFlotanteRecomendacionesSucursales from '../../hooks/ModalFlotanteFiltroSucursales';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Pais } from '../../types/Domicilio/Pais';
import { formatearFechaYYYYMMDD } from '../../utils/global_variables/functions';

interface EditarEmpleadoProps {
  empleadoOriginal: Empleado;
  onCloseModal: () => void;
}

const EditarEmpleado: React.FC<EditarEmpleadoProps> = ({ empleadoOriginal, onCloseModal }) => {
  const [nombre, setNombre] = useState(empleadoOriginal.nombre);
  const [email, setEmail] = useState(empleadoOriginal.email);
  const [cuil, setCuit] = useState(empleadoOriginal.cuil);
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState(empleadoOriginal.telefono);
  const [fechaNacimiento, setFechaNacimiento] = useState<string>(empleadoOriginal.fechaNacimiento.toString());
  const [sucursal, setSucursal] = useState(empleadoOriginal.sucursal);

  const [indexDomicilio, setIndexDomicilio] = useState<number>(0);
  const [indexDomicilioModificable, setIndexDomicilioModificable] = useState<number>(0);
  const [domiciliosModificable, setDomiciliosModificable] = useState<Domicilio[]>(empleadoOriginal.domicilios);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);

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

  const handleChangePais = (index: number, pais: Pais) => {
    const nuevosDomicilios = [...domicilios];
    if (pais) {
      nuevosDomicilios[index].localidad.departamento.provincia.pais = pais;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeProvincia = (index: number, provincia: Provincia) => {
    const nuevosDomicilios = [...domicilios];
    if (provincia) {
      nuevosDomicilios[index].localidad.departamento.provincia = provincia;
      setDomicilios(nuevosDomicilios);
    }
  };

  const handleChangeDepartamento = (index: number, departamento: Departamento) => {
    const nuevosDomicilios = [...domicilios];
    if (departamento) {
      nuevosDomicilios[index].localidad.departamento = departamento;
      setDomicilios(nuevosDomicilios);
    }
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

  const [modalBusquedaSucursal, setModalBusquedaSucursal] = useState<boolean>(false);
  const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
  const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
  const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
  const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);

  const handleModalClose = () => {
    setModalBusquedaProvincia(false)
    setModalBusquedaDepartamento(false)
    setModalBusquedaLocalidad(false)
    setModalBusquedaPais(false)
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

    if (sucursal) empleadoActualizado.sucursal = sucursal;

    empleadoActualizado.borrado = 'NO';

    toast.promise(EmpleadoService.updateEmpleado(empleadoActualizado), {
      loading: 'Actualizando empleado...',
      success: (message) => {
        setTimeout(() => {
          onCloseModal();
        }, 800);
        return message;
      },
      error: (message) => {
        return message;
      },
    });
  }

  return (
    <div className="modal-info">
      <h2>Editar empleado</h2>
      <Toaster />
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
          <input type="date" required={true} value={formatearFechaYYYYMMDD(new Date(fechaNacimiento))} onChange={(e) => setFechaNacimiento(e.target.value)} />
          <span>Fecha de nacimiento</span>
        </div>
        {domiciliosModificable && domiciliosModificable.map((domicilio, index) => (
          <div key={'domicilioMod' + index}>
            <hr />
            <p className='cierre-ingrediente' onClick={() => quitarCampoDomicilioModificable(index)}>X</p>

            <h2>Domicilio {index + 1}</h2>

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
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
            <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.pais?.nombre ?? ''} />
            {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { handleChangePais(index, pais); handleModalClose(); }} />}
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
            <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.pais.nombre.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.nombre ?? ''} />
            {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { handleChangeProvincia(index, provincia); handleModalClose(); }} />}
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
            <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.nombre.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={domicilio.localidad?.departamento?.nombre ?? ''} />
            {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { handleChangeDepartamento(index, departamento); handleModalClose(); }} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
            <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
            <InputComponent disabled={domicilio.localidad?.departamento?.nombre.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={domicilio.localidad.nombre ?? ''} />
            {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { handleChangeLocalidad(index, localidad); handleModalClose(); }} inputDepartamento={domicilio.localidad?.departamento?.nombre} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
            <hr />
            <hr /><p onClick={() => quitarCampoDomicilio(index)}>X</p>
          </div>
        ))}
      </form>
      <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
      <br />
      <InputComponent disabled={false} placeHolder='Seleccionar sucursal...' onInputClick={() => setModalBusquedaSucursal(true)} selectedProduct={sucursal?.nombre ?? ''} />
      {modalBusquedaSucursal && <ModalFlotanteRecomendacionesSucursales datosOmitidos={sucursal?.nombre ?? ''} onCloseModal={handleModalClose} onSelectSucursal={(sucursal) => { setSucursal(sucursal); handleModalClose(); }} />}
      <hr />
      <button className='button-form' type='button' onClick={editarEmpleado}>Editar empleado</button>
    </div>
  )
}

export default EditarEmpleado;

