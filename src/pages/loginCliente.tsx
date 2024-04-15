import { useState } from 'react'
import '../styles/login.css';
import { ClienteService } from '../services/ClienteService'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


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

    const [tipoInput, setTipoInput] = useState('password');
    const [mostrarIniciarSesion, setMostrarIniciarSesion] = useState(true);
    const [mostrarReestablecerContraseña, setMostrarReestablecerContraseña] = useState(false);
    const [mostrarCrearCuenta, setMostrarCrearCuenta] = useState(false);

    const toggleTipoInput = () => {
        setTipoInput(tipoInput === 'password' ? 'text' : 'password');
    };

    const mostrarSeccion = (seccion: string) => {
        if (seccion === 'iniciarSesion') {
            setMostrarIniciarSesion(true);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(false);
        } else if (seccion === 'reestablecerContraseña') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(true);
            setMostrarCrearCuenta(false);
        } else if (seccion === 'crearCuenta') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(true);
        }
    };

    return (
        <body>
            {/*INICIAR SESION*/}
            <section className="form-main" style={{ display: mostrarIniciarSesion ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h3>- BIENVENIDO -</h3>
                        <p id='subtitle'>¡Si ya tienes una cuenta, inicia sesión con tus datos!</p>
                        <form action="">
                            <div className="input-box">
                                <label>
                                    <input required type="email" className='input-control' placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type={tipoInput} className='input-control' placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />

                                </label>
                                <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>
                                <div className="input-link">
                                    <p>¿Has olvidado tu contraseña?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('reestablecerContraseña')}>Click aquí</a></p>
                                </div>
                            </div>
                            <input type="button" className='btn' value="INICIAR SESIÓN" onClick={handleIniciarSesionUsuario} />
                        </form>
                        <p id='create-account'>¿No tienes una cuenta?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('crearCuenta')}>Crear cuenta</a></p>
                    </div>
                </div>
            </section>

            {/*CONTRASEÑA OLVIDADA*/}
            <section className="form-main" style={{ display: mostrarReestablecerContraseña ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h2 id='back-icon' onClick={() => mostrarSeccion('iniciarSesion')}><KeyboardBackspaceIcon></KeyboardBackspaceIcon></h2>
                        <h3>- REESTABLECER CONTRASEÑA -</h3>
                        <p id='subtitle'>¡Necesitamos que coloques un correo electrónico para ayudarte a reestablecer tu contraseña!</p>
                        <form action="">
                            <div className="input-box">
                                <label>
                                    <input required type="email" className='input-control' placeholder="Correo electrónico" onChange={(e) => { setEmail(e.target.value) }} />
                                </label>
                            </div>
                            <input type="button" className='btn' value="ENVIAR CORREO DE RECUPERACIÓN" onClick={handleIniciarSesionUsuario} style={{ marginTop: '0.5px' }} />
                        </form>
                    </div>
                </div>
            </section>

            {/*CREAR CUENTA*/}
            <section className="form-main" style={{ display: mostrarCrearCuenta ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h3>- CREAR UNA CUENTA -</h3>
                        <p id='subtitle'>o registrate con: <img id='icon-gmail' src="https://img.icons8.com/color/48/gmail-new.png" alt="gmail-new"/></p>
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
                                    <input required type={tipoInput} className='input-control' placeholder="Contraseña" onChange={(e) => { setContraseña(e.target.value) }} />
                                </label>
                                <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>

                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="text" className='input-control' placeholder="Domicilio" onChange={(e) => { setDomicilio(e.target.value) }} />
                                </label>
                            </div>
                            <input style={{marginTop: '1px'}} type="button" className='btn' value="REGISTRARSE" onClick={handleCargarUsuario} />
                        </form>
                        <p id='subtitle'>¿Ya tienes una cuenta?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('iniciarSesion')}>Iniciar sesión</a></p>
                    </div>
                </div>
            </section>
        </body>
    )
}

export default LoginCliente

