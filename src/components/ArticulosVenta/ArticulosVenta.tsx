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
        setShowEliminarArticuloVentaModal(false);
        setMostrarArticuloVenta(false);
    };

    const handleEditarArticuloVenta = (articulo: ArticuloVenta) => {
        setSelectedArticuloVenta(articulo);
        setShowAgregarArticuloVentaModal(false);
        setShowEditarArticuloVentaModal(true);
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
        setShowEditarArticuloVentaModal(false);
        setShowEliminarArticuloVentaModal(false);
        setMostrarArticuloVenta(true);
        fetchArticuloVenta();
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Articulos para venta -</h1>
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
                                    <td>{articulo.cantidadMedida} {articulo.medida?.toString()}</td>
                                    <td>{articulo.precioVenta}</td>

                                    {articulo.borrado === 'NO' ? (
                                        <td>
                                            <button onClick={() => handleEliminarArticuloVenta(articulo)}>ELIMINAR</button>
                                            <button onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
                                        </td>
                                    ) : (
                                        <td>
                                            <button onClick={() => handleActivarArticuloVenta(articulo)}>ACTIVAR</button>
                                            <button onClick={() => handleEditarArticuloVenta(articulo)}>EDITAR</button>
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
            <ModalFlotante isOpen={showEditarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <EditarArticuloVenta articuloOriginal={selectedArticuloVenta} />}
            </ModalFlotante>
            <ModalFlotante isOpen={showEliminarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <EliminarArticuloVenta articuloOriginal={selectedArticuloVenta} />}
            </ModalFlotante>
            <ModalFlotante isOpen={showActivarArticuloVentaModal} onClose={handleModalClose}>
                {selectedArticuloVenta && <ActivarArticuloVenta articuloOriginal={selectedArticuloVenta} />}
            </ModalFlotante>
        </div>

    )
}

export default ArticuloVentas
