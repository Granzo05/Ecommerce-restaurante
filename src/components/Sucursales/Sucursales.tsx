import { useEffect, useState } from "react";
import { SucursalService } from "../../services/SucursalService";
import AgregarSucursal from "./AgregarSucursal";
import ModalCrud from "../ModalCrud";
import EliminarSucursal from "./EliminarSucursal";
import EditarSucursal from "./EditarSucursal";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import ActivarSucursal from "./ActivarSucursal";
import '../../styles/sucursales.css'

const Sucursales = () => {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [selectedSucursal, setSelectedSucursal] = useState<Sucursal>(new Sucursal());
    const [mostrarSucursales, setMostrarSucursales] = useState(true);

    const [showAgregarSucursalModal, setShowAgregarSucursalModal] = useState(false);
    const [showEditarSucursalModal, setShowEditarSucursalModal] = useState(false);
    const [showEliminarSucursalModal, setShowEliminarSucursalModal] = useState(false);
    const [showActivarSucursalModal, setShowActivarSucursalModal] = useState(false);

    useEffect(() => {
        if (sucursales.length === 0) fetchSucursales();
    }, [sucursales]);

    const fetchSucursales = async () => {
        SucursalService.getSucursales()
            .then(data => {
                setSucursales(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const handleAbrirSucursal = (idSucursal: number) => {
        let restaurante = {
            id: idSucursal,
            privilegios: 'admin'
        }

        localStorage.setItem('usuario', JSON.stringify(restaurante));
    };

    const handleAgregarSucursal = () => {
        setShowAgregarSucursalModal(true);
        setMostrarSucursales(false);
    };

    const handleEditarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowEditarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleEliminarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowEliminarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleActivarSucursal = (sucursal: Sucursal) => {
        setSelectedSucursal(sucursal);
        setShowActivarSucursalModal(true);
        setMostrarSucursales(true);
    };

    const handleModalClose = () => {
        setShowAgregarSucursalModal(false);
        setShowEditarSucursalModal(false);
        setShowEliminarSucursalModal(false);
        setShowActivarSucursalModal(false);
        setMostrarSucursales(true);
        fetchSucursales();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Sucursales -</h1>
            <div className="btns-sucursales">

            <button className="btn-agregar" onClick={() => handleAgregarSucursal()}> + Agregar sucursal</button>
            </div>
            <hr />
            <ModalCrud isOpen={showAgregarSucursalModal} onClose={handleModalClose}>
                <AgregarSucursal />
            </ModalCrud>
            {mostrarSucursales && (
                <div id="sucursales">
                    <table>
                        <thead>
                            <tr>
                                <th>Domicilio</th>
                                <th>Telefono</th>
                                <th>Horario apertura</th>
                                <th>Horario cierre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sucursales.map(sucursal => (
                                <tr key={sucursal.id}>
                                    <td>Buen sabor de {sucursal.domicilio?.localidad?.nombre}, {sucursal.domicilio?.localidad?.departamento?.provincia?.nombre}</td>
                                    <td>{sucursal.telefono}</td>
                                    <td>{sucursal.horarioApertura}</td>
                                    <td>{sucursal.horarioCierre}</td>
                                    {sucursal.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                            <button className="btn-accion-abrir" onClick={() => handleAbrirSucursal(sucursal.id)}>ABRIR</button>
                                            <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                            <button className="btn-accion-eliminar" onClick={() => handleEliminarSucursal(sucursal)}>ELIMINAR</button>
                                            </div>
                                            
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                            <button className="btn-accion-abrir" onClick={() => handleAbrirSucursal(sucursal.id)}>ABRIR</button>
                                            <button className="btn-accion-activar" onClick={() => handleActivarSucursal(sucursal)}>ACTIVAR</button>
                                            <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                            
                                            </div>
                                            
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ModalCrud isOpen={showEditarSucursalModal} onClose={handleModalClose}>
                        <EditarSucursal sucursalOriginal={selectedSucursal} />
                    </ModalCrud>
                    <ModalCrud isOpen={showEliminarSucursalModal} onClose={handleModalClose}>
                        {selectedSucursal && <EliminarSucursal sucursal={selectedSucursal} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                    <ModalCrud isOpen={showActivarSucursalModal} onClose={handleModalClose}>
                        {selectedSucursal && <ActivarSucursal sucursal={selectedSucursal} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                </div>
            )}

        </div>
    )
}

export default Sucursales
