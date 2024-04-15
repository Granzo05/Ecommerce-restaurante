import { useState } from 'react'
import styles from '../assets/styleLogin.module.css'
import { ClienteService } from '../services/ClienteService'

const LoginCliente = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState(0);

    const handleIniciarSesionUsuario = () => {
        ClienteService.getUser(email, contraseña);
    };

    const handleCargarUsuario = () => {
        ClienteService.createUser(nombre, apellido, email, contraseña, telefono, domicilio);
    };

    return (
        <body>
            <div className={styles.containerForm}>
            <div className={styles.info}>
                <div className={styles.infoChilds}>
                    <h2>¡Bienvenido!</h2>
                    <p>Si ya posees una cuenta, por favor, inicia sesión con tus datos</p>
                    <label>
                        <input required type="email" placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                    </label>
                    <label>
                        <input required type="password" placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />
                    </label>
                    <input type="button" value="Iniciar sesión" onClick={handleIniciarSesionUsuario} />
                </div>
            </div>
            <div className={styles.formInfo}>
                <div className="form-info-childs">
                    <h2>Crear una cuenta</h2>
                    <p>o usa tu e-mail para registrarte</p>
                    <form className={styles.form}>
                        <label>
                            <input required type="text" placeholder="Nombre" onChange={(e) => { setNombre(e.target.value) }} />
                        </label>
                        <label>
                            <input required type="text" placeholder="Apellido" onChange={(e) => { setApellido(e.target.value) }} />
                        </label>
                        <label>
                            <input required type="email" placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                        </label>
                        <label>
                            <input required type="phone" placeholder="Telefono" onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
                        </label>
                        <label>
                            <input required type="password" placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />
                        </label>
                        <label>
                            <input required type="text" placeholder="Domicilio" onChange={(e) => { setDomicilio(e.target.value) }} />
                        </label>
                        <input type="button" value="Registrarse" onClick={handleCargarUsuario} />
                    </form>
                </div>
            </div>
        </div>
        </body>
        
    )
}

export default LoginCliente
