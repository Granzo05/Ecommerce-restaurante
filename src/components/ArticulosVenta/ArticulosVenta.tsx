import { useEffect, useState } from 'react';
import ModalCrud from "../ModalCrud";
import '../../styles/menuPorTipo.css';
import '../../styles/modalCrud.css';
import '../../styles/modalFlotante.css';
import { EmpleadoService } from "../../services/EmpleadoService";
import ModalFlotante from "../ModalFlotante";
import { ArticuloVenta } from '../../types/Productos/ArticuloVenta';
import { ArticuloVentaService } from '../../services/ArticuloVentaService';
import AgregarArticuloVenta from './AgregarArticulo';
import EditarArticuloVenta from './EditarArticulo';
import EliminarArticuloVenta from './EliminarArticulo';
import ActivarArticuloVenta from './ActivarArticulo';
import '../../styles/articulosVenta.css'

const ArticuloVentas = () => {
    const [articulosVenta, setArticulosVenta] = useState<ArticuloVenta[]>([]);
    const [mostrarArticuloVenta, setMostrarArticuloVenta] = useState(true);

    const [showAgregarArticuloVentaModal, setShowAgregarArticuloVentaModal] = useState(false);
    const [showEditarArticuloVentaModal, setShowEditarArticuloVentaModal] = useState(false);
    const [showEliminarArticuloVentaModal, setShowEliminarArticuloVentaModal] = useState(false);
    const [showActivarArticuloVentaModal, setShowActivarArticuloVentaModal] = useState(false);

    const [selectedArticuloVenta, setSelectedArticuloVenta] = useState<ArticuloVenta | null>(null);

    useEffect(() => {
        fetchData();

        fetchArticuloVenta();
    }, []);

    const fetchData = async () => {
        try {
            await EmpleadoService.checkUser();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchArticuloVenta = async () => {
        try {
            ArticuloVentaService.getArticulos()
                .then(data => {
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
        articulo.borrado = 'SI';
        setSelectedArticuloVenta(articulo);
        setShowAgregarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(false);
        setShowActivarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(true);
        setMostrarArticuloVenta(false);
    };

    const handleActivarArticuloVenta = (articulo: ArticuloVenta) => {
        articulo.borrado = 'NO';
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
            <div className="btns-arts">
            <button className='btn-agregar' onClick={() => handleAgregarArticuloVenta()}> + Agregar articulo</button>
            
            </div>
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
                                    <td>{articulo.cantidadMedida} {articulo.medida?.toString().toLowerCase()}</td>
                                    <td>${articulo.precioVenta}</td>

                                    {articulo.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-articulos">
                                            <button className='btn-accion-editar' onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
                                            <button className='btn-accion-eliminar' onClick={() => handleEliminarArticuloVenta(articulo)}>ELIMINAR</button>
                                            
                                        
                                            </div>
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-articulos">
                                            <button className='btn-accion-activar' onClick={() => handleActivarArticuloVenta(articulo)}>ACTIVAR</button>
                                            <button className='btn-accion-editar' onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
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
                <AgregarArticuloVenta />
            </ModalCrud>
            <ModalCrud isOpen={showEditarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <EditarArticuloVenta articuloOriginal={selectedArticuloVenta} />}
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
