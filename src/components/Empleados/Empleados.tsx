import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import Modal from "../Modal";
import { Empleado } from "../../types/Empleado";
import EliminarEmpleado from "./EliminarEmpleado";
import EditarEmpleado from "./EditarEmpleado";

const Empleados = () => {
    EmpleadoService.checkUser('empleado');

    const [empleados, setEmpleados] = useState<Empleado[]>([]);

    const [showAgregarEmpleadoModal, setShowAgregarEmpleadoModal] = useState(false);
    const [showEditarEmpleadoModal, setShowEditarEmpleadoModal] = useState(false);
    const [showEliminarEmpleadoModal, setShowEliminarEmpleadoModal] = useState(false);

    const [selectedEmpleado, setSelectedEmpleado] = useState<Empleado | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(0);

    useEffect(() => {
        EmpleadoService.getEmpleados()
            .then(data => {
                setEmpleados(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    const handleAgregarEmpleado = () => {
        setShowAgregarEmpleadoModal(true);
    };

    const handleEditarEmpleado = (empleado: Empleado) => {
        setSelectedEmpleado(empleado);
        setShowEditarEmpleadoModal(true);
    };

    const handleEliminarEmpleado = (empleadoId: number) => {
        setSelectedId(empleadoId);
        setShowEliminarEmpleadoModal(true);
    };

    const handleModalClose = () => {
        setShowAgregarEmpleadoModal(false);
        setShowEditarEmpleadoModal(false);
    };

    return (
        <div className="opciones-pantallas">
            <h1>Empleados</h1>
            <button onClick={() => handleAgregarEmpleado()}> + Agregar empleado</button>

            <Modal isOpen={showAgregarEmpleadoModal} onClose={handleModalClose}>
                <AgregarEmpleado />
            </Modal>

            <div id="empleados">
                {empleados.map(empleado => (
                    <div key={empleado.id} className="grid-item">
                        <h3>{empleado.nombre}</h3>
                        <h3>{empleado.cuit}</h3>
                        <h3>{empleado.telefono}</h3>
                        <h3>{empleado.email}</h3>
                        <h3>{empleado.fechaEntrada.toISOString()}</h3>
                        <h3>{empleado.contraseña}</h3>

                        <button onClick={() => handleEliminarEmpleado(empleado.id)}>ELIMINAR</button>
                        <Modal isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                            {selectedId && <EliminarEmpleado empleadoId={selectedId} />}
                        </Modal>
                        <button onClick={() => handleEditarEmpleado}>EDITAR</button>
                        <Modal isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                            {selectedEmpleado && <EditarEmpleado empleadoOriginal={selectedEmpleado} />}
                        </Modal>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Empleados
