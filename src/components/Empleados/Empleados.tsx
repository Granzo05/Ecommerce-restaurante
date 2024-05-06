import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import ModalCrud from "../ModalCrud";
import { Empleado } from "../../types/Restaurante/Empleado";
import EliminarEmpleado from "./EliminarEmpleado";
import EditarEmpleado from "./EditarEmpleado";
import '../../styles/empleados.css';
import ModalFlotante from "../ModalFlotante";

const Empleados = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [mostrarEmpleados, setMostrarEmpleados] = useState(true);

    const [showAgregarEmpleadoModal, setShowAgregarEmpleadoModal] = useState(false);
    const [showEditarEmpleadoModal, setShowEditarEmpleadoModal] = useState(false);
    const [showEliminarEmpleadoModal, setShowEliminarEmpleadoModal] = useState(false);

    const [selectedCuit, setSelectedCuit] = useState<string>('');

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
        EmpleadoService.getEmpleados()
            .then(data => {
                setEmpleados(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleAgregarEmpleado = () => {
        setShowAgregarEmpleadoModal(true);
        setShowEditarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(false);
        setMostrarEmpleados(false);
    };

    const handleEditarEmpleado = () => {
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(true);
        setShowEliminarEmpleadoModal(false);
        setMostrarEmpleados(false);
    };

    const handleEliminarEmpleado = (cuil: string) => {
        setSelectedCuit(cuil);
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
        setShowEliminarEmpleadoModal(true);
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
            <h1>Empleados</h1>
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

                                    {empleado.fechaContratacion && empleado.fechaContratacion.map((fecha, index) => (
                                        <tr key={index}>
                                            <td>{fecha.toUTCString()}</td>
                                        </tr>
                                    ))}

                                    <td>
                                        <button onClick={() => handleEliminarEmpleado(empleado.cuil)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarEmpleado()}>EDITAR</button>
                                    </td>
                                    <ModalCrud isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                                        <EditarEmpleado empleadoOriginal={empleado} />
                                    </ModalCrud>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ModalFlotante isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                        {selectedCuit && <EliminarEmpleado cuilEmpleado={selectedCuit} />}
                    </ModalFlotante>
                </div>
            )}
        </div>
    )
}

export default Empleados
