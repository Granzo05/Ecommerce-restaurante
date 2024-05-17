import React, { useState } from 'react';
import '../styles/passwordResetForm.css';

const PasswordResetForm = () => {

    const [password, setPassword] = useState("");

    const handlePasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value);
    };


    return (
        <div className="password-change-container">
            <div className="password-change-form">
                <h2>Restablecer contraseña</h2>
                <p>Por favor, ingresa tu nueva contraseña.</p>
                <form>
                    <div className="form-field-pf">
                        <label htmlFor="password">Nueva contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Ingresa tu nueva contraseña"
                            onChange={handlePasswordChange}
                            title="Minimum 6 characters at least 1 Alphabet and 1 Number"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required
                        />
                        <div className="error-message">Mínimo 6 caracteres. 1 letra y 1 número.</div>
                    </div>

                    <div className="form-field-pf">
                        <label htmlFor="confirmPassword">Confirmar contraseña:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirma tu nueva contraseña"
                            pattern={`^${password}$`}
                            title="Las contraseñas no coinciden"
                            required
                        />
                        <div className="error-message">Las contraseñas no coinciden.</div>
                    </div>
                    
                    <button id='btn-save-pass' type="submit">Guardar Contraseña</button>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetForm;