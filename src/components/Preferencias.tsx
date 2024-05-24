import React, { useState } from 'react';
import '../styles/preferencias.css';

const Preferencias = () => {
    

    return (
        <div className="preferencias-container">
            <h2>Preferencias de Usuario</h2>
            <form >
                <div className="preference-section">
                    <h3>Configuración de Cuenta</h3>
                    <label>
                        Correo Electrónico:
                        <input
                            type="email"
                            name="email"
                        />
                    </label>
                    <label>
                        Contraseña:
                        <input
                            type="password"
                            name="password"
                        />
                    </label>
                </div>
                <div className="preference-section">
                    <h3>Preferencias de Tema</h3>
                    <label>
                        Tema:
                        <select name="theme">
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                        </select>
                    </label>
                </div>
                <button>Guardar Cambios</button>
            </form>
        </div>
    );
};

export default Preferencias;
