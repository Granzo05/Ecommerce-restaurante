import { useEffect, useState } from 'react';
import { ProvinciaService } from '../../services/ProvinciaService';
import { DepartamentoService } from '../../services/DepartamentoService';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { Sucursal } from '../../types/Restaurante/Sucursal';
import { Localidad } from '../../types/Domicilio/Localidad';
import { SucursalService } from '../../services/SucursalService';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Provincia } from '../../types/Domicilio/Provincia';
import { LocalidadService } from '../../services/LocalidadService';

function AgregarSucursal() {
  const [loading, setLoading] = useState(false);

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
  }, []);


  const handleDepartamentosCheckboxChange = (departamentoId: number) => {
    const updatedSelectedDepartamentos = new Set(idDepartamentosElegidos);
    if (updatedSelectedDepartamentos.has(departamentoId)) {
      updatedSelectedDepartamentos.delete(departamentoId);
    } else {
      updatedSelectedDepartamentos.add(departamentoId);
    }
    setDepartamentosDisponibles(updatedSelectedDepartamentos);
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
    await DepartamentoService.getDepartamentosByProvinciaId(idProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
        if (departamentos && departamentos.length == 0) {
          crearDepartamentos(idProvincia);
        }
      });
  }

  async function crearDepartamentos(idProvincia: number) {
    await DepartamentoService.createDepartamentosByIdProvincia(idProvincia)
      .then(async departamentos => {
        setDepartamentos(departamentos);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function cargarSelectLocalidades(idDepartamento: number) {
    await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento)
      .then(async localidades => {
        setLocalidadesSucursalSelect(localidades);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleCargarNegocio = () => {
    let sucursal: Sucursal = new Sucursal();

    const domicilio = new Domicilio();

    domicilio.calle = calle;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;
    
    console.log(departamentos);


    sucursal.domicilio = domicilio;


    //sucursal.localidadesDisponiblesDelivery = localidadesDisponibles;

    sucursal.contraseña = contraseña;
    sucursal.telefono = telefono;
    sucursal.email = email;

    SucursalService.createRestaurant(sucursal);
  };

  return (
    <div className='form-info'>
      <div>
        {/* Todo: Hacer un cartelito de cargando con el circulo girando o un modal */}
        {loading && <p>Cargando...</p>}

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
            <br />
            <input
              type="password"
              name="contraseña"

              onChange={(e) => { setContraseña(e.target.value) }}
              required
              placeholder="Contraseña"
            />
            <br />

            <input
              type="text"
              name="calle"
              onChange={(e) => { setCalle(e.target.value) }}
              required
              placeholder="Nombre de calle"
            />
            <br />

            <input
              type="text"
              name="numeroCalle"
              onChange={(e) => { setNumeroCalle(parseInt(e.target.value)) }}
              required
              placeholder="Número de calle"
            />
            <br />

            <input
              type="text"
              name="codigoPostal"
              onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
              required
              placeholder="Codigo Postal"
            />
            <br />
            <h2>Provincia</h2>
            <select
              name="provincia"
              onChange={(e) => { cargarSelectDepartamentos(parseInt(e.target.value)) }}
              required
            >
              <option value=''>Selecciona una provincia</option>
              {provinciasSelect?.map((provincia, index) => (
                <option key={index} value={provincia.id}>{provincia.nombre}</option>
              ))}
            </select>
            <br />
            <h2>Departamentos</h2>
            <select
              name="departamento"
              onChange={(e) => { cargarSelectLocalidades(parseInt(e.target.value)) }}
              required
            >
              {departamentos?.map((departamento, index) => (
                <option key={index} value={departamento.id}>{departamento.nombre}</option>
              ))}
            </select>
            <br />
            <h2>Localidad</h2>
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
            {localidadesSucursalSelect && (
              <div>
                {localidadesSucursalSelect.map((localidad, index) => (
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
