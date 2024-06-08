import { useEffect, useState } from 'react';
import '../styles/login.css';
import { ClienteService } from '../services/ClienteService'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Domicilio } from '../types/Domicilio/Domicilio';
import { Cliente } from '../types/Cliente/Cliente';
import { Toaster, toast } from 'sonner'
import InputComponent from '../components/InputFiltroComponent';
import { Localidad } from '../types/Domicilio/Localidad';
import ModalFlotanteRecomendacionesProvincias from '../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../hooks/ModalFlotanteFiltroLocalidades';
import HeaderLogin from '../components/headerLogin';
import ModalFlotanteRecomendacionesPais from '../hooks/ModalFlotanteFiltroPais';

const LoginCliente = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [calle, setCalle] = useState('');
    const [numeroCasa, setNumeroCasa] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date());
    const [codigoPostal, setCodigoPostal] = useState(0);
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');

    const handleIniciarSesionUsuario = () => {
        ClienteService.getUser(email, contraseña);
    };

    // Modal flotante de ingrediente
    const [inputPais, setInputPais] = useState<string>('');
    const [inputProvincia, setInputProvincia] = useState<string>('');
    const [inputDepartamento, setInputDepartamento] = useState<string>('');
    const [localidadCliente, setLocalidadCliente] = useState<Localidad>(new Localidad());
    const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
    const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
    const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
    const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);


    const handleModalClose = () => {
        setModalBusquedaLocalidad(false)
        setModalBusquedaDepartamento(false)
        setModalBusquedaProvincia(false)
        setModalBusquedaPais(false)
    };

    const handleCargarUsuario = () => {
        if (!nombre) {
            toast.error("Por favor, es necesario el nombre");
            return;
        } else if (!email) {
            toast.error("Por favor, es necesaria el email");
            return;
        } else if (!contraseña) {
            toast.error("Por favor, es necesaria la contraseña");
            return;
        } else if (!telefono.replace(/\D/g, '')) {
            // /\D/g, reemplaza todos las letras
            toast.error("Por favor, es necesario el telefono");
            return;
        } else if (!fechaNacimiento) {
            toast.error("Por favor, es necesaria la fecha de nacimiento");
            return;
        } else if (!localidadCliente) {
            toast.error("Por favor, es necesario la localidad para asignar el domicilio");
            return;
        } else if (!calle) {
            toast.error("Por favor, es necesario la calle para el domicilio");
            return;
        } else if (!numeroCasa.replace(/\D/g, '')) {
            toast.error("Por favor, es necesario el número del domicilio");
            return;
        } else if (!codigoPostal) {
            toast.error("Por favor, es necesario el código postal del domicilio");
            return;
        } else if (!apellido) {
            toast.error("Por favor, es necesario el apellido");
            return;
        }

        const cliente = new Cliente();

        let domicilio = new Domicilio();
        domicilio.calle = calle;
        domicilio.codigoPostal = codigoPostal;
        domicilio.numero = parseInt(numeroCasa);

        domicilio.localidad = localidadCliente;

        cliente.nombre = `${nombre} ${apellido}`;
        cliente.email = email;
        cliente.contraseña = contraseña;
        cliente.telefono = parseInt(telefono);

        if (domicilio) {
            cliente.domicilios.push(domicilio);
        }

        cliente.fechaNacimiento = fechaNacimiento;

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
            setStep(1); // Reinicia el paso al iniciar sesión
        } else if (seccion === 'reestablecerContraseña') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(true);
            setMostrarCrearCuenta(false);
        } else if (seccion === 'crearCuenta') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(true);
            setStep(1); // Reinicia el paso al crear una cuenta
        }
    };

    useEffect(() => {
        document.title = 'El Buen Sabor - Iniciar sesión';
    }, []);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        {/* Datos personales */}
                        <div className="inputBox">
                            <input type='text' required={true} value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
                            <span>Nombre</span>
                        </div>
                        <div className="inputBox">
                            <input type='text' required={true} value={apellido} onChange={(e) => { setApellido(e.target.value) }} />
                            <span>Apellido</span>
                        </div>
                        <div className="inputBox">
                            <label style={{ display: 'flex', fontWeight: 'bold', marginTop: '-5px' }}>Fecha de nacimiento:</label>
                            <input type='date' required={true} value={fechaNacimiento.toString()} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
                        </div>
                        <div className="btns-crear-cuenta">
                            <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
                        </div>

                    </>
                );
            case 2:
                return (
                    <>
                        {/* Datos del correo */}
                        <div className="inputBox">
                            <input type='number' required={true} value={telefono} onChange={(e) => { setTelefono(e.target.value) }} />
                            <span>Teléfono</span>
                        </div>
                        <div className="inputBox">
                            <input type='email' required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <span>Correo electrónico</span>
                        </div>


                        <div className="inputBox">
                            <input type={tipoInput} required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
                            <span>Contraseña</span>
                            <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>
                        </div>


                        <div className='btns-crear-cuenta'>
                            <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                            <button className='btn-accion-adelante' onClick={nextStep}>Siguiente ⭢</button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        {/* Domicilio */}
                        <div className="inputBox">
                            <input type="text" required={true} value={calle} onChange={(e) => { setCalle(e.target.value) }} />
                            <span>Nombre de la calle</span>
                        </div>
                        <div className="inputBox">
                            <input type="text" required={true} value={numeroCasa} onChange={(e) => { setNumeroCasa(e.target.value) }} />
                            <span>Número de la casa</span>
                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
                            <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={inputPais ?? ''} />
                            {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { setInputPais(pais.nombre); handleModalClose(); }} />}
                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
                            <InputComponent disabled={inputPais.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
                            {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); handleModalClose(); }} />}

                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
                            <InputComponent disabled={inputProvincia.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
                            {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}

                        </div>
                        <div>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
                            <InputComponent disabled={inputDepartamento.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={localidadCliente.nombre ?? ''} />
                            {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { setLocalidadCliente(localidad); handleModalClose(); }} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}

                        </div>
                        <div className="inputBox">
                            <input type="number" required={true} value={codigoPostal} onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
                            <span>Código postal</span>
                        </div>
                        <div className="btns-crear-cuenta">
                            <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                            <button className='btn-accion-registrarse' onClick={handleCargarUsuario}>Registrarse ✓</button>

                        </div>
                    </>
                );
            default:
                return null;
        }
    };


    return (

        <>
            <HeaderLogin></HeaderLogin>
            <Toaster />
            {/*INICIAR SESION*/}
            <section className="form-main" style={{ display: mostrarIniciarSesion ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h3>- BIENVENIDO -</h3>
                        <p id='subtitle'>¡Si ya tienes una cuenta, inicia sesión con tus datos!</p>
                        <p id='subtitle'>o inicia sesión con: <img id='icon-gmail' src="https://img.icons8.com/color/48/gmail-new.png" alt="gmail-new" /></p>
                        <form action="">
                            <div className="inputBox">
                                <input type="text" required={true} onChange={(e) => { setEmail(e.target.value) }} />
                                <span>Correo electrónico</span>
                            </div>
                            <div className="inputBox">
                                <input type={tipoInput} required={true} onChange={(e) => { setContraseña(e.target.value) }} />
                                <span>Contraseña</span>
                                <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>

                            </div>
                            <div className="input-link">
                                <p id='pass-forg'>¿Has olvidado tu contraseña?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('reestablecerContraseña')}>Click aquí</a></p>
                            </div>
                            <br />
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
                            <div className="inputBox">
                                <input type='text' required={true} onChange={(e) => { setEmail(e.target.value) }} />
                                <span>Correo electrónico</span>
                            </div>
                            <br />
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
                        {renderStep()}
                        <p id='subtitle'>¿Ya tienes una cuenta?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('iniciarSesion')}>Iniciar sesión</a></p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginCliente

