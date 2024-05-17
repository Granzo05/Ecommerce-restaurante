import { useState } from 'react'
import '../styles/login.css';
import { ClienteService } from '../services/ClienteService'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Domicilio } from '../types/Domicilio/Domicilio';
import { Cliente } from '../types/Cliente/Cliente';
import { Toaster, toast } from 'sonner'
import InputComponent from '../components/InputComponent';
import ModalFlotanteRecomendaciones from '../components/ModalFlotanteRecomendaciones';
import { Localidad } from '../types/Domicilio/Localidad';

const LoginCliente = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [calle, setCalle] = useState('');
    const [numeroCasa, setNumeroCasa] = useState(0);
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date());
    const [codigoPostal, setCodigoPostal] = useState(0);
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState(0);

    const handleIniciarSesionUsuario = () => {
        ClienteService.getUser(email, contraseña);
    };


    // Modal flotante de ingrediente
    const [modalBusqueda, setModalBusqueda] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [elementosABuscar, setElementosABuscar] = useState<string>('');
    const [inputProvincia, setInputProvincia] = useState<string>('');
    const [inputDepartamento, setInputDepartamento] = useState<string>('');
    const [inputLocalidad, setInputLocalidad] = useState<string>('');

    const handleSelectProduct = (option: string) => {
        setSelectedOption(option);
    };

    const handleAbrirRecomendaciones = (busqueda: string) => {
        setElementosABuscar(busqueda)
        setModalBusqueda(true);
    };

    const handleModalClose = () => {
        setModalBusqueda(false)
        if (elementosABuscar === 'PROVINCIAS') {
            setInputProvincia(selectedOption);
            setInputDepartamento('')
            setInputLocalidad('')
        } else if (elementosABuscar === 'DEPARTAMENTOS') {
            setInputDepartamento(selectedOption);
            setInputLocalidad('')
        } else if (elementosABuscar === 'LOCALIDADES') {
            setInputLocalidad(selectedOption);
        }
    };

    const handleCargarUsuario = () => {
        const cliente = new Cliente();

        let domicilio = new Domicilio();
        domicilio.calle = calle;
        domicilio.codigoPostal = codigoPostal;
        domicilio.numero = numeroCasa;

        let localidad: Localidad = new Localidad();
        localidad.nombre = inputLocalidad;
        domicilio.localidad = localidad;

        cliente.nombre = `${nombre} ${apellido}`;
        cliente.email = email;
        cliente.contraseña = contraseña;
        cliente.telefono = telefono;

        if (domicilio) {
            cliente.domicilios.push(domicilio);
        }

        const fechaNacimientoDate = new Date(fechaNacimiento);
        fechaNacimientoDate.setUTCDate(fechaNacimientoDate.getUTCDate() + 1);

        const fechaNacimientoLocal = new Date(fechaNacimientoDate.toLocaleString());

        cliente.fechaNacimiento = fechaNacimientoLocal;
        console.log(cliente)
        toast.promise(ClienteService.createUser(cliente), {
            loading: 'Creando usuario...',
            success: () => {
                return `Iniciando sesión...`;
            },
            error: 'Error',
        });
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
            <Toaster />
            {/*INICIAR SESION*/}
            <section className="form-main" style={{ display: mostrarIniciarSesion ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h3>- BIENVENIDO -</h3>
                        <p id='subtitle'>¡Si ya tienes una cuenta, inicia sesión con tus datos!</p>
                        <p id='subtitle'>o inicia sesión con: <img id='icon-gmail' src="https://img.icons8.com/color/48/gmail-new.png" alt="gmail-new" /></p>
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
                                    <p id='pass-forg'>¿Has olvidado tu contraseña?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('reestablecerContraseña')}>Click aquí</a></p>
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
                        <h2 id='back-icon' onClick={() => mostrarSeccion('iniciarSesion')}><KeyboardBackspaceIcon></KeyboardBackspaceIcon></h2>
                        <h3>- CREAR UNA CUENTA -</h3>
                        <p id='subtitle'>o registrate con: <img id='icon-gmail' src="https://img.icons8.com/color/48/gmail-new.png" alt="gmail-new" /></p>
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
                                    <input required type="date" className='input-control' onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
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
                                    <input required type="text" className='input-control' placeholder="Nombre de la calle" onChange={(e) => { setCalle(e.target.value) }} />
                                </label>
                            </div>
                            <div className="input-box">
                                <label>
                                    <input required type="number" className='input-control' placeholder="Número de la casa" onChange={(e) => { setNumeroCasa(parseInt(e.target.value)) }} />
                                </label>
                            </div>
                            <h2>Provincia</h2>
                            <InputComponent placeHolder='Seleccionar provincia...' onInputClick={() => handleAbrirRecomendaciones('PROVINCIAS')} selectedProduct={inputProvincia ?? ''} />
                            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={''} />}
                            <br />
                            <h2>Departamento</h2>
                            <InputComponent placeHolder='Seleccionar departamento...' onInputClick={() => handleAbrirRecomendaciones('DEPARTAMENTOS')} selectedProduct={inputDepartamento ?? ''} />
                            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={selectedOption} />}

                            <br />
                            <h2>Localidad</h2>
                            <InputComponent placeHolder='Seleccionar localidad...' onInputClick={() => handleAbrirRecomendaciones('LOCALIDADES')} selectedProduct={inputLocalidad ?? ''} />
                            {modalBusqueda && <ModalFlotanteRecomendaciones elementoBuscado={elementosABuscar} onCloseModal={handleModalClose} onSelectProduct={handleSelectProduct} datoNecesario={selectedOption} />}

                            <div className="input-box">
                                <label>
                                    <input required type="number" className='input-control' placeholder="Codigo postal" onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
                                </label>
                            </div>

                            <input style={{ marginTop: '1px' }} type="button" className='btn' value="REGISTRARSE" onClick={handleCargarUsuario} />
                        </form>
                        <p id='subtitle'>¿Ya tienes una cuenta?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('iniciarSesion')}>Iniciar sesión</a></p>
                    </div>
                </div>
            </section>
        </body>
    )
}

export default LoginCliente

