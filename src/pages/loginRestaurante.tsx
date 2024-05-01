import { useState } from 'react'
import styles from '../assets/styleLogin.module.css'
import { RestauranteService } from '../services/RestauranteService';
import { Domicilio } from '../types/Domicilio/Domicilio';
import { Localidad } from '../types/Domicilio/Localidad';
import { Provincia } from '../types/Domicilio/Provincia';

const LoginNegocio = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [calle, setCalle] = useState('');
  const [localidadId, setLocalidadId] = useState(0);
  const [provinciaId, setProvinciaId] = useState(0);
  const [numeroCalle, setNumeroCalle] = useState(0);
  const [codigoPostal, setCodigoPostal] = useState(0);
  const [telefono, setTelefono] = useState(0);
  const [localidadesSelect, setLocalidadesSelect] = useState<Localidad[]>([]);
  const [provinciasSelect, setProvinciasSelect] = useState<Provincia[]>([]);

  const handleIniciarSesionNegocio = () => {
    RestauranteService.getRestaurant(email, contraseña);
  };

  function cargarSelectLocalidades() {
    LocalidadService.getLocalidades()
      .then(data => {
        setLocalidadesSelect(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  function cargarSelectProvincias() {
    ProvinciaService.getProvincias()
      .then(data => {
        setProvinciasSelect(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleCargarNegocio = () => {
    const domicilio = new Domicilio();

    const localidad = new Localidad();
    localidad.id = localidadId;

    domicilio.calle = calle;
    domicilio.localidad = localidad;
    domicilio.numero = numeroCalle;
    domicilio.codigoPostal = codigoPostal;

    RestauranteService.createRestaurant(email, contraseña, domicilio, telefono);
  };

  return (
    <div>
      <div className={styles.containerForm}>
        <div className={styles.info}>
          <div className={styles.infoChilds}>
            <h2>¡Bienvenido!</h2>
            <p>Si ya posees una cuenta, por favor, inicia sesión con tus datos</p>
            <input type="button" value="Iniciar sesión" id="iniciarSesionDatos" />
          </div>
        </div>
        <div className={styles.formInfo}>
          <div>
            <h2>Crear una cuenta</h2>
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

                <select
                  name="provincia"
                  onChange={(e) => { setProvinciaId(parseInt(e.target.value)) }}
                  required
                >
                  {provinciasSelect.map((provincia, index) => (
                    <option key={index} value={provincia.id}>{provincia.nombre}</option>
                  ))}
                </select>

                <input
                  type="text"
                  name="codigoPostal"
                  onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }}
                  required
                  placeholder="Codigo Postal"
                />

                {provinciasSelect && (
                  <div>
                    <input className='ACA VA UN AUTOCOMPLETADO'></input>
                    <select
                      name="localidad"
                      onChange={(e) => { setLocalidadId(parseInt(e.target.value)) }}
                      required
                    >
                      {localidadesSelect.map((localidad, index) => (
                        <option key={index} value={localidad.id}>{localidad.nombre}</option>
                      ))}
                    </select>
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
        <div className={styles.containerForm}>
          <div className={styles.info}>
            <div className={styles.infoChilds}>
              <h2>¡Bienvenido!</h2>
              <p>Si no posees una cuenta de negocio, por favor, registrate aquí</p>
              <input type="button" value="Registrarse" id="registrarDatos" />
            </div>
          </div>
          <div className={styles.formInfo}>
            <div>
              <h2>Iniciar sesión</h2>
              <form className={styles.form}>
                <label>
                  <input required type="text" placeholder="Correo electrónico" id="emailLogin"
                    onChange={(e) => { setEmail(e.target.value) }} />
                </label>
                <label>
                  <input required type="password" placeholder="Contraseña" id="contraseñaLogin"
                    onChange={(e) => { setContraseña(e.target.value) }} />
                </label>
                <input type="button" onClick={handleIniciarSesionNegocio} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginNegocio
