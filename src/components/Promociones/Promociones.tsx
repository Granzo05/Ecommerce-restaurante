import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarPromocion from "./EditarPromocion";
import ActivarPromocionEntrante from "./ActivarPromocion";
import EliminarPromocionEntrante from "./EliminarPromocion";
import { PromocionService } from "../../services/PromocionService";
import { Promocion } from "../../types/Productos/Promocion";
import AgregarPromocion from "./AgregarPromocion";
import { formatearFechaDDMMYYYY } from "../../utils/global_variables/functions";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";

const Promociones = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [mostrarPromociones, setMostrarPromociones] = useState(true);

    const [showAgregarPromocionModal, setShowAgregarPromocionModal] = useState(false);
    const [showEditarPromocionModal, setShowEditarPromocionModal] = useState(false);
    const [showEliminarPromocionModal, setShowEliminarPromocionModal] = useState(false);
    const [showActivarPromocionModal, setShowActivarPromocionModal] = useState(false);

    const [selectedPromocion, setSelectedPromocion] = useState<Promocion>(new Promocion());

    useEffect(() => {
        buscarPromociones();
    }, []);

    function buscarPromociones() {
        PromocionService.getPromociones()
            .then(data => {
                setPromociones(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

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
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Promociones' && privilegio.permisos.includes('READ')) {
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
        }
    }

    const handleAgregarPromocion = () => {
        setShowAgregarPromocionModal(true);
        setShowEditarPromocionModal(false);
        setShowEliminarPromocionModal(false);
        setShowActivarPromocionModal(false);
        setMostrarPromociones(false);
    };

    const handleEditarPromocion = (promocion: Promocion) => {
        setSelectedPromocion(promocion);
        setShowAgregarPromocionModal(false);
        setShowEditarPromocionModal(true);
        setShowEliminarPromocionModal(false);
        setShowActivarPromocionModal(false);
        setMostrarPromociones(false);
    };

    const handleEliminarPromocion = (promocion: Promocion) => {
        setSelectedPromocion(promocion);
        setShowAgregarPromocionModal(false);
        setShowEditarPromocionModal(false);
        setShowEliminarPromocionModal(true);
        setShowActivarPromocionModal(false);
        setMostrarPromociones(false);
    };

    const handleActivarPromocion = (promocion: Promocion) => {
        setSelectedPromocion(promocion);
        setShowAgregarPromocionModal(false);
        setShowEditarPromocionModal(false);
        setShowEliminarPromocionModal(false);
        setShowActivarPromocionModal(true);
        setMostrarPromociones(false);
    };

    const handleModalClose = () => {
        setShowAgregarPromocionModal(false);
        setShowEditarPromocionModal(false);
        setShowEliminarPromocionModal(false);
        setShowActivarPromocionModal(false);
        setMostrarPromociones(true);
        buscarPromociones();
    };

    function diasRestantes(dateString: string): number {
        const hoy = new Date();
        const fechaLimite = new Date(dateString);

        // Calcula la diferencia en milisegundos
        const diasTotales = fechaLimite.getTime() - hoy.getTime();

        // Convierte la diferencia en milisegundos a días
        const segundos = 1000 * 60 * 60 * 24;
        return Math.ceil(diasTotales / segundos);
    }

    return (
        <div className="opciones-pantallas">

            <h1>- Promoción entrante -</h1>
            {createVisible && (
                <div className="btns-stock">
                    <button className="btn-agregar" onClick={() => handleAgregarPromocion()}> + Agregar promoción</button>
                </div>)}

            <hr />
            <ModalCrud isOpen={showAgregarPromocionModal} onClose={handleModalClose}>
                <AgregarPromocion onCloseModal={handleModalClose} />
            </ModalCrud>


            <ModalCrud isOpen={showEliminarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <EliminarPromocionEntrante promocion={selectedPromocion} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <ActivarPromocionEntrante promocion={selectedPromocion} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <EditarPromocion promocion={selectedPromocion} onCloseModal={handleModalClose} />}
            </ModalCrud>

            {mostrarPromociones && (
                <div id="promociones">
                    <table>
                        <thead>
                            <tr>
                                <th>Duración</th>
                                <th>Detalles de Promoción</th>
                                <th>Costo</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promociones.map(promocion => (
                                <tr key={promocion.id}>
                                    <td>
                                        {formatearFechaDDMMYYYY(new Date(promocion.fechaDesde.toString()))} -
                                        {formatearFechaDDMMYYYY(new Date(promocion.fechaHasta.toString()))}
                                        (Quedan {diasRestantes(promocion.fechaHasta.toString())} días)
                                    </td>
                                    <td>
                                        {promocion.detallesPromocion && promocion.detallesPromocion.map((detalle, index) => (
                                            <div key={index}>
                                                {detalle.articuloMenu?.nombre} {detalle.articuloVenta?.nombre} - {detalle?.cantidad}
                                            </div>
                                        ))}
                                    </td>
                                    <td>{promocion.precio}</td>
                                    <td>
                                        {promocion.borrado === 'NO' ? (
                                            <>
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarPromocion(promocion)}>ELIMINAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarPromocion(promocion)}>EDITAR</button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarPromocion(promocion)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarPromocion(promocion)}>EDITAR</button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            )}

        </div>
    )
}

export default Promociones
