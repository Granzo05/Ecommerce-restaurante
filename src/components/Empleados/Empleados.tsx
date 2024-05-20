import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import ModalCrud from "../ModalCrud";
import { Empleado } from "../../types/Restaurante/Empleado";
import EditarEmpleado from "./EditarEmpleado";
import '../../styles/empleados.css';
import ModalFlotante from "../ModalFlotante";
import EliminarEmpleado from "./EliminarEmpleado";
import ActivarEmpleado from "./ActivarEmpleado";

const Empleados = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado>();
    const [mostrarEmpleados, setMostrarEmpleados] = useState(true);

    const [showAgregarEmpleadoModal, setShowAgregarEmpleadoModal] = useState(false);
    const [showEditarEmpleadoModal, setShowEditarEmpleadoModal] = useState(false);
    const [showEliminarEmpleadoModal, setShowEliminarEmpleadoModal] = useState(false);
    const [showActivarEmpleadoModal, setShowActivarEmpleadoModal] = useState(false);

    useEffect(() => {
        fetchData();
        fetchEmpleados();
    }, []);

    const fetchData = async () => {
        try {
            await EmpleadoService.checkUser();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchEmpleados = async () => {
        try {

            let data = await EmpleadoService.getEmpleados();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };


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
        empleado.borrado = 'SI';
        setSelectedEmpleado(empleado);
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
        setShowActivarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(true);
        setMostrarEmpleados(false);
    };

    const handleActivarEmpleado = (empleado: Empleado) => {
        empleado.borrado = 'NO';
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
        setMostrarEmpleados(true);
        fetchEmpleados();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Empleados -</h1>
            <button onClick={() => handleAgregarEmpleado()}> + Agregar empleado</button>

            <ModalCrud isOpen={showAgregarEmpleadoModal} onClose={handleModalClose}>
                <AgregarEmpleado />
            </ModalCrud>

            {mostrarEmpleados && (
                <div id="empleados">
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
                            {empleados.map(empleado => (
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
                                        {empleado.fechaContratacionEmpleado && empleado.fechaContratacionEmpleado.map((fecha, index) => (
                                            <div key={index}>{new Date(fecha.fechaContratacion).toLocaleString('es-AR')}</div>
                                        ))}
                                    </td>

                                    {empleado.borrado === 'NO' ? (
                                        <td>
                                            <button onClick={() => handleEliminarEmpleado(empleado)}>ELIMINAR</button>
                                            <button onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
                                        </td>
                                    ) : (
                                        <td>
                                            <button onClick={() => handleActivarEmpleado(empleado)}>ACTIVAR</button>
                                            <button onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            <ModalCrud isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <EditarEmpleado empleadoOriginal={selectedEmpleado} />}
            </ModalCrud>

            <ModalFlotante isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <EliminarEmpleado empleadoOriginal={selectedEmpleado} />}
            </ModalFlotante>

            <ModalFlotante isOpen={showActivarEmpleadoModal} onClose={handleModalClose}>
                {selectedEmpleado && <ActivarEmpleado empleadoOriginal={selectedEmpleado} />}
            </ModalFlotante>
        </div>
    )
}

export default Empleados
