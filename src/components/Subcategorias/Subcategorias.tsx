import { useEffect, useState } from "react";
import ModalCrud from "../ModalCrud";
import '../../styles/stock.css';
import { Subcategoria } from '../../types/Ingredientes/Subcategoria';
import EliminarSubcategoria from "./EliminarSubcategoria";
import ActivarSubcategoria from "./ActivarSubcategoria";
import EditarSubcategoria from "./EditarSubcategoria";
import AgregarSubcategoria from "./AgregarSubcategoria";
import { Categoria } from "../../types/Ingredientes/Categoria";
import React from "react";
import { Empleado } from "../../types/Restaurante/Empleado";
import { DESACTIVAR_PRIVILEGIOS } from "../../utils/global_variables/const";
import { Sucursal } from "../../types/Restaurante/Sucursal";
import { CategoriaService } from "../../services/CategoriaService";

const Subsubcategorias = () => {
    const [subcategorias, setsubcategorias] = useState<Categoria[]>([]);
    const [mostrarsubcategorias, setMostrarsubcategorias] = useState(true);

    const [showAgregarModalCategoria, setShowAgregarModalCategoria] = useState(false);
    const [showEditarCategoriaModal, setShowEditarCategoriaModal] = useState(false);
    const [showEliminarCategoriaModal, setShowEliminarCategoriaModal] = useState(false);
    const [showActivarCategoriaModal, setShowActivarCategoriaModal] = useState(false);

    const [selectedCategoria, setSelectedCategoria] = useState<Subcategoria | null>(null);

    useEffect(() => {
        setDatosFiltrados([]);
        fetchsubcategorias();
    }, []);

    const fetchsubcategorias = async () => {
        setDatosFiltrados([]);
        try {
            const data = await CategoriaService.getCategorias();
            setsubcategorias(data);
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

    const [sucursal] = useState<Sucursal | null>(() => {
        const sucursalString = localStorage.getItem('sucursal');

        return sucursalString ? (JSON.parse(sucursalString) as Sucursal) : null;
    });

    const [createVisible, setCreateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [updateVisible, setUpdateVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [deleteVisible, setDeleteVisible] = useState(DESACTIVAR_PRIVILEGIOS);
    const [activateVisible, setActivateVisible] = useState(DESACTIVAR_PRIVILEGIOS);


    const [paginaActual, setPaginaActual] = useState(1);
    const [cantidadProductosMostrables, setCantidadProductosMostrables] = useState(11);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * cantidadProductosMostrables;
    const indexPrimerProducto = indexUltimoProducto - cantidadProductosMostrables;

    // Obtener los elementos de la página actual
    const [datosFiltrados, setDatosFiltrados] = useState<Categoria[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > subcategorias.length) {
            setPaginasTotales(1);
            setDatosFiltrados(subcategorias);
        } else {
            setPaginasTotales(Math.ceil(subcategorias.length / cantidad));
            setDatosFiltrados(subcategorias.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarCategoria(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = subcategorias.filter(categoria =>
                categoria.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(subcategorias.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(subcategorias.length / cantidadProductosMostrables));
        }
    }

    function filtrarSubcategoria(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = subcategorias.filter(recomendacion =>
                recomendacion.subcategorias.some(sub =>
                    sub.nombre.toLowerCase().includes(filtro.toLowerCase())
                )
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(subcategorias.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(subcategorias.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (subcategorias.length > 0) {
            setDatosFiltrados(subcategorias.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [subcategorias, paginaActual, cantidadProductosMostrables]);

    useEffect(() => {
        if (subcategorias.length > 0) cantidadDatosMostrables(11);
    }, [subcategorias]);

    async function checkPrivilegies() {
        if (empleado && empleado.privilegios?.length > 0) {
            try {
                empleado?.privilegios?.forEach(privilegio => {
                    if (privilegio.nombre === 'Empleados' && privilegio.permisos.includes('READ')) {
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

    const handleAgregarCategoria = () => {
        setShowEditarCategoriaModal(false);
        setShowEliminarCategoriaModal(false);
        setMostrarsubcategorias(false);
        setShowAgregarModalCategoria(true);
    };

    const handleEditarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
        setShowAgregarModalCategoria(false);
        setShowEliminarCategoriaModal(false);
        setMostrarsubcategorias(false);
        setShowEditarCategoriaModal(true);
    };

    const handleEliminarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setMostrarsubcategorias(false);
        setShowActivarCategoriaModal(false);
        setShowEliminarCategoriaModal(true);
    };

    const handleActivarCategoria = (subcategoria: Subcategoria) => {
        setSelectedCategoria(subcategoria);
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setMostrarsubcategorias(false);
        setShowActivarCategoriaModal(true);
        setShowEliminarCategoriaModal(false);
    };

    const handleModalClose = () => {
        setShowAgregarModalCategoria(false);
        setShowEditarCategoriaModal(false);
        setShowActivarCategoriaModal(false);
        setShowEliminarCategoriaModal(false);
        fetchsubcategorias();
        setMostrarsubcategorias(true);
    };

    return (
        <div className="opciones-pantallas">
            <h1>- Subcategorías -</h1>
            {createVisible && (
                <div className="btns-categorias">
                    <button className="btn-agregar" onClick={handleAgregarCategoria}> + Agregar subcategoría</button>
                </div>)}

            <hr />
            <div className="filtros">
                <div className="inputBox-filtrado">
                    <select id="cantidad" name="cantidadProductos" value={cantidadProductosMostrables} onChange={(e) => cantidadDatosMostrables(parseInt(e.target.value))}>
                        <option value={11} disabled >Selecciona una cantidad a mostrar</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <div className="filtros-datos">
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarCategoria(e.target.value)}
                        />
                        <span>Filtrar por categoría</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarSubcategoria(e.target.value)}
                        />
                        <span>Filtrar por subcategoría</span>
                    </div>
                </div>


            </div>
            {mostrarsubcategorias && (
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
                            {datosFiltrados.map(categoria => (
                                <React.Fragment key={categoria.id}>
                                    {categoria.subcategorias.map((subcategoria, index) => (
                                        <tr key={subcategoria.id} className="subcategoria-row">
                                            {index === 0 && (
                                                <td rowSpan={categoria.subcategorias.length} className="categoria-row">
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
                    <div className="pagination">
                        {Array.from({ length: paginasTotales }, (_, index) => (
                            <button key={index + 1} onClick={() => paginate(index + 1)} disabled={paginaActual === index + 1}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
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

export default Subsubcategorias;
