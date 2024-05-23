import { useEffect, useState } from "react";
import AgregarEmpresa from "./AgregarEmpresa";
import ModalCrud from "../ModalCrud";
import EliminarEmpresa from "./EliminarEmpresa";
import EditarEmpresa from "./EditarEmpresa";
import { Empresa } from "../../types/Restaurante/Empresa";
import ActivarEmpresa from "./ActivarEmpresa";
import { EmpresaService } from "../../services/EmpresaService";

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

    const handleAbrirEmpresa = (idEmpresa: number) => {
        let restaurante = {
            id: idEmpresa,
            privilegios: 'admin'
        }

        localStorage.setItem('usuario', JSON.stringify(restaurante));
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
        empresa.borrado = 'SI';
        setSelectedEmpresa(empresa);
        setShowEliminarEmpresaModal(true);
        setMostrarEmpresas(true);
    };

    const handleActivarEmpresa = (empresa: Empresa) => {
        empresa.borrado = 'NO';
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
            <div className="btns-empresas">

                <button className="btn-agregar" onClick={() => handleAgregarEmpresa()}> + Agregar empresa</button>
            </div>
            <hr />
            <ModalCrud isOpen={showAgregarEmpresaModal} onClose={handleModalClose}>
                <AgregarEmpresa />
            </ModalCrud>
            {mostrarEmpresas && (
                <div id="empresas">
                    <table>
                        <thead>
                            <tr>
                                <th>Domicilio</th>
                                <th>Telefono</th>
                                <th>Horario apertura</th>
                                <th>Horario cierre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empresas.map(empresa => (
                                <tr key={empresa.id}>
                                    <td>{empresa.nombre}</td>
                                    <td>{empresa.razonSocial}</td>
                                    <td>{empresa.cuit}</td>
                                    {empresa.borrado === 'NO' ? (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-abrir" onClick={() => handleAbrirEmpresa(empresa.id)}>ABRIR</button>
                                                <button className="btn-accion-editar" onClick={() => handleEditarEmpresa(empresa)}>EDITAR</button>
                                                <button className="btn-accion-eliminar" onClick={() => handleEliminarEmpresa(empresa)}>ELIMINAR</button>
                                            </div>

                                        </td>
                                    ) : (
                                        <td>
                                            <div className="btns-acciones">
                                                <button className="btn-accion-abrir" onClick={() => handleAbrirEmpresa(empresa.id)}>ABRIR</button>
                                                <button className="btn-accion-activar" onClick={() => handleActivarEmpresa(empresa)}>ACTIVAR</button>
                                                <button className="btn-accion-editar" onClick={() => handleEditarEmpresa(empresa)}>EDITAR</button>

                                            </div>

                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ModalCrud isOpen={showEditarEmpresaModal} onClose={handleModalClose}>
                        <EditarEmpresa empresaOriginal={selectedEmpresa} />
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
