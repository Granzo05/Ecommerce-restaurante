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


    const [paginaActual, setPaginaActual] = useState(0);
    const [productosMostrables, setProductosMostrables] = useState<number>(10);

    // Calcular el índice del primer y último elemento de la página actual
    const indexUltimoProducto = paginaActual * productosMostrables;
    const indexPrimerProducto = indexUltimoProducto + productosMostrables;

    // Obtener los elementos de la página actual
    const empresasFiltradas = empresas.slice(indexUltimoProducto, indexPrimerProducto);

    const paginasTotales = Math.ceil(empresas.length / productosMostrables);

    // Cambiar de página
    const paginate = (paginaActual: number) => setPaginaActual(paginaActual);

    async function checkPrivilegies() {
        if (empleado && empleado.empleadoPrivilegios?.length > 0) {
            try {
                empleado?.empleadoPrivilegios?.forEach(privilegio => {
                    if (privilegio.privilegio.tarea === 'Empresas' && privilegio.permisos.includes('READ')) {
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



    return (
        <div className="opciones-pantallas">
            <h1>- Empresas -</h1>

            {createVisible && (
                <div className="btns-stock">
                    <button className="btn-agregar" onClick={() => handleAgregarEmpresa()}> + Agregar empresa</button>
                </div>
            )}
            <hr />
            <ModalCrud isOpen={showAgregarEmpresaModal} onClose={handleModalClose}>
                <AgregarEmpresa onCloseModal={handleModalClose} />
            </ModalCrud>
            {mostrarEmpresas && (
                <div id="empresas">
                    <select name="cantidadProductos" value={productosMostrables} onChange={(e) => setProductosMostrables(parseInt(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={75}>75</option>
                        <option value={100}>100</option>
                    </select>
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
                            {empresasFiltradas.map(empresa => (
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
