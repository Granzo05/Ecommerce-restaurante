import React, { useEffect, useState } from 'react';
import '../../styles/perfil.css'
import { Cliente } from '../../types/Cliente/Cliente';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { ClienteService } from '../../services/ClienteService';
import { toast } from 'sonner';
import ModalFlotanteRecomendacionesPais from '../../hooks/ModalFlotanteFiltroPais';
import ModalFlotanteRecomendacionesProvincias from '../../hooks/ModalFlotanteFiltroProvincia';
import ModalFlotanteRecomendacionesDepartamentos from '../../hooks/ModalFlotanteFiltroDepartamentos';
import ModalFlotanteRecomendacionesLocalidades from '../../hooks/ModalFlotanteFiltroLocalidades';
import InputComponent from '../InputFiltroComponent';
import { Localidad } from '../../types/Domicilio/Localidad';
import { Provincia } from '../../types/Domicilio/Provincia';
import { Departamento } from '../../types/Domicilio/Departamento';
import { Pais } from '../../types/Domicilio/Pais';

const Domicilios = () => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
    const [newDomicilios, setNewDomicilios] = useState<Domicilio[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (cliente && cliente?.domicilios.length > 0) setNewDomicilios(cliente.domicilios);
    }, [cliente]);

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        if (clienteString) {
            let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();
            const cliente = await ClienteService.getUserById(clienteMem?.id);
            setCliente(cliente);
        }
    }

    async function actualizarDomicilios() {
        if (cliente) {
            newDomicilios.forEach(domicilio => {
                if (!domicilio.calle || !domicilio.calle.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-\-0-9]+$/)) {
                    toast.error("Por favor, es necesario la calle para el domicilio");
                    setIsLoading(false);
                    return;
                } else if (!domicilio.numero || (domicilio.numero > 99999 || domicilio.numero < 1)) {
                    toast.error("Por favor, es necesario el número del domicilio");
                    setIsLoading(false);
                    return;
                } else if (!domicilio.codigoPostal || (domicilio.codigoPostal > 9431 || domicilio.codigoPostal < 1001)) {
                    toast.error("Por favor, es necesario el código postal del domicilio");
                    setIsLoading(false);
                    return;
                } else if (domicilio.localidad.departamento.provincia.pais.nombre == '') {
                    toast.info(`Por favor, el domicilio debe contener un país`);
                    setIsLoading(false);
                    return;
                } else if (domicilio.localidad.departamento.provincia.nombre == '') {
                    toast.info(`Por favor, el domicilio debe contener una provincia`);
                    setIsLoading(false);
                    return;
                } else if (domicilio.localidad.departamento.nombre == '') {
                    toast.info(`Por favor, el domicilio debe contener un departamento`);
                    setIsLoading(false);
                    return;
                } else if (domicilio.localidad.nombre == '') {
                    toast.info(`Por favor, el domicilio debe contener una localidad`);
                    setIsLoading(false);
                    return;
                }
            });

            setIsLoading(true);

            cliente.domicilios = domicilios;

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando el correo...',
                success: () => {
                    return `Correo actualizado con éxito...`;
                },
                error: (err) => {
                    setIsLoading(false);
                    return err.message;
                },
                finally: () => {
                    setIsLoading(false);
                }
            });
        }
    }

    const handleChangeCalle = (index: number, calle: string) => {
        const nuevosDomicilios = [...domicilios];
        nuevosDomicilios[index].calle = calle;
        setDomicilios(nuevosDomicilios);
    };

    const handleChangeNumeroCasa = (index: number, numero: number) => {
        const nuevosDomicilios = [...domicilios];
        nuevosDomicilios[index].numero = numero;
        setDomicilios(nuevosDomicilios);
    };

    const handleChangeCodigoPostal = (index: number, codigoPostal: number) => {
        const nuevosDomicilios = [...domicilios];
        nuevosDomicilios[index].codigoPostal = codigoPostal;
        setDomicilios(nuevosDomicilios);
    };

    const handleChangePais = (index: number, pais: Pais) => {
        const nuevosDomicilios = [...domicilios];
        if (pais) {
            nuevosDomicilios[index].localidad.departamento.provincia.pais = pais;
            setDomicilios(nuevosDomicilios);
        }
    };

    const handleChangeProvincia = (index: number, provincia: Provincia) => {
        const nuevosDomicilios = [...domicilios];
        if (provincia) {
            nuevosDomicilios[index].localidad.departamento.provincia = provincia;
            setDomicilios(nuevosDomicilios);
        }
    };

    const handleChangeDepartamento = (index: number, departamento: Departamento) => {
        const nuevosDomicilios = [...domicilios];
        if (departamento) {
            nuevosDomicilios[index].localidad.departamento = departamento;
            setDomicilios(nuevosDomicilios);
        }
    };


    const handleChangeLocalidad = (index: number, localidad: Localidad) => {
        const nuevosDomicilios = [...domicilios];
        if (localidad) {
            nuevosDomicilios[index].localidad = localidad;
            setDomicilios(nuevosDomicilios);
        }
    };

    const añadirCampoDomicilio = () => {
        setDomicilios([...domicilios, { id: 0, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
    };

    const quitarCampoDomicilio = (index: number) => {
        if (domicilios.length > 0) {
            const nuevosDomicilios = [...domicilios];
            nuevosDomicilios.splice(index, 1);
            setDomicilios(nuevosDomicilios);
        } else {
            setDomicilios([])
        }
    };

    const [modalBusquedaLocalidad, setModalBusquedaLocalidad] = useState<boolean>(false);
    const [modalBusquedaDepartamento, setModalBusquedaDepartamento] = useState<boolean>(false);
    const [modalBusquedaProvincia, setModalBusquedaProvincia] = useState<boolean>(false);
    const [modalBusquedaPais, setModalBusquedaPais] = useState<boolean>(false);
    const [editDomicilioId, setEditDomicilioId] = useState<number>(0);


    const handleModalClose = () => {
        setModalBusquedaLocalidad(false)
        setModalBusquedaDepartamento(false)
        setModalBusquedaProvincia(false)
        setModalBusquedaPais(false)
    };

    const handleEditClick = (id: number) => {
        setEditDomicilioId(id);
    };

    const handleCancelEdit = () => {
        setEditDomicilioId(0);
    };

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Perfil -</h1>
                <div className="preference-section">
                    <h2>&mdash; Información de Perfil &mdash;</h2>
                    <div className="settings-data">
                        <label id='nombre'>
                            {domicilios && domicilios.length > 0 && domicilios.map((domicilio, index) => (
                                <div key={domicilio.id}>
                                    <hr />
                                    {editDomicilioId === domicilio.id ? (
                                        <>
                                            &mdash; Cambiar domicilio &mdash;
                                            <div key={'domicilio-' + domicilio.id}>
                                                <hr /><p onClick={() => quitarCampoDomicilio(index)}>Eliminar domicilio</p>
                                                <div className="inputBox">
                                                    <input type="text" value={domicilio.calle} required={true} onChange={(e) => { handleChangeCalle(index, e.target.value) }} />
                                                    <span>Nombre de calle</span>
                                                </div>
                                                <div className="inputBox">
                                                    <input type="number" value={domicilio.numero} required={true} onChange={(e) => { handleChangeNumeroCasa(index, parseInt(e.target.value)) }} />
                                                    <span>Número de domicilio</span>
                                                </div>
                                                <div className="inputBox">
                                                    <input type="number" value={domicilio.codigoPostal} required={true} onChange={(e) => { handleChangeCodigoPostal(index, parseInt(e.target.value)) }} />
                                                    <span>Código Postal</span>
                                                </div>
                                                <label style={{ display: 'flex', fontWeight: 'bold' }}>Pais:</label>
                                                <InputComponent disabled={false} placeHolder='Seleccionar pais...' onInputClick={() => setModalBusquedaPais(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.pais?.nombre ?? ''} />
                                                {modalBusquedaPais && <ModalFlotanteRecomendacionesPais onCloseModal={handleModalClose} onSelectPais={(pais) => { handleChangePais(index, pais); handleModalClose(); }} />}
                                                <label style={{ display: 'flex', fontWeight: 'bold' }}>Provincia:</label>
                                                <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.pais.nombre.length === 0} placeHolder='Seleccionar provincia...' onInputClick={() => setModalBusquedaProvincia(true)} selectedProduct={domicilio.localidad?.departamento?.provincia?.nombre ?? ''} />
                                                {modalBusquedaProvincia && <ModalFlotanteRecomendacionesProvincias onCloseModal={handleModalClose} onSelectProvincia={(provincia) => { handleChangeProvincia(index, provincia); handleModalClose(); }} />}
                                                <label style={{ display: 'flex', fontWeight: 'bold' }}>Departamento:</label>
                                                <InputComponent disabled={domicilio.localidad?.departamento?.provincia?.nombre.length === 0} placeHolder='Seleccionar departamento...' onInputClick={() => setModalBusquedaDepartamento(true)} selectedProduct={domicilio.localidad?.departamento?.nombre ?? ''} />
                                                {modalBusquedaDepartamento && <ModalFlotanteRecomendacionesDepartamentos onCloseModal={handleModalClose} onSelectDepartamento={(departamento) => { handleChangeDepartamento(index, departamento); handleModalClose(); }} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
                                                <label style={{ display: 'flex', fontWeight: 'bold' }}>Localidad:</label>
                                                <InputComponent disabled={domicilio.localidad?.departamento?.nombre.length === 0} placeHolder='Seleccionar localidad...' onInputClick={() => setModalBusquedaLocalidad(true)} selectedProduct={domicilio.localidad.nombre ?? ''} />
                                                {modalBusquedaLocalidad && <ModalFlotanteRecomendacionesLocalidades onCloseModal={handleModalClose} onSelectLocalidad={(localidad) => { handleChangeLocalidad(index, localidad); handleModalClose(); }} inputDepartamento={domicilio.localidad?.departamento?.nombre} inputProvincia={domicilio.localidad?.departamento?.provincia?.nombre} />}
                                                <hr />
                                            </div>
                                            <button onClick={() => handleEditClick(domicilio.id)}>Terminar de editar domicilio</button>
                                            <button onClick={handleCancelEdit}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            Nombre:
                                            {domicilio.calle.length > 0 ? (
                                                <>
                                                    <input className='current-nombre'
                                                        type="text"
                                                        placeholder={`${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad.nombre}, ${domicilio.localidad.departamento.nombre}, ${domicilio.localidad.departamento.provincia.nombre}`}
                                                        readOnly
                                                    />
                                                    <button onClick={() => handleEditClick(domicilio.id)}>Editar nombre</button>
                                                </>
                                            ) : (
                                                <>
                                                    <input className='current-nombre'
                                                        type="text"
                                                        placeholder={'El domicilio ha sido eliminado'}
                                                        readOnly
                                                    />
                                                    <button onClick={() => handleEditClick(domicilio.id)}>Editar nombre</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
                        </label>
                        <button style={{ marginRight: '0px' }} onClick={actualizarDomicilios} disabled={isLoading}>
                            {isLoading ? 'Actualizando domicilios...' : 'Guardar cambios ✓'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Domicilios;
