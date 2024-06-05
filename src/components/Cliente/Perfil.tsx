import React, { useState } from 'react';
import '../../styles/perfil.css'

const Perfil = () => {
    const [editNombre, setEditNombre] = useState(false);
    const [editTelefono, setEditTelefono] = useState(false);
    const [editDomicilio, setEditDomicilio] = useState(false);

    const [currentNombre, setCurrentNombre] = useState('Nombre de Usuario');
    const [newNombre, setNewNombre] = useState('');

    const [currentTelefono, setCurrentTelefono] = useState('1234567890');
    const [newTelefono, setNewTelefono] = useState('');

    const [currentDomicilio, setCurrentDomicilio] = useState('Calle Falsa 123');
    const [newDomicilio, setNewDomicilio] = useState('');

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
        setCurrentTelefono(newTelefono);
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
                                        value={currentTelefono}
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
                                    <input className='current-domicilio'
                                        type="text"
                                        value={currentDomicilio}
                                        readOnly
                                    />
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
