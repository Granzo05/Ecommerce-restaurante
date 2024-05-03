import { useEffect, useState } from 'react';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import styles from '../assets/styleLogin.module.css'
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';

interface EditarSucursalProps {
  sucursalOriginal: Sucursal;
}

const EditarEmpleado: React.FC<EditarSucursalProps> = ({ sucursalOriginal }) => {
  const [email, setEmail] = useState(sucursalOriginal.email);
  const [contraseña, setContraseña] = useState(sucursalOriginal.contraseña);
  const [calle, setCalle] = useState(sucursalOriginal.domicilio?.calle);
  const [numeroCalle, setNumeroCalle] = useState(sucursalOriginal.domicilio?.numero);
  const [codigoPostal, setCodigoPostal] = useState(sucursalOriginal.domicilio?.codigoPostal);
  const [telefono, setTelefono] = useState(0);
  const [domicilio, setDomicilio] = useState<Domicilio | null>(sucursalOriginal.domicilio);

  // Cargamos los departamentos de la provincia elegida en el select
  const [departamentos, setDepartamentos] = useState<Departamento[] | null>([]);
  // Cargamos las localidades disponibles, tanto para el domicilio de la sucursal como para los disponibles para el delivery
  const [localidades, setLocalidades] = useState<Localidad[] | null>([]);
  //Select que nos permite filtrar para los departamentos de la sucursal asi no cargamos de más innecesariamente
  const [provinciasSelect, setProvinciasSelect] = useState<Provincia[] | null>([]);
  //Select que nos permite filtrar para las localidades de la sucursal asi no cargamos de más innecesariamente
  const [localidadesSucursalSelect, setLocalidadesSucursalSelect] = useState<Localidad[] | null>([]);
  // Array que va guardando las checkboxes con los departamentos donde la sucursal hace delivery
  const [idDepartamentosElegidos, setDepartamentosDisponibles] = useState(new Set());
  // Array que va guardando las checkboxes con las localidades donde la sucursal hace delivery
  const [idLocalidadesElegidas, setLocalidadesDisponibles] = useState(new Set());

  const [localidadId, setLocalidadId] = useState(sucursalOriginal.domicilio?.localidad?.id);

  useEffect(() => {
    cargarSelectProvincias();

    if (!provinciasSelect) {
      crearProvincias();
    }
  }, []);

  const handleDepartamentosCheckboxChange = (departamentoId: number) => {
    const updatedSelectedDepartamentos = new Set(idDepartamentosElegidos);
    if (updatedSelectedDepartamentos.has(departamentoId)) {
      updatedSelectedDepartamentos.delete(departamentoId);
    } else {
      updatedSelectedDepartamentos.add(departamentoId);
    }
    setDepartamentosDisponibles(updatedSelectedDepartamentos);

    departamentos?.map(departamento => {
      if (departamentoId === departamento.id) {
        setLocalidades(departamento.localidades);
      }
    })
  };

  const handleLocalidadesCheckboxChange = (localidadId: number) => {
    const updatedSelectedLocalidades = new Set(idLocalidadesElegidas);
    if (updatedSelectedLocalidades.has(localidadId)) {
      updatedSelectedLocalidades.delete(localidadId);
    } else {
      updatedSelectedLocalidades.add(localidadId);
    }
    setLocalidadesDisponibles(updatedSelectedLocalidades);
  };

  // Si el select de provincias no se carga es porque la base de datos está vacía, entonces cargo las provincias
  async function crearProvincias() {
    await ProvinciaService.createProvincias()
      .then(() => {
        cargarSelectProvincias();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  // Una vez cargadas las provincias vuelvo a cargar el select
  async function cargarSelectProvincias() {
    await ProvinciaService.getProvincias()
      .then(data => {
        setProvinciasSelect(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Al seleccionar una provincia cargo los departamentos asociados
  async function cargarSelectDepartamentos(idProvincia: number) {
    await DepartamentoService.createDepartamentosByIdProvincia(idProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function setDepartamentoSucursal(idDepartamento: number) {
    departamentos?.forEach(departamento => {
      if (departamento.id === idDepartamento) {
        setLocalidadesSucursalSelect(departamento.localidades);
      }
    });
  }

  async function editarSucursal() {
    let localidad = localidades?.find(localidades => localidades.id === localidadId);

    let domicilioAct: Domicilio = new Domicilio();

    if (calle) domicilioAct.calle = calle;
    if (numeroCalle) domicilioAct.numero = numeroCalle;
    if (codigoPostal) domicilioAct.codigoPostal = codigoPostal;

    domicilioAct.localidad = localidad;

    setDomicilio(domicilioAct)

    const sucursalActualizada: Sucursal = {
      ...sucursalOriginal,
      email,
      contraseña,
      telefono: telefono,
      domicilio: domicilio

    };
    let response = await SucursalService.updateRestaurant(sucursalActualizada);
    alert(response);
  }

  return (
    <div className={styles.formInfo}>
      <div>
        <h2>Crear una sucursal</h2>
        <div>
          <form>
            <input
              type="email"
              name="email"
              onChange={(e) => { setEmail(e.target.value) }}
              value={sucursalOriginal.email}
              required
              placeholder="Correo electrónico"
            />
            <input
              type="password"
              value={sucursalOriginal.contraseña}
              name="contraseña"
              onChange={(e) => { setContraseña(e.target.value) }}
              required
              placeholder="Contraseña"
            />
            <input
              type="text"
              value={sucursalOriginal.domicilio?.calle}
              name="calle"
              onChange={(e) => { setCalle(e.target.value) }}
              required
              placeholder="Nombre de calle"
            />
            <input
              type="text"
              value={sucursalOriginal.domicilio?.numero}
              name="numeroCalle"
              onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }}
              required
              placeholder="Número de calle"
            />

            <input
              type="text"
              value={sucursalOriginal.domicilio?.codigoPostal}
              name="codigoPostal"
              onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
              required
              placeholder="Codigo Postal"
            />

            <select
              name="provincia"
              value={sucursalOriginal.domicilio?.localidad?.departamento?.provincia?.id}
              onChange={(e) => { cargarSelectDepartamentos(parseInt(e.target.value)) }}
              required
            >
              {provinciasSelect?.map((provincia, index) => (
                <option key={index} value={provincia.id}>{provincia.nombre}</option>
              ))}
            </select>

            <select
              value={sucursalOriginal.domicilio?.localidad?.departamento?.id}
              name="departamento"
              onChange={(e) => { setDepartamentoSucursal(parseInt(e.target.value)) }}
              required
            >
              {departamentos?.map((departamento, index) => (
                <option key={index} value={departamento.id}>{departamento.nombre}</option>
              ))}
            </select>

            <select
              name="localidad"
              value={sucursalOriginal.domicilio?.localidad?.id}

              onChange={(e) => { setLocalidadId(parseInt(e.target.value)) }}
              required
            >
              {localidadesSucursalSelect?.map((localidad, index) => (
                <option key={index} value={localidad.id}>{localidad.nombre}</option>
              ))}
            </select>

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
                      id={`localidad-${index}`}
                      value={localidad.id}
                      checked={idLocalidadesElegidas.has(localidad.id)}
                      onChange={() => handleLocalidadesCheckboxChange(localidad.id)}
                    />
                    <label htmlFor={`localidad-${index}`}>{localidad.nombre}</label>
                  </div>
                ))}
              </div>
            )}

            <input
              type="number"
              name="telefono"
              value={sucursalOriginal.telefono}

              onChange={(e) => { setTelefono(parseInt(e.target.value)) }}
              required
              placeholder="Telefono"
            />
            <button type="button" onClick={editarSucursal}>Actualizar sucursal</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditarEmpleado;

