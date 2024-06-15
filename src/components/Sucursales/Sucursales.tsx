import { useEffect, useState } from "react";
import { SucursalService } from "../../services/SucursalService";
import AgregarSucursal from "./AgregarSucursal";
import ModalCrud from "../ModalCrud";
import EliminarSucursal from "./EliminarSucursal";
import EditarSucursal from "./EditarSucursal";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import ActivarSucursal from "./ActivarSucursal";
import '../../styles/sucursales.css'
import { Empleado } from "../../types/Restaurante/Empleado";
import { PrivilegiosService } from "../../services/PrivilegiosService";
import { Privilegios } from "../../types/Restaurante/Privilegios";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";

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


    const [privilegios, setPrivilegios] = useState<Privilegios[]>([]);

    useEffect(() => {
        PrivilegiosService.getPrivilegios()
            .then(data => {
                setPrivilegios(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);


    const handleAbrirSucursal = (idSucursal: number) => {
        let restaurante = {
            id: idSucursal,
            nombre: 'admin',
            empleadoPrivilegios: privilegios
        }

        localStorage.setItem('sucursal', JSON.stringify(restaurante));
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
                    if (privilegio.privilegio.tarea === 'Sucursales' && privilegio.permisos.includes('READ')) {
                        if (privilegio.permisos.includes('CREATE')) {
                            setCreateVisible(true);
                        }
                        if (privilegio.permisos.includes('UPDATE')) {
                            setUpdateVisible(true);
                        }
                        if (privilegio.permisos.includes('DELETE')) {
                            setDeleteVisible(true);
                        }
                        if (privilegio.permisos.includes('ACTIVATE')) {
                            setActivateVisible(true);
                        }
                    }
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }


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

            {createVisible && (
                <div className="btns-sucursales">
                    <button className="btn-agregar" onClick={() => handleAgregarSucursal()}> + Agregar sucursal</button>
                </div>)}
            <hr />
            <ModalCrud isOpen={showAgregarSucursalModal} onClose={handleModalClose}>
                <AgregarSucursal onCloseModal={handleModalClose} />
            </ModalCrud>
            {mostrarSucursales && (
                <div id="sucursales">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Telefono</th>
                                <th>Horario apertura</th>
                                <th>Horario cierre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sucursales.map(sucursal => (
                                <tr key={sucursal.id}>
                                    <td>{sucursal.nombre}</td>
                                    <td>{sucursal.telefono}</td>
                                    <td>{sucursal.horarioApertura}</td>
                                    <td>{sucursal.horarioCierre}</td>
                                    {sucursal.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {createVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => handleAbrirSucursal(sucursal.id)}>ABRIR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarSucursal(sucursal)}>ELIMINAR</button>
                                                )}
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => handleAbrirSucursal(sucursal.id)}>ABRIR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarSucursal(sucursal)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarSucursal(sucursal)}>EDITAR</button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ModalCrud isOpen={showEditarSucursalModal} onClose={handleModalClose}>
                        <EditarSucursal sucursalOriginal={selectedSucursal} onCloseModal={handleModalClose} />
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
