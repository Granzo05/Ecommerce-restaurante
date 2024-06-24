import { useEffect, useState } from "react";
import { Empleado } from "../../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../../utils/global_variables/const";
import { Sucursal } from "../../../types/Restaurante/Sucursal";
import { SucursalService } from "../../../services/SucursalService";
import { Cliente } from "../../../types/Cliente/Cliente";
import ModalCrud from "../../ModalCrud";
import EliminarCliente from "./EliminarCliente";
import ActivarCliente from "./ActivarCliente";

const Clientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mostrarClientes, setMostrarClientes] = useState(true);
    const [selectedCliente, setSelectedCliente] = useState<Cliente>();

    useEffect(() => {
        setDatosFiltrados([]);
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            SucursalService.getClientes()
                .then(data => {
                    setClientes(data);
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

    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Cliente[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > clientes.length) {
            setPaginasTotales(1);
            setDatosFiltrados(clientes);
        } else {
            setPaginasTotales(Math.ceil(clientes.length / cantidad));
            setDatosFiltrados(clientes.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = clientes.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(clientes.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(clientes.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (clientes.length > 0) {
            setDatosFiltrados(clientes.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [clientes, paginaActual, cantidadProductosMostrables]);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
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
            setActivateVisible(true);
            setDeleteVisible(true);
        }
    }

    const [showEliminarCategoriaModal, setShowEliminarClienteModal] = useState(false);
    const [showActivarCategoriaModal, setShowActivarClienteModal] = useState(false);

    const handleEliminarCliente = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setMostrarClientes(false);
        setShowActivarClienteModal(false);
        setShowEliminarClienteModal(true);
    };

    const handleActivarCliente = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setMostrarClientes(false);
        setShowActivarClienteModal(true);
        setShowEliminarClienteModal(false);
    };

    const handleModalClose = () => {
        setShowActivarClienteModal(false);
        setShowEliminarClienteModal(false);
        fetchClientes();
        setMostrarClientes(true);
    };

    return (
        <div className="opciones-pantallas">
            <ModalCrud isOpen={showEliminarCategoriaModal} onClose={handleModalClose}>
                {selectedCliente && <EliminarCliente clienteOriginal={selectedCliente} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarCategoriaModal} onClose={handleModalClose}>
                {selectedCliente && <ActivarCliente clienteOriginal={selectedCliente} onCloseModal={handleModalClose} />}
            </ModalCrud>
            <h1>- Clientes -</h1>
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
            {mostrarClientes && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(cliente => (
                                <tr key={cliente.id}>
                                    <td>{cliente.nombre.toString().replace(/_/g, ' ')}</td>

                                    {cliente.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarCliente(cliente)}>BLOQUEAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarCliente(cliente)}>DESBLOQUEAR</button>
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
        </div>
    )
}

export default Clientes
