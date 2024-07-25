import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import EliminarMedida from "./EliminarMedida";
import EditarMedida from "./EditarMedida";
import AgregarMedida from "./AgregarMedida";
import ActivarMedida from "./ActivarMedida";
import { Medida } from "../../types/Ingredientes/Medida";
import { MedidaService } from "../../services/MedidaService";
import { Empleado } from "../../types/Restaurante/Empleado";
import { Sucursal } from "../../types/Restaurante/Sucursal";

const Medidas = () => {
    const [medidas, setMedidas] = useState<Medida[]>([]);
    const [mostrarMedidas, setMostrarMedidas] = useState(true);

    const [showAgregarModalMedida, setShowAgregarModalMedida] = useState(false);
    const [showEditarMedidaModal, setShowEditarMedidaModal] = useState(false);
    const [showEliminarMedidaModal, setShowEliminarMedidaModal] = useState(false);
    const [showActivarMedidaModal, setShowActivarMedidaModal] = useState(false);

    const [selectedMedida, setSelectedMedida] = useState<Medida>();

    useEffect(() => {
        setDatosFiltrados([]);
        fetchMedidas();
    }, []);

    const fetchMedidas = async () => {
        setDatosFiltrados([]);
        try {
            MedidaService.getMedidas()
                .then(data => {
                    setMedidas(data);
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

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [activateVisible, setActivateVisible] = useState(false);


    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Medida[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > medidas.length) {
            setPaginasTotales(1);
            setDatosFiltrados(medidas);
        } else {
            setPaginasTotales(Math.ceil(medidas.length / cantidad));
            setDatosFiltrados(medidas.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    useEffect(() => {
        if (medidas.length > 0) cantidadDatosMostrables(11);
    }, [medidas]);

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = medidas.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(medidas.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(medidas.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (medidas.length > 0) {
            setDatosFiltrados(medidas.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [medidas, paginaActual, cantidadProductosMostrables]);

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

    const handleAgregarMedida = () => {
        setShowEditarMedidaModal(false);
        setShowEliminarMedidaModal(false);
        setMostrarMedidas(false);
        setShowAgregarModalMedida(true);
    };

    const handleEditarMedida = (medida: Medida) => {
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEliminarMedidaModal(false);
        setMostrarMedidas(false);
        setShowEditarMedidaModal(true);
    };

    const handleEliminarMedida = (medida: Medida) => {
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setMostrarMedidas(false);
        setShowActivarMedidaModal(false);
        setShowEliminarMedidaModal(true);
    };

    const handleActivarMedida = (medida: Medida) => {
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setMostrarMedidas(false);
        setShowActivarMedidaModal(true);
        setShowEliminarMedidaModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setShowEliminarMedidaModal(false);
        setShowActivarMedidaModal(false);
        fetchMedidas();
        setMostrarMedidas(true);
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Medidas -</h1>

            {createVisible && (
                <div className="btns-empleados">
                    <button className="btn-agregar" onClick={() => handleAgregarMedida()}> + Agregar medida</button>
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
            {mostrarMedidas && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(medida => (
                                <tr key={medida.id}>
                                    <td>{capitalizeFirstLetter(medida.nombre.toString().replace(/_/g, ' '))}</td>

                                    {medida.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarMedida(medida)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarMedida(medida)}>ELIMINAR</button>
                                                )}
                                                {!updateVisible && !deleteVisible && (
                                                    <p>No tenes privilegios para interactuar con estos datos</p>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarMedida(medida)}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarMedida(medida)}>ACTIVAR</button>
                                                )}
                                                {!updateVisible && !activateVisible && (
                                                    <p>No tenes privilegios para interactuar con estos datos</p>
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
            <ModalCrud isOpen={showAgregarModalMedida} onClose={handleModalClose}>
                <AgregarMedida onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <EliminarMedida medidaOriginal={selectedMedida} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <ActivarMedida medidaOriginal={selectedMedida} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <EditarMedida medidaOriginal={selectedMedida} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default Medidas
