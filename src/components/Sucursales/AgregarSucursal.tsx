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

function AgregarSucursal() {

  // Atributos necesarios para Sucursal
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState('');
  const [localidadId, setLocalidadId] = useState(0);
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);
  const [telefono, setTelefono] = useState(0);

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

  const handleCargarNegocio = () => {
    let sucursal: Sucursal = new Sucursal();

    const domicilio = new Domicilio();

    departamentos?.forEach(departamento => {
      let localidad = departamento.localidades.find(localidad => localidad.id === localidadId);

      if (localidad) {
        domicilio.localidad = localidad;
      }
    });

    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;

    sucursal.domicilio = domicilio;

    let localidadesDisponibles: Localidad[] = [];

    departamentos?.forEach(departamento => {
      idLocalidadesElegidas.forEach(id => {
        let localidad = departamento.localidades.find(localidad => localidad.id === id);
        if (localidad) {
          localidadesDisponibles.push(localidad);
        }
      });
    });

    sucursal.localidadesDisponiblesDelivery = localidadesDisponibles;

    sucursal.contraseña = contraseña;
    sucursal.telefono = telefono;
    sucursal.email = email;

    SucursalService.createRestaurant(sucursal);
  };

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
              required
              placeholder="Correo electrónico"
            />
            <input
              type="password"
              name="contraseña"

              onChange={(e) => { setContraseña(e.target.value) }}
              required
              placeholder="Contraseña"
            />
            <input
              type="text"
              name="calle"
              onChange={(e) => { setCalle(e.target.value) }}
              required
              placeholder="Nombre de calle"
            />
            <input
              type="text"
              name="numeroCalle"
              onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }}
              required
              placeholder="Número de calle"
            />

            <input
              type="text"
              name="codigoPostal"
              onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
              required
              placeholder="Codigo Postal"
            />

            <select
              name="provincia"
              onChange={(e) => { cargarSelectDepartamentos(parseInt(e.target.value)) }}
              required
            >
              {provinciasSelect?.map((provincia, index) => (
                <option key={index} value={provincia.id}>{provincia.nombre}</option>
              ))}
            </select>

            <select
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

              onChange={(e) => { setTelefono(parseInt(e.target.value)) }}
              required
              placeholder="Telefono"
            />
            <button type="button" onClick={handleCargarNegocio}>Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AgregarSucursal
