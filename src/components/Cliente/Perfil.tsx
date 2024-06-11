import React, { useEffect, useState } from 'react';
import '../../styles/perfil.css'
import { Cliente } from '../../types/Cliente/Cliente';
import { Domicilio } from '../../types/Domicilio/Domicilio';

const Perfil = () => {
    const [editNombre, setEditNombre] = useState(false);
    const [editTelefono, setEditTelefono] = useState(false);
    const [editDomicilio, setEditDomicilio] = useState(false);
    const [currentNombre, setCurrentNombre] = useState('');
    const [newNombre, setNewNombre] = useState('');

    const [currentTelefono, setCurrentTelefono] = useState();
    const [newTelefono, setNewTelefono] = useState('');

    const [currentDomicilio, setCurrentDomicilio] = useState('');
    const [newDomicilio, setNewDomicilio] = useState('');

    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
        setCurrentNombre(clienteMem?.nombre);
       
    }



    const handleEditNombre = () => {
        setEditNombre(true);
    };

    const handleSaveNombreChanges = () => {
        setCurrentNombre(newNombre);
        setEditNombre(false);
        setNewNombre('');
    };

    const handleEditTelefono = () => {
        setEditTelefono(true);
    };

    const handleSaveTelefonoChanges = () => {
        setEditTelefono(false);
        setNewTelefono('');
    };

    const handleEditDomicilio = () => {
        setEditDomicilio(true);
    };

    const handleSaveDomicilioChanges = () => {
        setCurrentDomicilio(newDomicilio);
        setEditDomicilio(false);
        setNewDomicilio('');
    };

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Perfil -</h1>
                <div className="preference-section">
                    <h2>&mdash; Información de Perfil &mdash;</h2>
                    <div className="settings-data">
                        <label id='nombre'>
                            {editNombre ? (
                                <>
                                    &mdash; Cambiar nombre &mdash;
                                    <input
                                        type="text"
                                        placeholder="Nombre nuevo"
                                        value={newNombre}
                                        onChange={(e) => setNewNombre(e.target.value)}
                                    />
                                    <button onClick={handleSaveNombreChanges}>Cambiar nombre</button>
                                </>
                            ) : (
                                <>
                                    Nombre:
                                    <input className='current-nombre'
                                        type="text"
                                        value={currentNombre}
                                        readOnly
                                    />
                                    <button onClick={handleEditNombre}>Editar nombre</button>
                                </>
                            )}
                            <hr />
                        </label>
                        <label id='telefono'>
                            {editTelefono ? (
                                <>
                                    &mdash; Cambiar teléfono &mdash;
                                    <input
                                        type="text"
                                        placeholder="Teléfono nuevo"
                                        value={newTelefono}
                                        onChange={(e) => setNewTelefono(e.target.value)}
                                    />
                                    <button onClick={handleSaveTelefonoChanges}>Cambiar teléfono</button>
                                </>
                            ) : (
                                <>
                                    Teléfono:
                                    <input className='current-telefono'
                                        type="text"
                                        value={cliente?.telefono}
                                        readOnly
                                    />
                                    <button onClick={handleEditTelefono}>Editar teléfono</button>
                                </>
                            )}
                            <hr />
                        </label>
                        <label id='domicilio'>
                            {editDomicilio ? (
                                <>
                                    &mdash; Cambiar domicilio &mdash;
                                    <input
                                        type="text"
                                        placeholder="Domicilio nuevo"
                                        value={newDomicilio}
                                        onChange={(e) => setNewDomicilio(e.target.value)}
                                    />
                                    <button onClick={handleSaveDomicilioChanges}>Cambiar domicilio</button>
                                </>
                            ) : (
                                <>
                                    Domicilio:
                                        <div >
                                            <input className='current-domicilio'
                                                type="text"
                                                value=''
                                                readOnly
                                            />
                                        </div>
                                    <button onClick={handleEditDomicilio}>Editar domicilio</button>
                                </>
                            )}
                            <hr />
                        </label>
                    </div>
                </div>
                <div className="btns-stock">
                    <button className="btn-accion-registrarse">Guardar cambios ✓</button>
                </div>
            </div>
        </>
    );
};

export default Perfil;
