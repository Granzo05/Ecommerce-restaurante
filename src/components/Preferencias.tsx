import React, { useState } from 'react';
import '../styles/preferencias.css'

const Preferencias = () => {
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('usuario@ejemplo.com');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('123456');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEditEmail = () => {
        setEditEmail(true);
    };

    const handleSaveEmailChanges = () => {
        if (newEmail === confirmEmail) {
            setCurrentEmail(newEmail);
            setEditEmail(false);
            setNewEmail('');
            setConfirmEmail('');
        } else {
            alert('Los correos electrónicos no coinciden');
        }
    };

    const handleEditPassword = () => {
        setEditPassword(true);
    };

    const handleSavePasswordChanges = () => {
        if (newPassword === confirmPassword) {
            setCurrentPassword(newPassword);
            setEditPassword(false);
            setNewPassword('');
            setConfirmPassword('');
        } else {
            alert('Las contraseñas no coinciden');
        }
    };

    const maskedEmail = `${currentEmail.slice(0, 4)}****@${currentEmail.split('@')[1]}`;

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Preferencias -</h1>
                <div className="preference-section">
                    <h2>&mdash; Configuración de cuenta &mdash;</h2>
                    <div className="settings-data">
                        <label id='email'>
                            
                            {editEmail ? (
                                <>
                                &mdash; Cambiar correo electrónico &mdash;
                                    <input
                                    type="email"
                                    placeholder="Correo actual"
                                    value=''
                                />
                                    <input
                                        type="email"
                                        placeholder="Correo Nuevo"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Confirmar Correo Nuevo"
                                        value={confirmEmail}
                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                    />
                                    <button onClick={handleSaveEmailChanges}>Cambiar correo</button>
                                </>
                            ) : (
                                <>
                                Correo electrónico:
                                    <input className='current-email'
                                        type="email"
                                        value={maskedEmail}
                                        readOnly
                                    />
                                    <button onClick={handleEditEmail}>Editar correo</button>
                                </>
                            )}
                            <hr />
                        </label>
                        <label id='pass'>
                            {editPassword ? (
                                <>
                                &mdash; Cambiar contraseña &mdash;
                                    <input
                                        type="password"
                                        placeholder="Contraseña actual"
                                        value=''
                                    />
                                    <input
                                        type="password"
                                        placeholder="Contraseña nueva"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmar contraseña nueva"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button onClick={handleSavePasswordChanges}>Cambiar contraseña</button>
                                </>
                            ) : (
                                <>
                                Contraseña:
                                    <input className='current-pass'
                                        type="password"
                                        value={currentPassword}
                                        readOnly
                                    />
                                    <button onClick={handleEditPassword}>Editar contraseña</button>
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

export default Preferencias;
