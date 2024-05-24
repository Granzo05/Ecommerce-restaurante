import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import { EmpleadoService } from "../../services/EmpleadoService";
import '../../styles/stock.css';
import EliminarMedida from "./EliminarMedida";
import EditarMedida from "./EditarMedida";
import AgregarMedida from "./AgregarMedida";
import ActivarMedida from "./ActivarMedida";
import { Medida } from "../../types/Ingredientes/Medida";
import { MedidaService } from "../../services/MedidaService";

const Medidas = () => {
    const [medidas, setMedidas] = useState<Medida[]>([]);
    const [mostrarMedidas, setMostrarMedidas] = useState(true);

    const [showAgregarModalMedida, setShowAgregarModalMedida] = useState(false);
    const [showEditarMedidaModal, setShowEditarMedidaModal] = useState(false);
    const [showEliminarMedidaModal, setShowEliminarMedidaModal] = useState(false);
    const [showActivarMedidaModal, setShowActivarMedidaModal] = useState(false);

    const [selectedMedida, setSelectedMedida] = useState<Medida>();

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
        fetchMedidas();
    }, []);

    const fetchMedidas = async () => {
        try {
            MedidaService.getMedidas()
                .then(data => {
                    setMedidas(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAgregarMedida = () => {
        setShowEditarMedidaModal(false);
        setShowEliminarMedidaModal(false);
        setMostrarMedidas(false);
        setShowAgregarModalMedida(true);
    };

    const handleEditarMedida = (medida: Medida) => {
        console.log(medida)
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEliminarMedidaModal(false);
        setMostrarMedidas(false);
        setShowEditarMedidaModal(true);
    };

    const handleEliminarMedida = (medida: Medida) => {
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setMostrarMedidas(false);
        setShowActivarMedidaModal(false);
        setShowEliminarMedidaModal(true);
    };

    const handleActivarMedida = (medida: Medida) => {
        setSelectedMedida(medida);
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setMostrarMedidas(false);
        setShowActivarMedidaModal(true);
        setShowEliminarMedidaModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalMedida(false);
        setShowEditarMedidaModal(false);
        setShowEliminarMedidaModal(false);
        fetchMedidas();
        setMostrarMedidas(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Medidas -</h1>
            <div className="btns-categorias">
                <button className="btn-agregar" onClick={() => handleAgregarMedida()}> + Agregar medida</button>
            </div>
            <hr />
            {mostrarMedidas && (
                <div id="stocks">


                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medidas.map(medida => (
                                <tr key={medida.id}>
                                    <td>{medida.denominacion}</td>

                                    {medida.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">

                                                <button className="btn-accion-editar" onClick={() => handleEditarMedida(medida)}>EDITAR</button>
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarMedida(medida)}>ELIMINAR</button>
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">

                                                <button className="btn-accion-editar" onClick={() => handleEditarMedida(medida)}>EDITAR</button>
                                                <button className="btn-accion-activar" onClick={() => handleActivarMedida(medida)}>ACTIVAR</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ModalCrud isOpen={showAgregarModalMedida} onClose={handleModalClose}>
                <AgregarMedida />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <EliminarMedida medidaOriginal={selectedMedida} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <ActivarMedida medidaOriginal={selectedMedida} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarMedidaModal} onClose={handleModalClose}>
                {selectedMedida && <EditarMedida medidaOriginal={selectedMedida} />}
            </ModalCrud>
        </div>
    )
}

export default Medidas
