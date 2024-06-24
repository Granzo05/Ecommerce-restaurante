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
import decodeJWT, { formatearFechaYYYYMMDD } from '../utils/global_variables/functions';
import { useNavigate } from 'react-router-dom'; // Importa useHistory desde React Route
import { GoogleLogin } from '@react-oauth/google';

const LoginCliente = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    /*const history = useNavigate(); // Obtiene el objeto history

    useEffect(() => {
        const sucursalSeleccionada = localStorage.getItem('sucursal'); // Verifica si hay una sucursal seleccionada en el localStorage
        if (!sucursalSeleccionada) {
            // Si no hay una sucursal seleccionada, redirige al usuario a la página selec-sucursal
            history('/selec-sucursal');
        }
    }, [history]);*/

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date());
    const [contraseña, setContraseña] = useState('');
    const [calle, setCalle] = useState('');
    const [numeroCasa, setNumeroCasa] = useState('');
    const [codigoPostal, setCodigoPostal] = useState(parseInt(''));
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleIniciarSesionUsuario = () => {
        setIsLoading(true);
        if (email.length === 0 || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
            toast.error('Debe ingresar un e-mail válida');
            setIsLoading(false);
            return;
        } else if (contraseña.length === 0 || contraseña.length < 8) {

            setIsLoading(false);
            toast.error('Debe ingresar una contraseña válida');
            return;
        }

        toast.promise(ClienteService.getUser(email, contraseña), {
            loading: 'Iniciando sesión...',
            success: () => {
                setIsLoading(true);
                return `Iniciando sesión...`;
            },
            finally: () => {
                setIsLoading(false);
                toast.error(`Error. Correo o contraseña no encontrados...`);

            }
        });
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
            setIsLoading(false);
            return;
        } else if (!email) {
            toast.error("Por favor, es necesaria el email");
            setIsLoading(false);
            return;
        } else if (!contraseña) {
            toast.error("Por favor, es necesaria la contraseña");
            setIsLoading(false);
            return;
        } else if (!telefono.replace(/\D/g, '')) {
            // /\D/g, reemplaza todos las letras
            toast.error("Por favor, es necesario el telefono");
            setIsLoading(false);
            return;
        } else if (!fechaNacimiento) {
            toast.error("Por favor, es necesaria la fecha de nacimiento");
            setIsLoading(false);
            return;
        } else if (!localidadCliente) {
            toast.error("Por favor, es necesario la localidad para asignar el domicilio");
            setIsLoading(false);
            return;
        } else if (!calle || !calle.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\-0-9]+$/)) {
            toast.error("Por favor, es necesario la calle para el domicilio");
            setIsLoading(false);
            return;
        } else if (!numeroCasa.replace(/\D/g, '') || (parseInt(numeroCasa) > 99999 || parseInt(numeroCasa) < 1)) {
            toast.error("Por favor, es necesario el número del domicilio");
            setIsLoading(false);
            return;
        } else if (!codigoPostal || (codigoPostal > 9431 || codigoPostal < 1001)) {
            toast.error("Por favor, es necesario el código postal del domicilio");
            setIsLoading(false);
            return;
        } else if (localidadCliente.departamento.provincia.pais.nombre == '') {
            toast.info(`Por favor, el domicilio debe contener un país`);
            setIsLoading(false);
            return;
        } else if (localidadCliente.departamento.provincia.nombre == '') {
            toast.info(`Por favor, el domicilio debe contener una provincia`);
            setIsLoading(false);
            return;
        } else if (localidadCliente.departamento.nombre == '') {
            toast.info(`Por favor, el domicilio debe contener un departamento`);
            setIsLoading(false);
            return;
        } else if (localidadCliente.nombre == '') {
            toast.info(`Por favor, el domicilio debe contener una localidad`);
            setIsLoading(false);
            return;
        } else if (!apellido) {
            toast.error("Por favor, es necesario el apellido");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

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
                setIsLoading(true);
                return `Iniciando sesión...`;
            },
            error: (err) => {
                setIsLoading(false);
                return err.message;
            },
            finally: () => {
                setIsLoading(false);
            }
        });
    };

    const [tipoInput, setTipoInput] = useState('password');
    const [mostrarIniciarSesion, setMostrarIniciarSesion] = useState(true);
    const [mostrarReestablecerContraseña, setMostrarReestablecerContraseña] = useState(false);
    const [mostrarCrearCuenta, setMostrarCrearCuenta] = useState(false);
    const [mostrarCrearCuentaGmail, setMostrarCrearCuentaGmail] = useState(false);

    const toggleTipoInput = () => {
        setTipoInput(tipoInput === 'password' ? 'text' : 'password');
    };

    const mostrarSeccion = (seccion: string) => {
        if (seccion === 'iniciarSesion') {
            setMostrarIniciarSesion(true);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(false);
            setMostrarCrearCuentaGmail(false);
            setStep(1); // Reinicia el paso al iniciar sesión
        } else if (seccion === 'reestablecerContraseña') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(true);
            setMostrarCrearCuenta(false);
            setMostrarCrearCuentaGmail(false);
        } else if (seccion === 'crearCuenta') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(true);
            setMostrarCrearCuentaGmail(false);
            setStep(1); // Reinicia el paso al crear una cuenta
        } else if (seccion === 'crearCuentaGmail') {
            setMostrarIniciarSesion(false);
            setMostrarReestablecerContraseña(false);
            setMostrarCrearCuenta(false);
            setMostrarCrearCuentaGmail(true);
            setStep(1);
        }
    };

    useEffect(() => {
        document.title = 'El Buen Sabor - Iniciar sesión';
    }, []);



    const validateAndNextStep = () => {

        if (!nombre || !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
            toast.error("Por favor, es necesario un nombre válido");
            return;
        } else if (!apellido || !apellido.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
            toast.error("Por favor, es necesario un apellido válido");
            return;
        } else if (!fechaNacimiento) {
            toast.error("Por favor, es necesaria una fecha de nacimiento válida y ser mayor a 12 años.");
            return;
        } else {
            // Convertir la fecha de nacimiento a un objeto Date
            const fechaNacimientoDate = new Date(fechaNacimiento);

            // Obtener la fecha actual
            const fechaActual = new Date();

            // Restar 12 años a la fecha actual
            const fechaMinima = new Date();
            fechaMinima.setFullYear(fechaActual.getFullYear() - 12);

            // Comparar la fecha de nacimiento con la fecha mínima
            if (fechaNacimientoDate > fechaMinima) {
                toast.error("Debes ser mayor a 12 años.");
                return;
            } else {
                nextStep();
            }

        }
    }

    const validateAndNextStep2 = () => {

        if (!email || !email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
            toast.error("Por favor, es necesario un e-mail válido");
            return;
        } else if (!contraseña || contraseña.length < 8) {
            toast.error("Por favor, es necesaria una contraseña válido");
            return;
        } else if (!telefono.replace(/\D/g, '') || telefono.length < 10) {
            // /\D/g, reemplaza todos las letras
            toast.error("Por favor, es necesario un número de telefono válido");
            return;
        } else {
            nextStep();
        }

    }


    const handleTelefonoChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        // Permitir solo valores numéricos
        if (/^\d*$/.test(value)) {
            setTelefono(value);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h5 style={{ textAlign: 'center' }}>Paso 1 - Datos personales</h5>
                        {/* Datos personales */}
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type='text' required={true} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" value={nombre} onChange={(e) => { setNombre(e.target.value) }} />
                            <span>Nombre</span>
                            <div className="error-message">El nombre debe contener letras y espacios.</div>

                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type='text' required={true} value={apellido} onChange={(e) => { setApellido(e.target.value) }} pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+" />
                            <span>Apellido</span>
                            <div className="error-message">El apellido debe contener letras y espacios.</div>

                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold', marginTop: '-5px' }}>Fecha de nacimiento:</label>
                            <input type='date' required={true} value={formatearFechaYYYYMMDD(fechaNacimiento)} onChange={(e) => { setFechaNacimiento(new Date(e.target.value)) }} />
                            <div className="error-message" style={{ marginTop: '65px' }}>La fecha de nacimiento debe ser válida.</div>

                        </div>
                        <div className="btns-crear-cuenta">
                            <button style={{ marginRight: '0px' }} className='btn-accion-adelante' onClick={validateAndNextStep}>Siguiente ⭢</button>
                        </div>

                    </>
                );
            case 2:
                return (
                    <>
                        {/* Datos del correo */}
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type='email' required={true} value={email} onChange={(e) => { setEmail(e.target.value) }} />
                            <span>Correo electrónico</span>
                            <div className="error-message">Formato incorrecto de e-mail.</div>
                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type='text' pattern="\d{10}" required={true} value={telefono} onChange={handleTelefonoChange} />
                            <span>Teléfono</span>
                            <div className="error-message">El número de teléfono no es válido. Mínimo 10 dígitos</div>
                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type={tipoInput} pattern=".{8,}" required={true} value={contraseña} onChange={(e) => { setContraseña(e.target.value) }} />
                            <span>Contraseña</span>
                            <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>
                            <div className="error-message">Mínimo 8 dígitos.</div>
                        </div>
                        <div className='btns-crear-cuenta'>
                            <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                            <button style={{ marginRight: '0px' }} className='btn-accion-adelante' onClick={validateAndNextStep2}>Siguiente ⭢</button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        {/* Domicilio */}
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type="text" pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-0-9]+" required={true} value={calle} onChange={(e) => { setCalle(e.target.value) }} />
                            <span>Nombre de la calle</span>
                            <div className="error-message">El nombre de la calle debe contener letras y espacios.</div>

                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type="number" min={1} max={99999} required={true} value={numeroCasa} onChange={(e) => { setNumeroCasa(e.target.value) }} />
                            <span>Número de la casa</span>
                            <div className="error-message">El número de la calle no es válido.</div>

                        </div>
                        <div className="inputBox" style={{ marginBottom: '12px' }}>
                            <input type="number" min={1001} max={9431} required={true} value={codigoPostal} onChange={(e) => { setCodigoPostal(parseInt(e.target.value)) }} />
                            <span>Código postal</span>
                            <div className="error-message">El codigo postal no es válido.</div>

                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
                            <InputComponent disabled={false} placeHolder='Filtrar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={inputPais ?? ''} />
                            {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { setInputPais(pais.nombre); handleModalClose(); }} />}
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
                            <InputComponent disabled={inputPais.length === 0} placeHolder='Filtrar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={inputProvincia ?? ''} />
                            {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { setInputProvincia(provincia.nombre); handleModalClose(); }} />}
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
                            <InputComponent disabled={inputProvincia.length === 0} placeHolder='Filtrar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={inputDepartamento ?? ''} />
                            {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { setInputDepartamento(departamento.nombre); handleModalClose(); }} inputProvincia={inputProvincia} />}
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
                            <InputComponent disabled={inputDepartamento.length === 0} placeHolder='Filtrar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={localidadCliente.nombre ?? ''} />
                            {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { setLocalidadCliente(localidad); handleModalClose(); }} inputDepartamento={inputDepartamento} inputProvincia={inputProvincia} />}
                        </div>

                        <div className="btns-crear-cuenta">
                            <button className='btn-accion-atras' onClick={prevStep}>⭠ Atrás</button>
                            <button style={{ marginRight: '0px' }} className="btn-accion-entregado" onClick={handleCargarUsuario} disabled={isLoading}>
                                {isLoading ? 'Registrándose...' : 'Registrarse ✓'}
                            </button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const handlePasswordResetRequest = async () => {
        try {
            await ClienteService.requestPasswordReset(email);
            toast.success('Correo de recuperación enviado');
            return;
        } catch (error) {
            toast.error('Error al enviar el correo de recuperación');
            return;
        }
    };

    async function buscarCliente(email: string) {
        try {
            return await ClienteService.getUserByEmailLogin(email);
        } catch (error) {
            console.error('Error buscando cliente:', error);
            return false;
        }
    }

    return (
        <>
            <HeaderLogin></HeaderLogin>
            <Toaster />
            {/*INICIAR SESION*/}

            <section className="form-main" style={{ display: mostrarIniciarSesion ? '' : 'none' }}>
                <div className="form-content">
                    <button style={{ marginBottom: '20px' }} className='btn' onClick={() => window.location.href = '/sucursales#login'}>SELECCIONAR SUCURSAL</button>
                    <div className="box">
                        <h3>- BIENVENIDO -</h3>
                        <p id='subtitle'>¡Si ya tienes una cuenta, inicia sesión con tus datos!</p>
                        <div className="login-google">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        const { payload } = decodeJWT(credentialResponse.credential);

                                        const cliente = await buscarCliente(payload.email);
                                        // Si no ha creado sesión previamente lo hacemos registrarse
                                        if (!cliente) {
                                            toast.info('Necesitamos unos datos extras antes de finalizar');

                                            setNombre(payload.given_name);
                                            setApellido(payload.family_name);
                                            setEmail(payload.email);
                                            mostrarSeccion('crearCuenta');
                                        } else {
                                            toast.info('Iniciando sesión');
                                        }
                                    }
                                }}
                                onError={() => {
                                    console.log('Login cancelado');
                                }}
                            />
                        </div>
                        <hr />
                        <form action="">
                            <div className="inputBox" style={{ marginBottom: '12px' }}>
                                <input type="email" required={true} onChange={(e) => { setEmail(e.target.value) }} />
                                <span>Correo electrónico</span>
                                <div className="error-message">Formato incorrecto de e-mail.</div>

                            </div>
                            <div className="inputBox" style={{ marginBottom: '12px' }}>
                                <input type={tipoInput} pattern=".{8,}" required={true} onChange={(e) => { setContraseña(e.target.value) }} />
                                <span>Contraseña</span>
                                <i id='icon-lock' onClick={toggleTipoInput}>{tipoInput === 'password' ? <LockIcon /> : <LockOpenIcon />}</i>
                                <div className="error-message">Mínimo 8 dígitos.</div>

                            </div>
                            <div className="input-link">
                                <p id='pass-forg'>¿Has olvidado tu contraseña?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('reestablecerContraseña')}>Click aquí</a></p>
                            </div>
                            <br />
                            <button className="btn" onClick={handleIniciarSesionUsuario} disabled={isLoading}>
                                {isLoading ? 'Iniciando sesión...' : 'INICIAR SESIÓN'}
                            </button>
                        </form>
                        <p id='create-account'>¿No tienes una cuenta?&nbsp;<a href="#" className='gradient-text' onClick={() => mostrarSeccion('crearCuenta')}>Crear cuenta</a></p>
                    </div>
                </div>
            </section>

            {/*CONTRASEÑA OLVIDADA*/}
            <section className="form-main" style={{ display: mostrarReestablecerContraseña ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h2 id='back-icon' onClick={() => mostrarSeccion('iniciarSesion')}><a href=""><KeyboardBackspaceIcon></KeyboardBackspaceIcon></a></h2>
                        <h3>- REESTABLECER CONTRASEÑA -</h3>
                        <p id='subtitle'>¡Necesitamos que coloques un correo electrónico para ayudarte a reestablecer tu contraseña!</p>
                        <form action="">
                            <div className="inputBox">
                                <input type='text' required={true} onChange={(e) => { setEmail(e.target.value) }} />
                                <span>Correo electrónico</span>
                            </div>
                            <br />
                            <input type="button" className='btn' value="ENVIAR CORREO" onClick={handlePasswordResetRequest} style={{ marginTop: '0.5px' }} />
                        </form>
                    </div>
                </div>
            </section>



            {/*CREAR CUENTA*/}
            <section className="form-main" style={{ display: mostrarCrearCuenta ? '' : 'none' }}>
                <div className="form-content">
                    <div className="box">
                        <h2 id='back-icon' onClick={() => mostrarSeccion('iniciarSesion')}><a href='' style={{ cursor: 'pointer' }}><KeyboardBackspaceIcon></KeyboardBackspaceIcon></a></h2>
                        <h3>- CREAR UNA CUENTA -</h3>
                        {renderStep()}
                        <p id='subtitle'>¿Ya tienes una cuenta?&nbsp;<a style={{ cursor: 'pointer' }} className='gradient-text' onClick={() => mostrarSeccion('iniciarSesion')}>Iniciar sesión</a></p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default LoginCliente

