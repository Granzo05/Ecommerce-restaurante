import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import ModalCrud from "../ModalCrud";
import { Empleado } from "../../types/Restaurante/Empleado";
import EditarEmpleado from "./EditarEmpleado";
import '../../styles/empleados.css';
import EliminarEmpleado from "./EliminarEmpleado";
import ActivarEmpleado from "./ActivarEmpleado";
import { formatearFechaDDMMYYYY } from "../../utils/global_variables/functions";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";

const Empleados = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado>();
    const [mostrarEmpleados, setMostrarEmpleados] = useState(true);

    const [showAgregarEmpleadoModal, setShowAgregarEmpleadoModal] = useState(false);
    const [showEditarEmpleadoModal, setShowEditarEmpleadoModal] = useState(false);
    const [showEliminarEmpleadoModal, setShowEliminarEmpleadoModal] = useState(false);
    const [showActivarEmpleadoModal, setShowActivarEmpleadoModal] = useState(false);

    useEffect(() => {
        fetchEmpleados();
    }, []);

    const fetchEmpleados = async () => {
        try {
            let data = await EmpleadoService.getEmpleados();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
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


    const [paginaActual, setPaginaActual] = useState(0);
    const [productosMostrables, setProductosMostrables] = useState<number>(10);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto + productosMostrables;

    // Obtener los elementos de la página actual
    const empleadosFiltrados = empleados.slice(indexUltimoProducto, indexPrimerProducto);

    const paginasTotales = Math.ceil(empleados.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Empleados' && privilegio.permisos.includes('READ')) {
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

    const handleAgregarEmpleado = () => {
        setShowAgregarEmpleadoModal(true);
        setShowEditarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(false);
        setMostrarEmpleados(false);
    };

    const handleEditarEmpleado = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(true);
        setShowEliminarEmpleadoModal(false);
        setMostrarEmpleados(false);
    };

    const handleEliminarEmpleado = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
        setShowActivarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(true);
        setMostrarEmpleados(false);
    };

    const handleActivarEmpleado = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(false);
        setShowActivarEmpleadoModal(true);
        setMostrarEmpleados(false);
    };

    const handleModalClose = () => {
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(false);
        setShowActivarEmpleadoModal(false);
        setMostrarEmpleados(true);
        fetchEmpleados();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Empleados -</h1>
            {createVisible && (
                <div className="btns-empleados">
                    <button className="btn-agregar" onClick={() => handleAgregarEmpleado()}> + Agregar empleado</button>

                </div>
            )}


            <hr />
            <ModalCrud isOpen={showAgregarEmpleadoModal} onClose={handleModalClose}>
                <AgregarEmpleado onCloseModal={handleModalClose} />
            </ModalCrud>

            {mostrarEmpleados && (
                <div id="empleados">
                    <select name="cantidadProductos" value={10} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cuil</th>
                                <th>Telefono</th>
                                <th>Email</th>
                                <th>Domicilios</th>
                                <th>Fecha de ingreso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleadosFiltrados.map(empleado => (
                                <tr key={empleado.id}>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.cuil}</td>
                                    <td>{empleado.telefono}</td>
                                    <td>{empleado.email}</td>
                                    <td>
                                        {empleado.domicilios && empleado.domicilios.map((domicilio, index) => (
                                            <div key={index}>{domicilio.calle}, {domicilio.localidad?.nombre}</div>
                                        ))}
                                    </td>
                                    <td>
                                        {empleado.fechaContratacion?.map((fecha, index) => (
                                            <p key={index}>{formatearFechaDDMMYYYY(new Date(fecha.fechaContratacion.toString()))}</p>
                                        ))}
                                    </td>

                                    {empleado.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-empleados">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarEmpleado(empleado)}>ELIMINAR</button>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-empleados">
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarEmpleado(empleado)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
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

            <ModalCrud isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <EditarEmpleado empleadoOriginal={selectedEmpleado} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <EliminarEmpleado empleadoOriginal={selectedEmpleado} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <ActivarEmpleado empleadoOriginal={selectedEmpleado} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default Empleados
