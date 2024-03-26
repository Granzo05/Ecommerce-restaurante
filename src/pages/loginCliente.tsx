import { useState } from 'react'
import styles from '../assets/styleLogin.module.css'

const LoginCliente = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [contraseña, setContraseña] = useState('')

  function cargarUsuario () {
    const nombreSplit = nombre.split(' ')
    const datosCliente = {
      nombre: nombreSplit[0],
      apellido: nombreSplit[1],
      email,
      contraseña,
      privilegios: 'cliente'
    }

    fetch('http://localhost:8080/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCliente)
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
        }
        return await response.json()
      })
      .then(data => {
        document.cookie = `id=${data.id}; privilegio=${data.privilegios}; email=${data.email}; expires=Sun, 31 Dec 2033 12:00:00 UTC; path=/`

        // Redirige al usuario al menú principal
        window.location.href = '/'
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  function iniciarSesion () {
    const datosCliente = {
      email,
      contraseña
    }

    // Validaciones aca

    fetch('http://localhost:8080/cliente/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosCliente)
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
        }
        return await response.json()
      })
      .then(data => {
        document.cookie = `id=${data.id}; privilegio=${data.privilegios}; email=${data.email}; expires=Sun, 31 Dec 2033 12:00:00 UTC; path=/`

        // Redirige al usuario al menú principal
        window.location.href = '/'
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  return (
        <div className={styles.containerForm}>
            <div className={styles.info}>
                <div className={styles.infoChilds}>
                    <h2>¡Bienvenido!</h2>
                    <p>Si ya posees una cuenta, por favor, inicia sesión con tus datos</p>
                    <label>
                        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                    </label>
                    <label>
                        <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
                    </label>
                    <input type="button" value="Iniciar sesión" onClick={iniciarSesion} />
                </div>
            </div>
            <div className={styles.formInfo}>
                <div className="form-info-childs">
                    <h2>Crear una cuenta</h2>
                    <p>o usa tu e-mail para registrarte</p>
                    <form className={styles.form}>
                        <label>
                            <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
                        </label>
                        <label>
                            <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        </label>
                        <label>
                            <input type="password" placeholder="Contraseña" value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
                        </label>
                        <input type="button" value="Registrarse" onClick={cargarUsuario} />
                    </form>
                </div>
            </div>
        </div>
  )
}

export default LoginCliente
