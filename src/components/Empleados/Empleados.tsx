import { useEffect, useState } from "react";
import { EmpleadoService } from "../../services/EmpleadoService";
import AgregarEmpleado from "./AgregarEmpleado";
import ModalCrud from "../ModalCrud";
import { Empleado } from "../../types/Restaurante/Empleado";
import EditarEmpleado from "./EditarEmpleado";
import '../../styles/empleados.css';
import ModalFlotante from "../ModalFlotante";
import EliminarEmpleado from "./EliminarEmpleado";

const Empleados = () => {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [empleadoEditar, setEmpleadoEditar] = useState<Empleado>(new Empleado);
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
        setEmpleadoEditar(empleado);
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

                                    <td>
                                        <button onClick={() => handleEliminarEmpleado(empleado.cuil)}>ELIMINAR</button>
                                        <button onClick={() => handleEditarEmpleado(empleado)}>EDITAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            <ModalCrud isOpen={showEditarEmpleadoModal} onClose={handleModalClose}>
                <EditarEmpleado empleadoOriginal={empleadoEditar} />
            </ModalCrud>

            <ModalFlotante isOpen={showEliminarEmpleadoModal} onClose={handleModalClose}>
                {selectedCuit && <EliminarEmpleado cuilEmpleado={selectedCuit} />}
            </ModalFlotante>
        </div>
    )
}

export default Empleados
