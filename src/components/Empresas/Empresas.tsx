import { useEffect, useState } from "react";
import AgregarEmpresa from "./AgregarEmpresa";
import ModalCrud from "../ModalCrud";
import EliminarEmpresa from "./EliminarEmpresa";
import EditarEmpresa from "./EditarEmpresa";
import { Empresa } from "../../types/Restaurante/Empresa";
import ActivarEmpresa from "./ActivarEmpresa";
import { EmpresaService } from "../../services/EmpresaService";
import { Empleado } from "../../types/Restaurante/Empleado";
import { PrivilegiosService } from "../../services/PrivilegiosService";
import { Privilegios } from "../../types/Restaurante/Privilegios";
import { DESACTIVAR_PRIVILEGIOS, getBaseUrl } from "../../utils/global_variables/const";

const Empresas = () => {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa>(new Empresa());
    const [mostrarEmpresas, setMostrarEmpresas] = useState(true);

    const [showAgregarEmpresaModal, setShowAgregarEmpresaModal] = useState(false);
    const [showEditarEmpresaModal, setShowEditarEmpresaModal] = useState(false);
    const [showEliminarEmpresaModal, setShowEliminarEmpresaModal] = useState(false);
    const [showActivarEmpresaModal, setShowActivarEmpresaModal] = useState(false);

    useEffect(() => {
        if (empresas.length === 0) fetchEmpresas();
    }, [empresas]);

    const fetchEmpresas = async () => {
        EmpresaService.getEmpresas()
            .then(data => {
                setEmpresas(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        checkPrivilegies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [empleado] = useState<Empleado | null>(() => {
        const empleadoString = localStorage.getItem('empleado');

        return empleadoString ? (JSON.parse(empleadoString) as Empleado) : null;
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
    const [datosFiltrados, setDatosFiltrados] = useState<Empresa[]>([]);

    const [paginasTotales, setPaginasTotales] = useState<number>(1);

    // Cambiar de página
    const paginate = (numeroPagina: number) => setPaginaActual(numeroPagina);

    function cantidadDatosMostrables(cantidad: number) {
        setCantidadProductosMostrables(cantidad);

        if (cantidad > empresas.length) {
            setPaginasTotales(1);
            setDatosFiltrados(empresas);
        } else {
            setPaginasTotales(Math.ceil(empresas.length / cantidad));
            setDatosFiltrados(empresas.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }

    function filtrarNombre(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = empresas.filter(recomendacion =>
                recomendacion.nombre.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(empresas.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(empresas.length / cantidadProductosMostrables));
        }
    }

    function filtrarRazonSocial(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = empresas.filter(recomendacion =>
                recomendacion.razonSocial.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(empresas.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(empresas.length / cantidadProductosMostrables));
        }
    }

    function filtrarCuit(filtro: string) {
        if (filtro.length > 0) {
            const filtradas = empresas.filter(recomendacion =>
                recomendacion.cuit.toLowerCase().includes(filtro.toLowerCase())
            );
            setDatosFiltrados(filtradas.length > 0 ? filtradas : []);
            setPaginasTotales(Math.ceil(filtradas.length / cantidadProductosMostrables));
        } else {
            setDatosFiltrados(empresas.slice(indexPrimerProducto, indexUltimoProducto));
            setPaginasTotales(Math.ceil(empresas.length / cantidadProductosMostrables));
        }
    }

    useEffect(() => {
        if (empresas.length > 0) {
            setDatosFiltrados(empresas.slice(indexPrimerProducto, indexUltimoProducto));
        }
    }, [empresas, paginaActual, cantidadProductosMostrables]);


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
        }
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


    const handleAbrirEmpresa = (idEmpresa: number) => {
        let restaurante = {
            id: idEmpresa,
            nombre: 'admin',
            empleadoPrivilegios: privilegios
        }

        localStorage.setItem('empresa', JSON.stringify(restaurante));

        window.location.href = getBaseUrl() + '/admin'
    };

    const handleAgregarEmpresa = () => {
        setShowAgregarEmpresaModal(true);
        setMostrarEmpresas(false);
    };

    const handleEditarEmpresa = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setShowEditarEmpresaModal(true);
        setMostrarEmpresas(true);
    };

    const handleEliminarEmpresa = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setShowEliminarEmpresaModal(true);
        setMostrarEmpresas(true);
    };

    const handleActivarEmpresa = (empresa: Empresa) => {
        setSelectedEmpresa(empresa);
        setShowActivarEmpresaModal(true);
        setMostrarEmpresas(true);
    };

    const handleModalClose = () => {
        setShowAgregarEmpresaModal(false);
        setShowEditarEmpresaModal(false);
        setShowEliminarEmpresaModal(false);
        setShowActivarEmpresaModal(false);
        setMostrarEmpresas(true);
        fetchEmpresas();
    };

    const formatearCuil = (value: string) => {
        // Eliminar todos los caracteres no numéricos
        const soloNumeros = value.replace(/\D/g, "");

        // Insertar los guiones en las posiciones correctas
        let cuilFormateado = "";
        if (soloNumeros.length > 2) {
            cuilFormateado += soloNumeros.slice(0, 2) + "-";
            if (soloNumeros.length > 10) {
                cuilFormateado += soloNumeros.slice(2, 10) + "-";
                cuilFormateado += soloNumeros.slice(10, 11);
            } else {
                cuilFormateado += soloNumeros.slice(2);
            }
        } else {
            cuilFormateado = soloNumeros;
        }

        return cuilFormateado;
    };

    





    return (
        <div className="opciones-pantallas">
            <h1>- Empresas -</h1>
            {createVisible && (
                <div className="btns-empleados">
                    <button className="btn-agregar" onClick={() => handleAgregarEmpresa()}> + Agregar empresa</button>
                </div>
            )}
            <hr />
            <ModalCrud isOpen={showAgregarEmpresaModal} onClose={handleModalClose}>
                <AgregarEmpresa onCloseModal={handleModalClose} />
            </ModalCrud>

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
                            onChange={(e) => filtrarNombre(e.target.value)}
                        />
                        <span>Filtrar por nombre</span>
                    </div>
                    <div className="inputBox-filtrado" style={{ marginRight: '10px' }}>
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarRazonSocial(e.target.value)}
                        />
                        <span>Filtrar por razón social</span>
                    </div>
                    <div className="inputBox-filtrado">
                        <input
                            type="text"
                            required
                            onChange={(e) => filtrarCuit(e.target.value)}
                        />
                        <span>Filtrar por CUIT</span>
                    </div>
                </div>


            </div>
            {mostrarEmpresas && (
                <div id="empresas">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Razón Social</th>
                                <th>CUIT</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosFiltrados.map(empresa => (
                                <tr key={empresa.id}>
                                    <td>{empresa.nombre}</td>
                                    <td>{empresa.razonSocial}</td>
                                    <td>{empresa.cuit}</td>
                                    {empresa.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                {createVisible && activateVisible && updateVisible && deleteVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => handleAbrirEmpresa(empresa.id)}>ABRIR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarEmpresa(empresa)}>EDITAR</button>
                                                )}
                                                {deleteVisible && (
                                                    <button className="btn-accion-eliminar" onClick={() => handleEliminarEmpresa(empresa)}>ELIMINAR</button>
                                                )}
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                {createVisible && activateVisible && updateVisible && deleteVisible && (
                                                    <button className="btn-accion-abrir" onClick={() => handleAbrirEmpresa(empresa.id)}>ABRIR</button>
                                                )}
                                                {activateVisible && (
                                                    <button className="btn-accion-activar" onClick={() => handleActivarEmpresa(empresa)}>ACTIVAR</button>
                                                )}
                                                {updateVisible && (
                                                    <button className="btn-accion-editar" onClick={() => handleEditarEmpresa(empresa)}>EDITAR</button>
                                                )}
                                            </div>

                                        </td>
                                    )}
                                </tr>
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
                    <ModalCrud isOpen={showEditarEmpresaModal} onClose={handleModalClose}>
                        <EditarEmpresa empresaOriginal={selectedEmpresa} onCloseModal={handleModalClose} />
                    </ModalCrud>
                    <ModalCrud isOpen={showEliminarEmpresaModal} onClose={handleModalClose}>
                        {selectedEmpresa && <EliminarEmpresa empresa={selectedEmpresa} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                    <ModalCrud isOpen={showActivarEmpresaModal} onClose={handleModalClose}>
                        {selectedEmpresa && <ActivarEmpresa empresa={selectedEmpresa} onCloseModal={handleModalClose} />}
                    </ModalCrud>
                </div>
            )}

        </div>
    )
}

export default Empresas
