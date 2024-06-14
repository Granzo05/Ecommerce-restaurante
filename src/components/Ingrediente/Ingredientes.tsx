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

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Articulos de venta' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        } else if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        } else if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        } else if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
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
                            {ingredientes.map(ingrediente => (
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
