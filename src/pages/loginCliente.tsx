import { useState } from 'react'
import '../styles/login.css';
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
            {/*INICIAR SESION*/}
            <section className="form-main">
                <div className="form-content">
                    <div className="box">
                        <h3>¡BIENVENIDO!</h3>
                        <form action="">
                            <div className="input-box">
                                <label>
                                    <input required type="email" className='input-control' placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="password" className='input-control' placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />
                                </label>
                                <div className="input-link">
                                    <a href="#" className='gradient-text'>¿Has olvidado tu contraseña?</a>
                                </div>
                            </div>
                            <input type="button" className='btn' value="Iniciar sesión" onClick={handleIniciarSesionUsuario} />
                        </form>
                        <p>¿No tienes una cuenta? <a href="#" className='gradient-text'>Crear cuenta</a></p>
                    </div>
                </div>
            </section>

            {/*CREAR CUENTA*/}
            <section className="form-main" style={{display: 'none'}}>
                <div className="form-content">
                    <div className="box">
                        <h3>CREAR UNA CUENTA</h3>
                        <p>o usa tu e-mail para registrarte</p>
                        <form action="">
                            <div className="input-box">
                                <label>
                                    <input required type="text" className='input-control' placeholder="Nombre" onChange={(e) => { setNombre(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="text" className='input-control' placeholder="Apellido" onChange={(e) => { setApellido(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="email" className='input-control' placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="phone" className='input-control' placeholder="Telefono" onChange={(e) => { setTelefono(parseInt(e.target.value)) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="password" className='input-control' placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="text" className='input-control' placeholder="Domicilio" onChange={(e) => { setDomicilio(e.target.value) }} />
                                </label>
                            </div>
                            <input type="button" className='btn' value="Registrarse" onClick={handleCargarUsuario} />
                        </form>
                        <p>¿Ya tienes una cuenta? <a href="#" className='gradient-text'>Iniciar sesión</a></p>
                    </div>
                </div>
            </section>
        </body>
    )
}

export default LoginCliente

