import { useEffect, useState } from 'react';
import ModalCrud from "../ModalCrud";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import AgregarArticuloVenta from './AgregarArticulo';
import EditarArticuloVenta from './EditarArticulo';
import EliminarArticuloVenta from './EliminarArticulo';
import ActivarArticuloVenta from './ActivarArticulo';
import '../../styles/articulosVenta.css'
import { Empleado } from '../../types/Restaurante/Empleado';
import { DESACTIVAR_PRIVILEGIOS } from '../../utils/global_variables/const';
import { Sucursal } from '../../types/Restaurante/Sucursal';

const ArticuloVentas = () => {
    const [articulosVenta, setArticulosVenta] = useState<ArticuloVenta[]>([]);
    const [mostrarArticuloVenta, setMostrarArticuloVenta] = useState(true);

    const [showAgregarArticuloVentaModal, setShowAgregarArticuloVentaModal] = useState(false);
    const [showEditarArticuloVentaModal, setShowEditarArticuloVentaModal] = useState(false);
    const [showEliminarArticuloVentaModal, setShowEliminarArticuloVentaModal] = useState(false);
    const [showActivarArticuloVentaModal, setShowActivarArticuloVentaModal] = useState(false);

    const [selectedArticuloVenta, setSelectedArticuloVenta] = useState<ArticuloVenta | null>(null);

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Empleados' && privilegio.permisos.includes('READ')) {
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
        } else if (sucursal && sucursal.id > 0) {
            setCreateVisible(true);
            setActivateVisible(true);
            setDeleteVisible(true);
            setUpdateVisible(true);
        }
    }

    const fetchArticuloVenta = async () => {
        try {
            ArticuloVentaService.getArticulos()
                .then(data => {
                    console.log(data)
                    setArticulosVenta(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error al obtener empleados:', error);
        }
    };

    const handleAgregarArticuloVenta = () => {
        setShowAgregarArticuloVentaModal(true);
        setShowEditarArticuloVentaModal(false);
        setShowActivarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(false);
        setMostrarArticuloVenta(false);
    };

    const handleEditarArticuloVenta = (articulo: ArticuloVenta) => {
        setSelectedArticuloVenta(articulo);
        setShowAgregarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(true);
        setShowActivarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(false);
        setMostrarArticuloVenta(false);
    };

    const handleEliminarArticuloVenta = (articulo: ArticuloVenta) => {
        setSelectedArticuloVenta(articulo);
        setShowAgregarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(false);
        setShowActivarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(true);
        setMostrarArticuloVenta(false);
    };

    const handleActivarArticuloVenta = (articulo: ArticuloVenta) => {
        setSelectedArticuloVenta(articulo);
        setShowAgregarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(false);
        setShowActivarArticuloVentaModal(true);
        setMostrarArticuloVenta(false);
    };

    const handleModalClose = () => {
        setShowAgregarArticuloVentaModal(false);
        setShowActivarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(false);
        setMostrarArticuloVenta(true);
        fetchArticuloVenta();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Articulos -</h1>
            {createVisible && (
                <div className="btns-arts">
                    <button className='btn-agregar' onClick={() => handleAgregarArticuloVenta()}> + Agregar articulo</button>
                </div>
            )}

            <hr />
            {mostrarArticuloVenta && (
                <div id="menus">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripcion</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articulosVenta.length > 0 && articulosVenta.map(articulo => (
                                <tr key={articulo.id}>
                                    <td>{articulo.nombre}</td>
                                    <td>{articulo.cantidadMedida} {articulo.medida.nombre?.toString().replace(/_/g, ' ')}</td>
                                    <td>${articulo.precioVenta}</td>

                                    {articulo.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-articulos">
                                                {updateVisible && (
                                                    <button className='btn-accion-editar' onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className='btn-accion-eliminar' onClick={() => handleEliminarArticuloVenta(articulo)}>ELIMINAR</button>
                                                )}

                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-articulos">
                                                {activateVisible && (
                                                    <button className='btn-accion-activar' onClick={() => handleActivarArticuloVenta(articulo)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className='btn-accion-editar' onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
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

            <ModalCrud isOpen={showAgregarArticuloVentaModal} onClose={handleModalClose}>
                <AgregarArticuloVenta onCloseModal={handleModalClose} />
            </ModalCrud>
            <ModalCrud isOpen={showEditarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <EditarArticuloVenta articuloOriginal={selectedArticuloVenta} onCloseModal={handleModalClose} />}
            </ModalCrud>
            <ModalCrud isOpen={showEliminarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <EliminarArticuloVenta articuloOriginal={selectedArticuloVenta} onCloseModal={handleModalClose} />}
            </ModalCrud>
            <ModalCrud isOpen={showActivarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <ActivarArticuloVenta articuloOriginal={selectedArticuloVenta} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>

    )
}

export default ArticuloVentas
