import { useState } from 'react'
import styles from '../assets/styleLogin.module.css'
import { SucursalService } from '../services/SucursalService';

const LoginNegocio = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleIniciarSesionNegocio = () => {
    SucursalService.getSucursal(email, contraseña);
  };

  return (
    <div>
      <div className={styles.containerForm}>
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
  )
}

export default LoginNegocio
