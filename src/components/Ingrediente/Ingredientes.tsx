import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import { EmpleadoService } from "../../services/EmpleadoService";
import '../../styles/stock.css';
import '../../styles/ingredientes.css'
import { IngredienteService } from "../../services/IngredienteService";
import { Ingrediente } from "../../types/Ingredientes/Ingrediente";
import EliminarIngrediente from "./EliminarIngrediente";
import EditarIngrediente from "./EditarIngrediente";
import AgregarIngrediente from "./AgregarIngrediente";
import ActivarIngrediente from "./ActivarIngrediente";

const Ingredientes = () => {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [mostrarIngredientes, setMostrarIngredientes] = useState(true);

    const [showAgregarModalIngrediente, setShowAgregarModalIngrediente] = useState(false);
    const [showEditarIngredienteModal, setShowEditarIngredienteModal] = useState(false);
    const [showEliminarIngredienteModal, setShowEliminarIngredienteModal] = useState(false);
    const [showActivarIngredienteModal, setShowActivarIngredienteModal] = useState(false);

    const [selectedIngrediente, setSelectedIngrediente] = useState<Ingrediente>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Esto retorna true o false
                await EmpleadoService.checkUser();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
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

    const handleAgregarIngrediente = () => {
        setShowEditarIngredienteModal(false);
        setShowEliminarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowAgregarModalIngrediente(true);
    };

    const handleEditarIngrediente = (ingrediente: Ingrediente) => {
        console.log(ingrediente)
        setSelectedIngrediente(ingrediente);
        setShowAgregarModalIngrediente(false);
        setShowEliminarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowEditarIngredienteModal(true);
    };

    const handleEliminarIngrediente = (ingrediente: Ingrediente) => {
        ingrediente.borrado = 'SI';
        setSelectedIngrediente(ingrediente);
        setShowAgregarModalIngrediente(false);
        setShowEditarIngredienteModal(false);
        setMostrarIngredientes(false);
        setShowActivarIngredienteModal(false);
        setShowEliminarIngredienteModal(true);
    };

    const handleActivarIngrediente = (ingrediente: Ingrediente) => {
        ingrediente.borrado = 'NO';
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
        fetchIngredientes();
        setMostrarIngredientes(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Ingredientes -</h1>
            <div className="btns-ingredientes">
            <button className="btn-agregar" onClick={() => handleAgregarIngrediente()}> + Agregar ingrediente</button>
            </div>
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
                                                
                                            <button className="btn-accion-editar" onClick={() => handleEditarIngrediente(ingrediente)}>EDITAR</button>
                                            <button className="btn-accion-eliminar" onClick={() => handleEliminarIngrediente(ingrediente)}>ELIMINAR</button>
                                            </div>
                                            
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                
                                            <button className="btn-accion-editar" onClick={() => handleEditarIngrediente(ingrediente)}>EDITAR</button>
                                            <button className="btn-accion-activar" onClick={() => handleActivarIngrediente(ingrediente)}>ACTIVAR</button>
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
                <AgregarIngrediente />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <EliminarIngrediente ingredienteOriginal={selectedIngrediente} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <ActivarIngrediente ingredienteOriginal={selectedIngrediente} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarIngredienteModal} onClose={handleModalClose}>
                {selectedIngrediente && <EditarIngrediente ingredienteOriginal={selectedIngrediente} />}
            </ModalCrud>
        </div>
    )
}

export default Ingredientes
