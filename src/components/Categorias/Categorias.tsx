import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import { EmpleadoService } from "../../services/EmpleadoService";
import '../../styles/stock.css';
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from '../../types/Ingredientes/Categoria';
import EliminarCategoria from "./EliminarCategoria";
import EditarCategoria from "./EditarCategoria";
import AgregarCategoria from "./AgregarCategoria";
import ActivarCategoria from "./ActivarCategoria";
import '../../styles/categorias.css'

const Categorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [mostrarCategorias, setMostrarCategorias] = useState(true);

    const [showAgregarModalCategoria, setShowAgregarModalCategoria] = useState(false);
    const [showEditarCategoriaModal, setShowEditarCategoriaModal] = useState(false);
    const [showEliminarCategoriaModal, setShowEliminarCategoriaModal] = useState(false);
    const [showActivarCategoriaModal, setShowActivarCategoriaModal] = useState(false);

    const [selectedCategoria, setSelectedCategoria] = useState<Categoria>();

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
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            CategoriaService.getCategorias()
                .then(data => {
                    setCategorias(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAgregarCategoria = () => {
        setShowEditarCategoriaModal(false);
        setShowEliminarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowAgregarModalCategoria(true);
    };

    const handleEditarCategoria = (categoria: Categoria) => {
        console.log(categoria)
        setSelectedCategoria(categoria);
        setShowAgregarModalCategoria(false);
        setShowEliminarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowEditarCategoriaModal(true);
    };

    const handleEliminarCategoria = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowActivarCategoriaModal(false);
        setShowEliminarCategoriaModal(true);
    };

    const handleActivarCategoria = (categoria: Categoria) => {
        setSelectedCategoria(categoria);
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowActivarCategoriaModal(true);
        setShowEliminarCategoriaModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setShowActivarCategoriaModal(false);
        setShowEliminarCategoriaModal(false);
        fetchCategorias();
        setMostrarCategorias(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Categorias -</h1>
            <div className="btns-categorias">
                <button className="btn-agregar" onClick={() => handleAgregarCategoria()}> + Agregar categoria</button>
            </div>
            <hr />
            {mostrarCategorias && (
                <div id="stocks">


                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(categoria => (
                                <tr key={categoria.id}>
                                    <td>{categoria.nombre.toString().replace(/_/g, ' ')}</td>

                                    {categoria.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                
                                            <button className="btn-accion-editar" onClick={() => handleEditarCategoria(categoria)}>EDITAR</button>
                                            <button className="btn-accion-eliminar" onClick={() => handleEliminarCategoria(categoria)}>ELIMINAR</button>
                                            </div>
                                            
                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                            <button className="btn-accion-editar" onClick={() => handleEditarCategoria(categoria)}>EDITAR</button>
                                            <button className="btn-accion-activar" onClick={() => handleActivarCategoria(categoria)}>ACTIVAR</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ModalCrud isOpen={showAgregarModalCategoria} onClose={handleModalClose}>
                <AgregarCategoria />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EliminarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <ActivarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EditarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose}/>}
            </ModalCrud>
        </div>
    )
}

export default Categorias
