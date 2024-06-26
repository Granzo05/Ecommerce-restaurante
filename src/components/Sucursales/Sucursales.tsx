import { useEffect, useState } from "react";
import { SucursalService } from "../../services/SucursalService";
import AgregarSucursal from "./AgregarSucursal";
import ModalCrud from "../ModalCrud";
import EliminarSucursal from "./EliminarSucursal";
import EditarSucursal from "./EditarSucursal";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import ActivarSucursal from "./ActivarSucursal";
import '../../styles/sucursales.css'
import { Empleado } from "../../types/Restaurante/Empleado";
import { PrivilegiosService } from "../../services/PrivilegiosService";
import { Privilegios } from "../../types/Restaurante/Privilegios";
import { DESACTIVAR_PRIVILEGIOS, getBaseUrl } from "../../utils/global_variables/const";
import { Empresa } from "../../types/Restaurante/Empresa";
import { toast, Toaster } from "sonner";
import { EmpresaService } from "../../services/EmpresaService";
import ModalFlotante from "../ModalFlotante";

const Sucursales = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal>(new Sucursal());
    const [mostrarSucursales, setMostrarSucursales] = useState(true);

    const [showAgregarSucursalModal, setShowAgregarSucursalModal] = useState(false);
    const [showEditarSucursalModal, setShowEditarSucursalModal] = useState(false);
    const [showEliminarSucursalModal, setShowEliminarSucursalModal] = useState(false);
    const [showActivarSucursalModal, setShowActivarSucursalModal] = useState(false);

    useEffect(() => {
        setDatosFiltrados([]);
        if (sucursales.length === 0) fetchSucursales();
    }, [sucursales]);

    const fetchSucursales = async () => {
        setDatosFiltrados([]);
        EmpresaService.getSucursales()
            .then(data => {
                setSucursales(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const [privilegios, setPrivilegios] = useState<Privilegios[]>([]);
    const [sucursalElegida, setSucursalElegida] = useState<Sucursal>();

    useEffect(() => {
        PrivilegiosService.getPrivilegios()
            .then(data => {
                setPrivilegios(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const [empresa] = useState<Empresa | null>(() => {
        const empleadoString = localStorage.getItem('empresa');

        return empleadoString ? (JSON.parse(empleadoString) as Empresa) : null;
    });


    const [cuit, setCuit] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [showSolicitarCredenciales, setShowSolicitarCredencialesModal] = useState(false);

    const checkCredentials = () => {
        if (cuit.length === 0) {
            toast.error('Debe ingresar un cuit');
            return;
        } else if (contraseña.length === 0) {
            toast.error('Debe ingresar una contraseña');
            return;
        }

        toast.promise(EmpresaService.getEmpresaCredentials(cuit, contraseña), {
            loading: 'Revisando las credenciales...',
            success: (message) => {
                handleModalClose();
                handleAbrirSucursal();
                return message;
            },
            error: (message) => {
                return message;
            }
        });
    };

    const handleAbrirSucursal = () => {
        let restaurante = {
            id: sucursalElegida?.id,
            nombre: empresa?.nombre + ' dentro de ' + sucursalElegida?.nombre,
            empleadoPrivilegios: privilegios,
            empresa: empresa
        }

        localStorage.setItem('sucursal', JSON.stringify(restaurante));

        window.location.href = getBaseUrl() + '/opciones'
    };

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        }
                        if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        }
                        if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        }
                        if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        } else if (empresa) {
            setActivateVisible(true);
            setDeleteVisible(true);
            setUpdateVisible(true);
            setCreateVisible(true);
        }
    }


    const handleAgregarSucursal = () => {
        setShowAgregarSucursalModal(true);
        setMostrarSucursales(false);
    };

    const handleEditarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowEditarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleEliminarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowEliminarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleActivarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowActivarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleModalClose = () => {
        setShowAgregarSucursalModal(false);
        setShowEditarSucursalModal(false);
        setShowEliminarSucursalModal(false);
        setShowActivarSucursalModal(false);
        setShowSolicitarCredencialesModal(false);
        setMostrarSucursales(true);
        fetchSucursales();
    };

    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Sucursal[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > sucursales.length) {
            setPaginasTotales(1);
            setDatosFiltrados(sucursales);
        } else {
            setPaginasTotales(Math.ceil(sucursales.length / cantidad));
            setDatosFiltrados(sucursales.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = sucursales.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(sucursales.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(sucursales.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (sucursales.length > 0) {
            setDatosFiltrados(sucursales.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [sucursales, paginaActual, cantidadProductosMostrables]);

    useEffect(() => {
        if (sucursales.length > 0) cantidadDatosMostrables(11);
    }, [sucursales]);

    return (
        <div className="opciones-pantallas">
            <Toaster />
            {showSolicitarCredenciales && (
                <ModalFlotante isOpen={showSolicitarCredenciales} onClose={handleModalClose}>
                    <div className='modal-info'>
                        <h2>Para acceder necesitamos que ingreses las credenciales de la empresa</h2>
                        <div className="inputBox">
                            <input autoComplete='false' type="text" value={cuit} required={true} onChange={(e) => { setCuit(e.target.value) }} />
                            <span>Cuit</span>
                        </div>

                        <div className="inputBox">
                            <input autoComplete='false' type="text" value={contraseña} required={true} onChange={(e) => { setContraseña(e.target.value) }} />
                            <span>Contraseña</span>
                        </div>
                        <button onClick={checkCredentials}>Confirmar</button>
                        <br />
                        <button onClick={handleModalClose}>Cancelar</button>
                    </div>
                </ModalFlotante>
            )}

            <h1>- Sucursales -</h1>
            {createVisible && (
                <div className="btns-sucursales">
                    <button className="btn-agregar" onClick={() => handleAgregarSucursal()}> + Agregar sucursal</button>
                </div>)}
            <hr />
            <ModalCrud isOpen={showAgregarSucursalModal} onClose={handleModalClose}>
                <AgregarSucursal onCloseModal={handleModalClose} />
            </ModalCrud>

            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={cantidadProductosMostrables} onChange={(e) => cantidadDatosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos">
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarDatos(e.target.value)}
                        />
                        <span>Filtrar por nombre</span>
                    </div>
                </div>


            </div>
            {mostrarSucursales && (
                <div id="sucursales">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Telefono</th>
                                <th>Horario apertura</th>
                                <th>Horario cierre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(sucursal => (
                                <tr key={sucursal.id}>
                                    <td>{sucursal.nombre}</td>
                                    <td>{sucursal.telefono}</td>
                                    <td>{sucursal.horarioApertura}</td>
                                    <td>{sucursal.horarioCierre}</td>
                                    {sucursal.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {createVisible && activateVisible && updateVisible && deleteVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => { setSucursalElegida(sucursal); setShowSolicitarCredencialesModal(true) }}>ABRIR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarSucursal(sucursal)}>ELIMINAR</button>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {createVisible && activateVisible && updateVisible && deleteVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => { setSucursalElegida(sucursal); setShowSolicitarCredencialesModal(true) }}>ABRIR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarSucursal(sucursal)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        {Array.from({ length: paginasTotales }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <ModalCrud isOpen={showEditarSucursalModal} onClose={handleModalClose}>
                        <EditarSucursal sucursalOriginal={selectedSucursal} onCloseModal={handleModalClose} />
                    </ModalCrud>
                    <ModalCrud isOpen={showEliminarSucursalModal} onClose={handleModalClose}>
                        {selectedSucursal && <EliminarSucursal sucursal={selectedSucursal} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                    <ModalCrud isOpen={showActivarSucursalModal} onClose={handleModalClose}>
                        {selectedSucursal && <ActivarSucursal sucursal={selectedSucursal} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                </div>
            )}

        </div>
    )
}

export default Sucursales
