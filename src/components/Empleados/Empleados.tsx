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
    const [isEditing, setIsEditing] = useState(false);

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
        setIsEditing(true);
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

        setIsEditing(false);
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
                    {empleados.map(empleado => (
                        <div key={empleado.id} className='grid-item'>
                            <div className={`datos ${isEditing ? 'hidden' : ''}`}>
                                <h3>{empleado.nombre}</h3>
                                <h3>{empleado.cuit}</h3>
                                <h3>{empleado.telefono}</h3>
                                <h3>{empleado.email}</h3>
                                {empleado.fechaIngreso && (
                                    <h3>{new Date(empleado.fechaIngreso).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })}</h3>
                                )}


                                <button onClick={() => handleEliminarEmpleado(empleado.cuit)}>ELIMINAR</button>
                                <ModalFlotante isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                                    {selectedCuit && <EliminarEmpleado cuitEmpleado={selectedCuit} />}
                                </ModalFlotante>
                                <button onClick={() => handleEditarEmpleado()}>EDITAR</button>
                            </div>
                            <ModalCrud isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                                <EditarEmpleado empleadoOriginal={empleado} />
                            </ModalCrud>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Empleados
