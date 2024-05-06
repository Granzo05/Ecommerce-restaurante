import { useEffect, useState } from 'react'
import '../styles/login.css';
import { ClienteService } from '../services/ClienteService'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Domicilio } from '../types/Domicilio/Domicilio';
import { Provincia } from '../types/Domicilio/Provincia';
import { Localidad } from '../types/Domicilio/Localidad';
import { LocalidadService } from '../services/LocalidadService';
import { Departamento } from '../types/Domicilio/Departamento';
import { ProvinciaService } from '../services/ProvinciaService';
import { DepartamentoService } from '../services/DepartamentoService';
import { Cliente } from '../types/Cliente/Cliente';
import { Toaster, toast } from 'sonner'
import { useDebounce } from '@uidotdev/usehooks';
import Logo from '../assets/img/HatchfulExport-All/logo_transparent_header.png'

const LoginCliente = () => {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 5000);

    const [inputValueProvincia, setInputValueProvincia] = useState('');
    const [inputValueDepartamento, setInputValueDepartamento] = useState('');
    const [inputValueLocalidad, setInputValueLocalidad] = useState('');

    const [resultadosProvincias, setResultadosProvincias] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
    const [resultadosDepartamentos, setResultadosDepartamentos] = useState<Departamento[] | Localidad[] | Provincia[]>([]);
    const [resultadosLocalidades, setResultadosLocalidades] = useState<Departamento[] | Localidad[] | Provincia[]>([]);

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [calle, setCalle] = useState('');
    const [numeroCasa, setNumeroCasa] = useState(0);
    const [fechaNacimiento, setFechaNacimiento] = useState<Date>(new Date());
    const [codigoPostal, setCodigoPostal] = useState(0);
    const [localidadId, setLocalidadId] = useState(0);
    const [apellido, setApellido] = useState('');
    const [telefono, setTelefono] = useState(0);
    const [provincias, setProvincias] = useState<Provincia[] | null>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[] | null>([]);
    const [localidades, setLocalidades] = useState<Localidad[] | null>([]);

    const handleIniciarSesionUsuario = () => {
        ClienteService.getUser(email, contraseña);
    };

    useEffect(() => {
        cargarProvincias();
    }, []);

    useEffect(() => {
        // Si se deja de escribir de borran todas las recomendaciones
        setResultadosDepartamentos([])
        setResultadosLocalidades([])
        setResultadosProvincias([])
    }, [debouncedInputValue]);

    // Una vez cargadas las provincias vuelvo a cargar el select
    async function cargarProvincias() {
        await ProvinciaService.getProvincias()
            .then(data => {
                setProvincias(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Al seleccionar una provincia cargo los departamentos asociados
    async function cargarDepartamentos(idProvincia: number) {
        await DepartamentoService.getDepartamentosByProvinciaId(idProvincia)
            .then(async departamentos => {
                setDepartamentos(departamentos);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }

    async function cargarLocalidades(idDepartamento: number) {
        console.log(idDepartamento)
        await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento)
            .then(async localidades => {
                setLocalidades(localidades);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }

    const handleInputProvinciaChange = (value: string) => {
        setInputValue(value);
        setInputValueProvincia(value);

        const provinciasFiltradas = provincias?.filter(provincia =>
            provincia.nombre.toLowerCase().includes(value.toLowerCase())
        );

        if (provinciasFiltradas && provinciasFiltradas.length > 1) {
            setResultadosProvincias(provinciasFiltradas);
        } else if (provinciasFiltradas && provinciasFiltradas.length === 1) {
            // Si solamente tengo un resultado entonces actualizo el valor del Input a ese
            setResultadosProvincias(provinciasFiltradas);
            cargarDepartamentos(provinciasFiltradas[0].id)
        }
    };

    const handleInputDepartamentoChange = (value: string) => {
        setInputValue(value);
        setInputValueDepartamento(value);
        const departamentosFiltrados = departamentos?.filter(departamento =>
            departamento.nombre.toLowerCase().includes(value.toLowerCase())
        );

        if (departamentosFiltrados && departamentosFiltrados.length > 1) {
            setResultadosDepartamentos(departamentosFiltrados);
        } else if (departamentosFiltrados && departamentosFiltrados.length === 1) {
            setResultadosDepartamentos(departamentosFiltrados);
            cargarLocalidades(departamentosFiltrados[0].id)
        }
    };

    const handleInputLocalidadChange = (value: string) => {
        setInputValue(value);
        setInputValueLocalidad(value);
        const localidadesFiltradas = localidades?.filter(localidad =>
            localidad.nombre.toLowerCase().includes(value.toLowerCase())
        );

        if (localidadesFiltradas && localidadesFiltradas.length > 1) {
            setResultadosLocalidades(localidadesFiltradas);
        } else if (localidadesFiltradas && localidadesFiltradas.length === 1) {
            setResultadosLocalidades(localidadesFiltradas);
            setLocalidadId(localidadesFiltradas[0].id)
        }
    };

    const handleCargarUsuario = () => {
        const cliente = new Cliente();

        let domicilio = new Domicilio();
        domicilio.calle = calle;
        domicilio.codigoPostal = codigoPostal;
        domicilio.numero = numeroCasa;

        if (localidades) {
            let localidad = localidades.find(localidad => localidad.id === localidadId);
            domicilio.localidad = localidad;
        }

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
                            <input
                                value={inputValueProvincia}
                                type="text"
                                onChange={(e) => { handleInputProvinciaChange(e.target.value) }}
                                placeholder="Buscar provincia..."
                            />
                            <ul className='lista-recomendaciones'>
                                {resultadosProvincias?.map((provincia, index) => (
                                    <li className='opcion-recomendada' key={index} onClick={() => {
                                        setInputValueProvincia(provincia.nombre)
                                        setResultadosProvincias([])
                                    }}>
                                        {provincia.nombre}
                                    </li>
                                ))}
                            </ul>
                            <br />
                            <h2>Departamento</h2>
                            <input
                                type="text"
                                value={inputValueDepartamento}
                                onChange={(e) => { handleInputDepartamentoChange(e.target.value) }}
                                placeholder="Buscar departamento..."
                            />
                            <ul className='lista-recomendaciones'>
                                {resultadosDepartamentos?.map((departamento, index) => (
                                    <li className='opcion-recomendada' key={index} onClick={() => {
                                        setInputValueDepartamento(departamento.nombre)
                                        setResultadosDepartamentos([])
                                        cargarLocalidades(departamento.id)

                                    }}>
                                        {departamento.nombre}
                                    </li>))}
                            </ul>

                            <br />
                            <h2>Localidad</h2>
                            <input
                                type="text"
                                value={inputValueLocalidad}
                                onChange={(e) => { handleInputLocalidadChange(e.target.value) }}
                                placeholder="Buscar localidad..."
                            />
                            <ul className='lista-recomendaciones'>
                                {resultadosLocalidades?.map((localidad, index) => (
                                    <li className='opcion-recomendada' key={index} onClick={() => {
                                        setInputValueLocalidad(localidad.nombre)
                                        setResultadosLocalidades([])
                                        setLocalidadId(localidad.id)

                                    }}>
                                        {localidad.nombre}
                                    </li>
                                ))}
                            </ul>

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

