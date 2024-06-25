import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import EditarPromocion from "./EditarPromocion";
import ActivarPromocionEntrante from "./ActivarPromocion";
import EliminarPromocionEntrante from "./EliminarPromocion";
import { PromocionService } from "../../services/PromocionService";
import { Promocion } from "../../types/Productos/Promocion";
import AgregarPromocion from "./AgregarPromocion";
import { formatearFechaYYYYMMDD } from "../../utils/global_variables/functions";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";

const Promociones = () => {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [mostrarPromociones, setMostrarPromociones] = useState(true);

    const [showAgregarPromocionModal, setShowAgregarPromocionModal] = useState(false);
    const [showEditarPromocionModal, setShowEditarPromocionModal] = useState(false);
    const [showEliminarPromocionModal, setShowEliminarPromocionModal] = useState(false);
    const [showActivarPromocionModal, setShowActivarPromocionModal] = useState(false);

    const [selectedPromocion, setSelectedPromocion] = useState<Promocion>(new Promocion());

    useEffect(() => {
        setDatosFiltrados([]);
        buscarPromociones();
    }, []);

    function buscarPromociones() {
        setDatosFiltrados([]);
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
    const [datosFiltrados, setDatosFiltrados] = useState<Promocion[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > promociones.length) {
            setPaginasTotales(1);
            setDatosFiltrados(promociones);
        } else {
            setPaginasTotales(Math.ceil(promociones.length / cantidad));
            setDatosFiltrados(promociones.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    const [signoPrecio, setSignoPrecio] = useState('>');

    const [precioBuscado, setPrecioBuscado] = useState<number>(0);

    useEffect(() => {
        filtrarPrecio();
    }, [signoPrecio, precioBuscado]);

    function filtrarPrecio() {
        const comparadores: { [key: string]: (a: number, b: number) => boolean } = {
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '>=': (a, b) => a >= b,
            '<=': (a, b) => a <= b,
            '=': (a, b) => a === b
        };

        if (precioBuscado > 0 && comparadores[signoPrecio] && datosFiltrados.length > 0) {
            const filtradas = datosFiltrados.filter(recomendacion =>
                comparadores[signoPrecio](recomendacion.precio, precioBuscado)
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else if (precioBuscado > 0 && comparadores[signoPrecio] && promociones.length > 0) {
            const filtradas = promociones.filter(recomendacion =>
                comparadores[signoPrecio](recomendacion.precio, precioBuscado)
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(promociones.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(promociones.length / cantidadProductosMostrables));
        }
    }

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        if (fechaInicio.length > 0 && fechaFin.length > 0) {
            const fechaFiltroInicio = formatearFechaYYYYMMDD(new Date(fechaInicio));
            const fechaFiltroFin = formatearFechaYYYYMMDD(new Date(fechaFin));

            if (fechaFiltroInicio && fechaFiltroFin) {
                const filtradas = promociones.filter(promocion => {
                    const fechaPromocionDesde = formatearFechaYYYYMMDD(new Date(promocion.fechaDesde));
                    const fechaPromocionHasta = formatearFechaYYYYMMDD(new Date(promocion.fechaHasta));
                    if (fechaPromocionDesde && fechaPromocionHasta) return fechaPromocionDesde >= fechaFiltroInicio && fechaPromocionHasta <= fechaFiltroFin;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else if (fechaInicio.length > 0) {
            const fechaFiltro = formatearFechaYYYYMMDD(new Date(fechaInicio));
            if (fechaFiltro) {
                const filtradas = promociones.filter(promocion => {
                    const fechaPromocion = formatearFechaYYYYMMDD(new Date(promocion.fechaDesde));
                    if (fechaPromocion) return fechaPromocion >= fechaFiltro;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else if (fechaFin.length > 0) {
            const fechaFiltro = formatearFechaYYYYMMDD(new Date(fechaInicio));
            if (fechaFiltro) {
                const filtradas = promociones.filter(promocion => {
                    const fechaPromocion = formatearFechaYYYYMMDD(new Date(promocion.fechaHasta));
                    if (fechaPromocion) return fechaPromocion <= fechaFiltro;
                });

                setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
                setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
            }
        } else {
            setDatosFiltrados(promociones.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(promociones.length / cantidadProductosMostrables));
        }
    }, [fechaInicio, fechaFin]);

    useEffect(() => {
        if (promociones.length > 0) {
            setDatosFiltrados(promociones.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [promociones, paginaActual, cantidadProductosMostrables]);

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

    function tiempoRestante(fechaHasta: string | number | Date) {
        // Convertir la fechaHasta a un objeto Date
        const fechaHastaDate = new Date(fechaHasta);
        const hoy = new Date();

        // Calcular la diferencia en milisegundos
        const diferencia = fechaHastaDate.getTime() - hoy.getTime();

        // Calcular días, horas, minutos y segundos restantes
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);



        if (diferencia > 0) {
            // Si diferencia es positiva, falta tiempo para que empiece la promoción
            if (dias > 0) {
                return `Faltan ${dias} días`;
            } else if (horas > 0) {
                return `Faltan ${horas} horas`;
            } else if (minutos > 0) {
                return `Faltan ${minutos} minutos`;
            } else {
                return `Faltan ${segundos} segundos`;
            }
        } else if (diferencia < 0) {
            if (dias > 0) {
                return `Quedan ${dias} días`;
            } else if (horas > 0) {
                return `Quedan ${horas} horas`;
            } else if (minutos > 0) {
                return `Quedan ${minutos} minutos`;
            } else if (segundos > 0) {
                return `Quedan ${segundos} segundos`;
            } else if (segundos < 0) {
                return 'La promoción ha caducado'
            }
        } else {
            // Si diferencia es cero, se está en el momento exacto de inicio
            return 'La promoción está comenzando justo ahora';
        }


    }

    function mostrarFecha(fecha: Date) {
        // Obtener los componentes de la fecha
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');

        // Formatear la fecha y hora
        return `${dia}-${mes}-${año} - ${horas}:${minutos} `;
    }

    return (
        <div className="opciones-pantallas">

            <h1>- Promoción -</h1>
            {createVisible && (
                <div className="btns-empleados">
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
                    <div className="inputBox-filtrado-fechas" style={{ marginRight: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Fecha inicio:</label>

                        <input
                            type="date"
                            required
                            onChange={(e) => setFechaInicio(e.target.value)}
                        />
                    </div>
                    <div className="inputBox-filtrado-fechas" style={{ marginRight: '10px' }}>
                        <label style={{ fontWeight: 'bold' }}>Fecha fin:</label>

                        <input
                            type="date"
                            required
                            onChange={(e) => setFechaFin(e.target.value)}
                        />
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="number"
                            required
                            onChange={(e) => setPrecioBuscado(parseInt(e.target.value))}
                        />
                        <span>Filtrar por precio</span>

                    </div>
                    <div className="inputBox-filtrado" style={{ marginLeft: '-15px' }}>
                        <select id="signos" name="signo" value={signoPrecio} onChange={(e) => setSignoPrecio(e.target.value)}>
                            <option value=">">&gt;</option>
                            <option value="<">&lt;</option>
                            <option value=">=">&gt;=</option>
                            <option value="<=">&lt;=</option>
                            <option value="=">=</option>
                        </select>
                    </div>
                </div>


            </div>
            {mostrarPromociones && (
                <div id="promociones">
                    <table>
                        <thead>
                            <tr>
                                <th>Duración</th>
                                <th>Detalles de Promoción</th>
                                <th>Precio final</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(promocion => (
                                <tr key={promocion.id}>
                                    <td>
                                        Desde: {mostrarFecha(new Date(promocion.fechaDesde))}| Hasta: {mostrarFecha(new Date(promocion.fechaHasta))}
                                        ({tiempoRestante(promocion.fechaHasta.toString())})
                                    </td>
                                    <td>
                                        {promocion.detallesPromocion && promocion.detallesPromocion.map((detalle, index) => (
                                            <div key={index}>
                                                {detalle.articuloMenu?.nombre} {detalle.articuloVenta?.nombre} - {detalle?.cantidad}
                                            </div>
                                        ))}
                                    </td>
                                    <td>${promocion.precio}</td>
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
                    <div className="pagination">
                        {Array.from({ length: paginasTotales }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

export default Promociones
