import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import ModalCrud from "../ModalCrud";
import { Empleado } from "../../types/Empleado";
import EliminarEmpleado from "./EliminarEmpleado";
import EditarEmpleado from "./EditarEmpleado";
import '../../styles/empleados.css';
import ModalFlotante from "../ModalFlotante";

const Empleados = () => {
    EmpleadoService.checkUser('negocio');

    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [mostrarEmpleados, setMostrarEmpleados] = useState(true);

    const [showAgregarEmpleadoModal, setShowAgregarEmpleadoModal] = useState(false);
    const [showEditarEmpleadoModal, setShowEditarEmpleadoModal] = useState(false);
    const [showEliminarEmpleadoModal, setShowEliminarEmpleadoModal] = useState(false);

    const [selectedCuit, setSelectedCuit] = useState<number | null>(0);

    useEffect(() => {
        fetchData();

        fetchEmpleados();

    }, []);

    const fetchData = async () => {
        try {
            // Esto retorna true o false
            await EmpleadoService.checkUser('negocio');
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
        setMostrarEmpleados(false);
    };

    const handleEditarEmpleado = () => {
        setShowEditarEmpleadoModal(true);
        setMostrarEmpleados(true);
    };

    const handleEliminarEmpleado = (cuit: number) => {
        setSelectedCuit(cuit);
        setShowEliminarEmpleadoModal(true);
        setMostrarEmpleados(true);

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
                                <th>Cuit</th>
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
                                    <td>{empleado.cuit}</td>
                                    <td>{empleado.telefono}</td>
                                    <td>{empleado.email}</td>
                                    <td>{new Date(empleado.fechaIngreso).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })}</td>

                                    <td>
                                        <button onClick={() => handleEliminarEmpleado(empleado.cuit)}>ELIMINAR</button>
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
                        {selectedCuit && <EliminarEmpleado cuitEmpleado={selectedCuit} />}
                    </ModalFlotante>
                </div>
            )}

        </div>
    )
}

export default Empleados
