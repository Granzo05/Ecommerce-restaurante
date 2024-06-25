import { useEffect, useState } from 'react';
import '../../styles/perfil.css'
import { Cliente } from '../../types/Cliente/Cliente';
import { Domicilio } from '../../types/Domicilio/Domicilio';
import { ClienteService } from '../../services/ClienteService';
import { toast, Toaster } from 'sonner';
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
    const [newDomicilios, setNewDomicilios] = useState<Domicilio[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [borrado, setBorrado] = useState(false);
    const [cambios, setCambios] = useState(false);

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

            if (!borrado) {
                // Verificar si los arrays son idénticos
                if (cliente.domicilios.length === newDomicilios.length &&
                    cliente.domicilios.every(domicilio =>
                        newDomicilios.some(newDomicilio => sonDomiciliosIguales(domicilio, newDomicilio))
                    )) {
                    toast.info(`Los domicilios no poseen cambios`);
                    setIsLoading(false);
                    return;
                }
            }

            if (cliente.domicilios.length !== newDomicilios.length) {
                // Si algún domicilio se ha borrado, marcarlo
                cliente.domicilios.forEach(domicilio => {
                    const existeEnNewDomicilios = newDomicilios.some(newDomicilio => sonDomiciliosIguales(domicilio, newDomicilio));
                    if (!existeEnNewDomicilios) {
                        domicilio.borrado = 'SI';
                    }
                });

                newDomicilios.forEach(domicilio => {
                    cliente.domicilios.push(domicilio);
                });
            }

            cliente.domicilios = eliminarDuplicados(cliente.domicilios);

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando los domicilios...',
                success: () => {
                    return `Domicilios actualizados con éxito...`;
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

    function sonDomiciliosIguales(domicilio1: Domicilio, domicilio2: Domicilio) {
        return domicilio1.calle === domicilio2.calle && domicilio1.numero === domicilio2.numero && domicilio1.codigoPostal === domicilio2.codigoPostal && domicilio1.localidad.nombre === domicilio2.localidad.nombre;
    }

    function eliminarDuplicados(domicilios: Domicilio[]) {
        return domicilios.filter((domicilio, index, self) =>
            index === self.findIndex(d => sonDomiciliosIguales(d, domicilio))
        );
    }

    const handleChangeCalle = (index: number, calle: string) => {
        const nuevosDomicilios = [...newDomicilios];
        nuevosDomicilios[index].calle = calle;
        setNewDomicilios(nuevosDomicilios);
    };

    const handleChangeNumeroCasa = (index: number, numero: number) => {
        const nuevosDomicilios = [...newDomicilios];
        nuevosDomicilios[index].numero = numero;
        setNewDomicilios(nuevosDomicilios);
    };

    const handleChangeCodigoPostal = (index: number, codigoPostal: number) => {
        const nuevosDomicilios = [...newDomicilios];
        nuevosDomicilios[index].codigoPostal = codigoPostal;
        setNewDomicilios(nuevosDomicilios);
    };

    const handleChangePais = (index: number, pais: Pais) => {
        const nuevosDomicilios = [...newDomicilios];
        if (pais) {
            nuevosDomicilios[index].localidad.departamento.provincia.pais = pais;
            setNewDomicilios(nuevosDomicilios);
        }
    };

    const handleChangeProvincia = (index: number, provincia: Provincia) => {
        const nuevosDomicilios = [...newDomicilios];
        if (provincia) {
            nuevosDomicilios[index].localidad.departamento.provincia = provincia;
            setNewDomicilios(nuevosDomicilios);
        }
    };

    const handleChangeDepartamento = (index: number, departamento: Departamento) => {
        const nuevosDomicilios = [...newDomicilios];
        if (departamento) {
            nuevosDomicilios[index].localidad.departamento = departamento;
            setNewDomicilios(nuevosDomicilios);
        }
    };

    const handleChangeLocalidad = (index: number, localidad: Localidad) => {
        const nuevosDomicilios = [...newDomicilios];
        if (localidad) {
            nuevosDomicilios[index].localidad = localidad;
            setNewDomicilios(nuevosDomicilios);
        }
    };

    const añadirCampoDomicilio = () => {
        setNewDomicilios([...newDomicilios, { id: newDomicilios.length + 1, calle: '', numero: 0, codigoPostal: 0, localidad: new Localidad(), borrado: 'NO' }]);
    };

    const quitarCampoDomicilio = (index: number) => {
        const nuevosDomicilios = [...newDomicilios];
        nuevosDomicilios.splice(index, 1);
        setNewDomicilios(nuevosDomicilios);
    };

    const activarDomicilio = (domicilio: Domicilio) => {
        domicilio.borrado = 'NO';
        setBorrado(true);
        setCambios(!cambios);
    };

    const desactivarDomicilio = (domicilio: Domicilio) => {
        domicilio.borrado = 'SI';
        setBorrado(true);
        setCambios(!cambios);
    };

    useEffect(() => {
        setNewDomicilios(newDomicilios)
    }, [cambios]);

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

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Perfil -</h1>
                <Toaster />
                <div className="preference-section">
                    <h2>&mdash; Información de Perfil &mdash;</h2>
                    <div className="settings-data">
                        <label id='nombre'>
                            {newDomicilios && newDomicilios.map((domicilio, index) => (
                                <div key={domicilio.id}>
                                    <hr />
                                    {editDomicilioId === domicilio.id ? (
                                        <>
                                            &mdash; Cambiar domicilio &mdash;
                                            <hr />
                                            {domicilio.borrado === 'NO' ? (
                                                <p onClick={() => quitarCampoDomicilio(index)}>Eliminar domicilio</p>
                                            ) : (
                                                <p onClick={() => newDomicilios[index].borrado === 'NO'}>Activar domicilio</p>
                                            )}
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
                                            <button onClick={() => handleEditClick(0)}>Terminar de editar domicilio</button>
                                            <button onClick={() => quitarCampoDomicilio(index)}>Cancelar</button>
                                        </>
                                    ) : (
                                        <>
                                            {domicilio.borrado === 'NO' ? (
                                                <p>Domicilio activo:</p>
                                            ) : (
                                                <p>Domicilio desactivado:</p>
                                            )}
                                            {domicilio.calle.length > 0 ? (
                                                <>
                                                    <input className='current-nombre'
                                                        type="text"
                                                        placeholder={`${domicilio.calle} ${domicilio.numero}, ${domicilio.localidad.nombre}, ${domicilio.localidad.departamento.nombre}, ${domicilio.localidad.departamento.provincia.nombre}`}
                                                        readOnly
                                                    />
                                                    {domicilio.borrado === 'NO' ? (
                                                        <>
                                                            <button className='btn-editar' onClick={() => handleEditClick(domicilio.id)}>Editar domicilio</button>
                                                            <button className='btn-desactivar' onClick={() => desactivarDomicilio(domicilio)}>Desactivar domicilio</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button className='btn-editar' onClick={() => handleEditClick(domicilio.id)}>Editar domicilio</button>
                                                            <button className='btn-activar' onClick={() => activarDomicilio(domicilio)}>Activar domicilio</button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <input className='current-nombre'
                                                        type="text"
                                                        placeholder={'Domicilio vacio'}
                                                        onClick={() => handleEditClick(domicilio.id)}
                                                        readOnly
                                                    />
                                                    <button className='btn-editar' onClick={() => handleEditClick(domicilio.id)}>Editar domicilio</button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                            <hr />
                            <button onClick={añadirCampoDomicilio}>Añadir domicilio</button>
                            <br />
                        </label>
                        <button className='btn-guardar-cambios' style={{ marginRight: '0px' }} onClick={actualizarDomicilios} disabled={isLoading}>
                            {isLoading ? 'Actualizando domicilios...' : 'Guardar cambios ✓'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Domicilios;
