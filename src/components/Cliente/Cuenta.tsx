import React, { useState, useEffect } from 'react';
import { Cliente } from '../../types/Cliente/Cliente';

const Cuenta = () => {
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cliente, setCliente] = useState<Cliente | null>(null);

    useEffect(() => {
        cargarUsuario();
    }, []);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();

        setCliente(clienteMem);
        setCurrentEmail(clienteMem?.email);
        setCurrentPassword(clienteMem?.contraseña);
    }            

    const handleEditEmail = () => {
        setEditEmail(true);
    };

    const handleSaveEmailChanges = () => {
        if (newEmail === confirmEmail) {
            setCurrentEmail(newEmail);
            setEditEmail(false);
            setNewEmail('');
            setConfirmEmail('');
            updateLocalStorage();
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
            updateLocalStorage();
        } else {
            alert('Las contraseñas no coinciden');
        }
    };

    const updateLocalStorage = () => {
        const profile = { email: currentEmail, password: currentPassword };
        localStorage.setItem('profile', JSON.stringify(profile));
    };

    const maskedEmail = `${currentEmail.slice(0, 4)}****@${currentEmail.split('@')[1]}`;

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Cuenta -</h1>
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
                                        value={currentEmail}
                                        readOnly
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo nuevo"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Confirmar correo nuevo"
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
                                        value={currentPassword}
                                        readOnly
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
                                        value="********"
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

export default Cuenta;
