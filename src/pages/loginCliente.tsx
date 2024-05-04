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


const LoginCliente = () => {
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
        ProvinciaService.getProvincias()
            .then(provincias => {
                setProvincias(provincias);
            })
            .catch(error => {
                console.error("Error al obtener las provincias:", error);
            });
    }, []);

    // Al seleccionar una provincia cargo los departamentos asociados
    async function cargarSelectDepartamentos(idProvincia: number) {
        await DepartamentoService.getDepartamentosByProvinciaId(idProvincia)
            .then(async departamentos => {
                setDepartamentos(departamentos);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }


    async function cargarSelectLocalidades(idDepartamento: number) {
        await LocalidadService.getLocalidadesByDepartamentoId(idDepartamento)
            .then(async localidades => {
                setLocalidades(localidades);
            })
            .catch(error => {
                console.error('Error:', error);
            })
    }

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

        ClienteService.createUser(cliente);
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
        <div className='body'>
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
                            <select
                                name="provincia"
                                onChange={(e) => { cargarSelectDepartamentos(parseInt(e.target.value)) }}
                                required
                            >
                                <option value=''>Selecciona una provincia</option>
                                {provincias?.map((provincia, index) => (
                                    <option key={index} value={provincia.id}>{provincia.nombre}</option>
                                ))}
                            </select>
                            <select
                                name="departamento"
                                onChange={(e) => { cargarSelectLocalidades(parseInt(e.target.value)) }}
                                required
                            >
                                <option value=''>Selecciona un departamento</option>
                                {departamentos?.map((departamento, index) => (
                                    <option key={index} value={departamento.id}>{departamento.nombre}</option>
                                ))}
                            </select>
                            <select
                                name="localidad"
                                onChange={(e) => { setLocalidadId(parseInt(e.target.value)) }}
                                required
                            >
                                <option value=''>Selecciona una localidad</option>
                                {localidades?.map((localidad, index) => (
                                    <option key={index} value={localidad.id}>{localidad.nombre}</option>
                                ))}
                            </select>
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
        </div>
    )
}

export default LoginCliente

