import React, { useState, useEffect } from 'react';
import { Cliente } from '../../types/Cliente/Cliente';
import { ClienteService } from '../../services/ClienteService';
import { toast, Toaster } from 'sonner';

const Cuenta = () => {
    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [editTelefono, setEditTelefono] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentTelefono, setCurrentTelefono] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailOculto, setEmailOculto] = useState('');
    const [cliente, setCliente] = useState<Cliente>();
    const [isLoading, setIsLoading] = useState(false);
    const [currentNombre, setCurrentNombre] = useState('');
    const [newNombre, setNewNombre] = useState('');
    const [editNombre, setEditNombre] = useState(false);

    useEffect(() => {
        cargarUsuario();
    }, []);

    useEffect(() => {
        if (cliente && cliente?.email?.length > 0) setEmailOculto(`${cliente?.email?.slice(0, 4)}****@${cliente?.email.split('@')[1]}`);
    }, [cliente]);

    useEffect(() => {
        if (cliente && cliente?.telefono > 0) setCurrentTelefono((cliente.telefono).toString());
    }, [cliente]);

    useEffect(() => {
        if (cliente && cliente?.nombre.length > 0) setCurrentNombre(cliente.nombre);
    }, [cliente]);

    const cargarUsuario = async () => {
        const clienteString = localStorage.getItem('usuario');
        if (clienteString) {
            let clienteMem: Cliente = clienteString ? JSON.parse(clienteString) : new Cliente();
            const cliente = await ClienteService.getUserById(clienteMem?.id);
            setCliente(cliente);
        }
    }

    async function actualizarEmail() {
        if (cliente) {
            if (newEmail !== confirmEmail) {
                alert('Los correos electrónicos no coinciden');
                return;
            } else if (newEmail === currentEmail) {
                toast.info('Los correos ingresados son iguales');
                return;
            } else if (cliente.email !== currentEmail) {
                toast.info('El correo actual ingresado no corresponde con el almacenado');
                return;
            } else if (!currentEmail || !currentEmail.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
                toast.error("Por favor, es necesario un e-mail válido para el actual");
                return;
            } else if (!newEmail || !newEmail.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/) || !confirmEmail || !confirmEmail.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}/)) {
                toast.error("Por favor, es necesario un e-mail válido para el nuevo");
                return;
            }

            setIsLoading(true);

            cliente.email = newEmail;

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando el correo...',
                success: () => {
                    setEditEmail(false);
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

    async function actualizarContraseña() {
        if (cliente) {
            if (newPassword !== confirmPassword) {
                toast.info('Las contraseñas nuevas no coinciden');
                return;
            } else if (await !ClienteService.checkPassword(cliente.id, currentPassword)) {
                toast.info('La contraseña actual no coincide con la contraseña almacenada en la cuenta');
                return;
            } else if (newPassword.length < 8 && confirmPassword.length < 8) {
                toast.info('La nueva contraseña debe contener más de 8 caracteres');
                return;
            }

            setIsLoading(true);

            cliente.contraseña = newPassword;

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando la contraseña...',
                success: () => {
                    setEditPassword(false);
                    return `Contraseña actualizada con éxito...`;
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

    async function actualizarTelefono() {
        if (cliente) {
            if (!currentTelefono.replace(/\D/g, '') || currentTelefono.length < 10) {
                // /\D/g, reemplaza todos las letras
                toast.error("Por favor, es necesario un número de telefono válido");
                return;
            } else if (parseInt(currentTelefono) === cliente.telefono) {
                toast.error("Por favor, los números deben ser distintos");
                return;
            }

            setIsLoading(true);

            cliente.telefono = parseInt(currentTelefono.replace(/\D/g, ''));

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando el teléfono...',
                success: () => {
                    setEditTelefono(false);
                    return `Teléfono actualizado con éxito...`;
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

    async function actualizarNombre() {
        if (cliente) {
            if (!currentNombre || !currentNombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-]+$/)) {
                toast.error("Por favor, es necesario un nombre válido");
                return;
            } else if (currentNombre === cliente.nombre) {
                toast.error("Por favor, los nombres deben ser distintos");
                return;
            }

            setIsLoading(true);

            cliente.nombre = newNombre;

            toast.promise(ClienteService.updateUser(cliente), {
                loading: 'Actualizando el nombre...',
                success: () => {
                    setEditTelefono(false);
                    return `Nombre actualizado con éxito...`;
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

    return (
        <>
            <div className="opciones-pantallas">
                <h1>- Cuenta -</h1>
                <Toaster />
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
                                        onChange={(e) => setCurrentEmail(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo nuevo"
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Confirmar correo nuevo"
                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                    />
                                    <button className="btn" onClick={actualizarEmail} disabled={isLoading}>
                                        {isLoading ? 'Actualizando el correo...' : 'Cambiar correo'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    Correo electrónico:
                                    <input className='current-email'
                                        type="email"
                                        placeholder={emailOculto}
                                        readOnly
                                    />
                                    <button onClick={() => setEditEmail(true)}>Editar correo</button>
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
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Contraseña nueva"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirmar contraseña nueva"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button className="btn" onClick={actualizarContraseña} disabled={isLoading}>
                                        {isLoading ? 'Actualizando la contraseña...' : 'Cambiar contraseña'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    Contraseña:
                                    <input className='current-pass'
                                        type="password"
                                        placeholder="********"
                                        readOnly
                                    />
                                    <button onClick={() => setEditPassword(true)}>Editar contraseña</button>
                                </>
                            )}
                            <hr />
                        </label>
                        <label id='pass'>
                            {editNombre ? (
                                <>
                                    &mdash; Cambiar nombre &mdash;
                                    <input
                                        type="text"
                                        placeholder="Nombre actual"
                                        value={newNombre}
                                        onChange={(e) => setNewNombre(e.target.value)}
                                    />
                                    <button className="btn" onClick={actualizarNombre} disabled={isLoading}>
                                        {isLoading ? 'Actualizando el nombre...' : 'Cambiar nombre'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    Nombre:
                                    <input className='current-pass'
                                        type="text"
                                        placeholder={currentNombre}
                                        readOnly
                                    />
                                    <button onClick={() => setEditNombre(true)}>Editar nombre</button>
                                </>
                            )}
                            <hr />
                        </label>
                        <label id='pass'>
                            {editTelefono ? (
                                <>
                                    &mdash; Cambiar teléfono &mdash;
                                    <input
                                        type="number"
                                        placeholder="Telefono actual"
                                        value={currentTelefono}
                                        onChange={(e) => setCurrentTelefono(e.target.value)}
                                    />
                                    <button className="btn" onClick={actualizarTelefono} disabled={isLoading}>
                                        {isLoading ? 'Actualizando el número...' : 'Cambiar teléfono'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    Teléfono:
                                    <input className='current-pass'
                                        type="number"
                                        placeholder={currentTelefono}
                                        readOnly
                                    />
                                    <button onClick={() => setEditTelefono(true)}>Editar teléfono</button>
                                </>
                            )}
                            <hr />
                        </label>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Cuenta;
