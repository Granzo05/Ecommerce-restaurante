import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from '../../types/Ingredientes/Categoria';
import EliminarCategoria from "./EliminarCategoria";
import EditarCategoria from "./EditarCategoria";
import AgregarCategoria from "./AgregarCategoria";
import ActivarCategoria from "./ActivarCategoria";
import '../../styles/categorias.css'
import { Empleado } from "../../types/Restaurante/Empleado";

const Categorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [mostrarCategorias, setMostrarCategorias] = useState(true);

    const [showAgregarModalCategoria, setShowAgregarModalCategoria] = useState(false);
    const [showEditarCategoriaModal, setShowEditarCategoriaModal] = useState(false);
    const [showEliminarCategoriaModal, setShowEliminarCategoriaModal] = useState(false);
    const [showActivarCategoriaModal, setShowActivarCategoriaModal] = useState(false);

    const [selectedCategoria, setSelectedCategoria] = useState<Categoria>();

    useEffect(() => {
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

    useEffect(() => {
        checkPrivilegies();
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
    });

    const [createVisible, setCreateVisible] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    const [activateVisible, setActivateVisible] = useState(false);

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

            {createVisible && (
                <div className="btns-categorias">
                    <button className="btn-agregar" onClick={() => handleAgregarCategoria()}> + Agregar categoria</button>
                </div>
            )}
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
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarCategoria(categoria)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarCategoria(categoria)}>ELIMINAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarCategoria(categoria)}>EDITAR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarCategoria(categoria)}>ACTIVAR</button>
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
            <ModalCrud isOpen={showAgregarModalCategoria} onClose={handleModalClose}>
                <AgregarCategoria onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EliminarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <ActivarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EditarCategoria categoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    )
}

export default Categorias
