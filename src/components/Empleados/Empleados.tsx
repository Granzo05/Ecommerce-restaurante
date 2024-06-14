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
            console.log(data)
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
            <div className="btns-empleados">
                <button className="btn-agregar" onClick={() => handleAgregarEmpleado()}> + Agregar empleado</button>

            </div>
            <hr />
            <ModalCrud isOpen={showAgregarEmpleadoModal} onClose={handleModalClose}>
                <AgregarEmpleado onCloseModal={handleModalClose} />
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
                                        {empleado.fechaContratacion?.map((fecha, index) => (
                                            <p key={index}>{formatearFechaDDMMYYYY(new Date(fecha.fechaContratacion.toString()))}</p>
                                        ))}
                                    </td>

                                    {empleado.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-empleados">

                                                <button className="btn-accion-editar" onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarEmpleado(empleado)}>ELIMINAR</button>

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-empleados">
                                                <button className="btn-accion-activar" onClick={() => handleActivarEmpleado(empleado)}>ACTIVAR</button>
                                                <button className="btn-accion-editar" onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>

                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>

                    </table>
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
