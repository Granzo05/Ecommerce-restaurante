import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import EliminarSubcategoria from "./EliminarSubcategoria";
import ActivarSubcategoria from "./ActivarSubcategoria";
import EditarSubcategoria from "./EditarSubcategoria";
import AgregarSubcategoria from "./AgregarSubcategoria";
import { CategoriaService } from "../../services/CategoriaService";
import { Categoria } from "../../types/Ingredientes/Categoria";
import React from "react";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";

const Subcategorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [mostrarCategorias, setMostrarCategorias] = useState(true);

    const [showAgregarModalCategoria, setShowAgregarModalCategoria] = useState(false);
    const [showEditarCategoriaModal, setShowEditarCategoriaModal] = useState(false);
    const [showEliminarCategoriaModal, setShowEliminarCategoriaModal] = useState(false);
    const [showActivarCategoriaModal, setShowActivarCategoriaModal] = useState(false);

    const [selectedCategoria, setSelectedCategoria] = useState<Subcategoria | null>(null);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = async () => {
        try {
            const data = await CategoriaService.getCategorias();
            setCategorias(data);
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

    const handleAgregarCategoria = () => {
        setShowEditarCategoriaModal(false);
        setShowEliminarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowAgregarModalCategoria(true);
    };

    const handleEditarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
        setShowAgregarModalCategoria(false);
        setShowEliminarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowEditarCategoriaModal(true);
    };

    const handleEliminarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setMostrarCategorias(false);
        setShowActivarCategoriaModal(false);
        setShowEliminarCategoriaModal(true);
    };

    const handleActivarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
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
            <h1>- Subcategorías -</h1>
            {createVisible && (
                <div className="btns-categorias">
                    <button className="btn-agregar" onClick={handleAgregarCategoria}> + Agregar subcategoría</button>
                </div>)}

            <hr />
            {mostrarCategorias && (
                <div id="stocks">
                    <table>
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th>Subcategoría</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map(categoria => (
                                <React.Fragment key={categoria.id}>
                                    {categoria.subcategorias.map((subcategoria, index) => (
                                        <tr key={subcategoria.id}>
                                            {index === 0 && (
                                                <td rowSpan={categoria.subcategorias.length}>
                                                    {categoria.nombre.toString().replace(/_/g, ' ')}
                                                </td>
                                            )}
                                            <td>{subcategoria.nombre.toString().replace(/_/g, ' ')}</td>
                                            <td>
                                                <div className="btns-acciones">
                                                    {updateVisible && (
                                                        <button className="btn-accion-editar" onClick={() => handleEditarCategoria(subcategoria)}>EDITAR</button>
                                                    )}
                                                    {subcategoria.borrado === 'NO' && deleteVisible ? (
                                                        <button className="btn-accion-eliminar" onClick={() => handleEliminarCategoria(subcategoria)}>ELIMINAR</button>
                                                    ) : activateVisible ? (
                                                        <button className="btn-accion-activar" onClick={() => handleActivarCategoria(subcategoria)}>ACTIVAR</button>
                                                    ) : <></>}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <ModalCrud isOpen={showAgregarModalCategoria} onClose={handleModalClose}>
                <AgregarSubcategoria onCloseModal={handleModalClose} />
            </ModalCrud>

            <ModalCrud isOpen={showEliminarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EliminarSubcategoria subcategoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showActivarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <ActivarSubcategoria subcategoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>

            <ModalCrud isOpen={showEditarCategoriaModal} onClose={handleModalClose}>
                {selectedCategoria && <EditarSubcategoria subcategoriaOriginal={selectedCategoria} onCloseModal={handleModalClose} />}
            </ModalCrud>
        </div>
    );
};

export default Subcategorias;
