import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarPromocion from "./EditarPromocion";
import ActivarPromocionEntrante from "./ActivarPromocion";
import EliminarPromocionEntrante from "./EliminarPromocion";
import { PromocionService } from "../../services/PromocionService";
import { Promocion } from "../../types/Productos/Promocion";
import AgregarPromocion from "./AgregarPromocion";

const Promociones = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [mostrarPromociones, setMostrarPromociones] = useState(true);

    const [showAgregarPromocionModal, setShowAgregarPromocionModal] = useState(false);
    const [showEditarPromocionModal, setShowEditarPromocionModal] = useState(false);
    const [showEliminarPromocionModal, setShowEliminarPromocionModal] = useState(false);
    const [showActivarPromocionModal, setShowActivarPromocionModal] = useState(false);

    const [selectedPromocion, setSelectedPromocion] = useState<Promocion>(new Promocion());

    const formatDate = (date: Date) => {
        const dia = date.getDate() + 1;
        const mes = date.getMonth() + 1;
        const año = date.getFullYear();

        const diaFormateado = dia < 10 ? `0${dia}` : dia;
        const mesFormateado = mes < 10 ? `0${mes}` : mes;

        return `${diaFormateado}/${mesFormateado}/${año}`;
    };

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

            <h1>- Promocion entrante -</h1>
            <div className="btns-promocion">
                <button className="btn-agregar" onClick={() => handleAgregarPromocion()}> + Agregar promocion entrante</button>
            </div>

            <hr />
            <ModalCrud isOpen={showAgregarPromocionModal} onClose={handleModalClose}>
                <AgregarPromocion />
            </ModalCrud>


            <ModalCrud isOpen={showEliminarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <EliminarPromocionEntrante promocion={selectedPromocion} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <ActivarPromocionEntrante promocion={selectedPromocion} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarPromocionModal} onClose={handleModalClose}>
                {selectedPromocion && <EditarPromocion promocion={selectedPromocion} />}
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
                                        {formatDate(new Date(promocion.fechaDesde.toString()))} -
                                        {formatDate(new Date(promocion.fechaHasta.toString()))}
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
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarPromocion(promocion)}>ELIMINAR</button>
                                                <button className="btn-accion-editar" onClick={() => handleEditarPromocion(promocion)}>EDITAR</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn-accion-activar" onClick={() => handleActivarPromocion(promocion)}>ACTIVAR</button>
                                                <button className="btn-accion-editar" onClick={() => handleEditarPromocion(promocion)}>EDITAR</button>
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
