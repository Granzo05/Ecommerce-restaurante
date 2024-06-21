import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import '../../styles/ingredientes.css'
import { IngredienteService } from "../../services/IngredienteService";
import { Ingrediente } from "../../types/Ingredientes/Ingrediente";
import EliminarIngrediente from "./EliminarIngrediente";
import EditarIngrediente from "./EditarIngrediente";
import AgregarIngrediente from "./AgregarIngrediente";
import ActivarIngrediente from "./ActivarIngrediente";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";

const Ingredientes = () => {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [mostrarIngredientes, setMostrarIngredientes] = useState(true);

    const [showAgregarModalIngrediente, setShowAgregarModalIngrediente] = useState(false);
    const [showEditarIngredienteModal, setShowEditarIngredienteModal] = useState(false);
    const [showEliminarIngredienteModal, setShowEliminarIngredienteModal] = useState(false);
    const [showActivarIngredienteModal, setShowActivarIngredienteModal] = useState(false);

    const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente>();

    useEffect(() => {
        fetchIngredientes();
    }, []);

    const fetchIngredientes = async () => {
        try {
            IngredienteService.getIngredientes()
                .then(data => {
                    setIngredientes(data);
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
    const [datosFiltrados, setDatosFiltrados] = useState<Ingrediente[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > ingredientes.length) {
            setPaginasTotales(1);
            setDatosFiltrados(ingredientes);
        } else {
            setPaginasTotales(Math.ceil(ingredientes.length / cantidad));
            setDatosFiltrados(ingredientes.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarDatos(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = ingredientes.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(ingredientes.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(ingredientes.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (ingredientes.length > 0) {
            setDatosFiltrados(ingredientes.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [ingredientes, paginaActual, cantidadProductosMostrables]);

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

    const handleAgregarIngrediente = () => {
        setShowEditarIngredienteModal(false);
        setShowEliminarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowAgregarModalIngrediente(true);
    };

    const handleEditarIngrediente = (ingrediente: Ingrediente) => {
        setSelectedIngrediente(ingrediente);
        setShowAgregarModalIngrediente(false);
        setShowEliminarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowEditarIngredienteModal(true);
    };

    const handleEliminarIngrediente = (ingrediente: Ingrediente) => {
        setSelectedIngrediente(ingrediente);
        setShowAgregarModalIngrediente(false);
        setShowEditarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowActivarIngredienteModal(false);
        setShowEliminarIngredienteModal(true);
    };

    const handleActivarIngrediente = (ingrediente: Ingrediente) => {
        setSelectedIngrediente(ingrediente);
        setShowAgregarModalIngrediente(false);
        setShowEditarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowActivarIngredienteModal(true);
        setShowEliminarIngredienteModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalIngrediente(false);
        setShowEditarIngredienteModal(false);
        setShowEliminarIngredienteModal(false);
        setShowActivarIngredienteModal(false);
        fetchIngredientes();
        setMostrarIngredientes(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Ingredientes -</h1>

            {createVisible && (
                <div className="btns-ingredientes">
                    <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
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
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarDatos(e.target.value)}
                        />
                        <span>Filtrar por nombre</span>
                    </div>

                </div>


            </div>
            {mostrarIngredientes && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(ingrediente => (
                                <tr key={ingrediente.id}>
                                    <td>{ingrediente.nombre}</td>

                                    {ingrediente.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarIngrediente(ingrediente)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarIngrediente(ingrediente)}>ELIMINAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarIngrediente(ingrediente)}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarIngrediente(ingrediente)}>ACTIVAR</button>
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
            <ModalCrud isOpen={showAgregarModalIngrediente} onClose={handleModalClose}>
                <AgregarIngrediente onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <EliminarIngrediente ingredienteOriginal={selectedIngrediente} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <ActivarIngrediente ingredienteOriginal={selectedIngrediente} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <EditarIngrediente ingredienteOriginal={selectedIngrediente} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default Ingredientes
