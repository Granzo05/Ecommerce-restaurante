import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { PrivilegiosService } from "../../services/PrivilegiosService";
import { Privilegios } from "../../types/Restaurante/Privilegios";
import { Empleado } from "../../types/Restaurante/Empleado";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import AgregarPrivilegio from "./AgregarPrivilegio";
import ActivarPrivilegio from "./ActivarPrivilegio";
import EditarPrivilegio from "./EditarPrivilegio";
import EliminarPrivilegio from "./EliminarPrivilegio";
import { PrivilegiosSucursales } from "../../types/Restaurante/PrivilegiosSucursales";

const PrivilegiosEmpleados = () => {
    const [privilegios, setPrivilegios] = useState<PrivilegiosSucursales[]>([]);
    const [mostrarPrivilegios, setMostrarPrivilegios] = useState(true);

    const [showAgregarModalPrivilegio, setShowAgregarModalPrivilegio] = useState(false);
    const [showEditarPrivilegioModal, setShowEditarPrivilegioModal] = useState(false);
    const [showEliminarPrivilegioModal, setShowEliminarPrivilegioModal] = useState(false);
    const [showActivarPrivilegioModal, setShowActivarPrivilegioModal] = useState(false);

    const [selectedPrivilegio, setSelectedPrivilegio] = useState<PrivilegiosSucursales>();

    useEffect(() => {
        fetchPrivilegios();
    }, []);

    const fetchPrivilegios = async () => {
        try {
            PrivilegiosService.getPrivilegios()
                .then(data => {
                    setPrivilegios(data);
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
    const [datosFiltrados, setDatosFiltrados] = useState<PrivilegiosSucursales[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > privilegios.length) {
            setPaginasTotales(1);
            setDatosFiltrados(privilegios);
        } else {
            setPaginasTotales(Math.ceil(privilegios.length / cantidad));
            setDatosFiltrados(privilegios.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = privilegios.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(privilegios.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(privilegios.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (privilegios.length > 0) {
            setDatosFiltrados(privilegios.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [privilegios, paginaActual, cantidadProductosMostrables]);

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

    const handleAgregarPrivilegio = () => {
        setShowEditarPrivilegioModal(false);
        setShowEliminarPrivilegioModal(false);
        setMostrarPrivilegios(false);
        setShowAgregarModalPrivilegio(true);
    };

    const handleEditarPrivilegio = (privilegio: PrivilegiosSucursales) => {
        setSelectedPrivilegio(privilegio);
        setShowAgregarModalPrivilegio(false);
        setShowEliminarPrivilegioModal(false);
        setMostrarPrivilegios(false);
        setShowEditarPrivilegioModal(true);
    };

    const handleEliminarPrivilegio = (privilegio: PrivilegiosSucursales) => {
        setSelectedPrivilegio(privilegio);
        setShowAgregarModalPrivilegio(false);
        setShowEditarPrivilegioModal(false);
        setMostrarPrivilegios(false);
        setShowActivarPrivilegioModal(false);
        setShowEliminarPrivilegioModal(true);
    };

    const handleActivarPrivilegio = (privilegio: PrivilegiosSucursales) => {
        setSelectedPrivilegio(privilegio);
        setShowAgregarModalPrivilegio(false);
        setShowEditarPrivilegioModal(false);
        setMostrarPrivilegios(false);
        setShowActivarPrivilegioModal(true);
        setShowEliminarPrivilegioModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalPrivilegio(false);
        setShowEditarPrivilegioModal(false);
        setShowEliminarPrivilegioModal(false);
        setShowActivarPrivilegioModal(false);
        fetchPrivilegios();
        setMostrarPrivilegios(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Privilegios -</h1>

            {createVisible && (
                <div className="btns-privilegios">
                    <button className="btn-agregar" onClick={() => handleAgregarPrivilegio()}> + Agregar privilegio</button>
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
                    <div className="inputBox-filtrado" >
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarDatos(e.target.value)}
                        />
                        <span>Filtrar por nombre</span>
                    </div>
                </div>
            </div>
            {mostrarPrivilegios && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Permisos disponibles</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(privilegio => (
                                <tr key={privilegio.nombre}>
                                    <td>{privilegio.nombre.toString().replace(/_/g, ' ')}</td>

                                    <td>
                                        {privilegio.permisos.map(permiso => (
                                            <td>{permiso}</td>
                                        ))}
                                    </td>

                                    {privilegio.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarPrivilegio(privilegio)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarPrivilegio(privilegio)}>ELIMINAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarPrivilegio(privilegio)}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarPrivilegio(privilegio)}>ACTIVAR</button>
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
            <ModalCrud isOpen={showAgregarModalPrivilegio} onClose={handleModalClose}>
                <AgregarPrivilegio onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarPrivilegioModal} onClose={handleModalClose}>
                {selectedPrivilegio && <EliminarPrivilegio privilegioOriginal={selectedPrivilegio} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarPrivilegioModal} onClose={handleModalClose}>
                {selectedPrivilegio && <ActivarPrivilegio privilegioOriginal={selectedPrivilegio} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarPrivilegioModal} onClose={handleModalClose}>
                {selectedPrivilegio && <EditarPrivilegio privilegioOriginal={selectedPrivilegio} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default PrivilegiosEmpleados
