import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { RolesService } from "../../services/RolesService";
import { Roles } from "../../types/Restaurante/Roles";
import { Empleado } from "../../types/Restaurante/Empleado";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import AgregarRol from "./AgregarRol";
import ActivarRol from "./ActivarRol";
import EditarRol from "./EditarRol";
import EliminarRol from "./EliminarRol";

const RolesEmpleado = () => {
    const [roles, setRoles] = useState<Roles[]>([]);
    const [mostrarRoles, setMostrarRoles] = useState(true);

    const [showAgregarModalRol, setShowAgregarModalRol] = useState(false);
    const [showEditarRolModal, setShowEditarRolModal] = useState(false);
    const [showEliminarRolModal, setShowEliminarRolModal] = useState(false);
    const [showActivarRolModal, setShowActivarRolModal] = useState(false);

    const [selectedRol, setSelectedRol] = useState<Roles>();

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            RolesService.getRoles()
                .then(data => {
                    setRoles(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);


    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Roles[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > roles.length) {
            setPaginasTotales(1);
            setDatosFiltrados(roles);
        } else {
            setPaginasTotales(Math.ceil(roles.length / cantidad));
            setDatosFiltrados(roles.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = roles.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(roles.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(roles.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (roles.length > 0) {
            setDatosFiltrados(roles.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [roles, paginaActual, cantidadProductosMostrables]);

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
        } else if (sucursal && sucursal.id > 0) {
            setCreateVisible(true);
            setActivateVisible(true);
            setDeleteVisible(true);
            setUpdateVisible(true);
        }
    }

    const handleAgregarRol = () => {
        setShowEditarRolModal(false);
        setShowEliminarRolModal(false);
        setMostrarRoles(false);
        setShowAgregarModalRol(true);
    };

    const handleEditarRol = (rol: Roles) => {
        setSelectedRol(rol);
        setShowAgregarModalRol(false);
        setShowEliminarRolModal(false);
        setMostrarRoles(false);
        setShowEditarRolModal(true);
    };

    const handleEliminarRol = (rol: Roles) => {
        setSelectedRol(rol);
        setShowAgregarModalRol(false);
        setShowEditarRolModal(false);
        setMostrarRoles(false);
        setShowActivarRolModal(false);
        setShowEliminarRolModal(true);
    };

    const handleActivarRol = (rol: Roles) => {
        setSelectedRol(rol);
        setShowAgregarModalRol(false);
        setShowEditarRolModal(false);
        setMostrarRoles(false);
        setShowActivarRolModal(true);
        setShowEliminarRolModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalRol(false);
        setShowEditarRolModal(false);
        setShowEliminarRolModal(false);
        setShowActivarRolModal(false);
        fetchRoles();
        setMostrarRoles(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Roles -</h1>

            {createVisible && (
                <div className="btns-roles">
                    <button className="btn-agregar" onClick={() => handleAgregarRol()}> + Agregar rol</button>
                </div>)}
            <hr />
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
            {mostrarRoles && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(rol => (
                                <tr key={rol.id}>
                                    <td>{rol.nombre.toString().replace(/_/g, ' ')}</td>

                                    {rol.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarRol(rol)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarRol(rol)}>ELIMINAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarRol(rol)}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarRol(rol)}>ACTIVAR</button>
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
                </div>
            )}
            <ModalCrud isOpen={showAgregarModalRol} onClose={handleModalClose}>
                <AgregarRol onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarRolModal} onClose={handleModalClose}>
                {selectedRol && <EliminarRol rolOriginal={selectedRol} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarRolModal} onClose={handleModalClose}>
                {selectedRol && <ActivarRol rolOriginal={selectedRol} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarRolModal} onClose={handleModalClose}>
                {selectedRol && <EditarRol rolOriginal={selectedRol} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default RolesEmpleado
