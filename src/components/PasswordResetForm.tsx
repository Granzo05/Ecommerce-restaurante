import { useState } from 'react';
import '../styles/passwordResetForm.css';
import HeaderLogin from './headerLogin';

const PasswordResetForm = () => {

    const [password, setPassword] = useState("");

    return (
        <>
        <HeaderLogin></HeaderLogin>
        <div className="password-change-container">
            <div className="password-change-form">
                <h2>Restablecer contraseña</h2>
                <p>Por favor, ingresa tu nueva contraseña.</p>
                <form>
                    <div className="form-field-pf">
                        <div className="inputBox">
                            <input type="password" pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$" required={true} onChange={(e) => { setPassword(e.target.value) }} />
                            <span>Ingresa tu nueva contraseña</span>
                        </div>
                    </div>

                    <div className="form-field-pf">
                        <div className="inputBox">
                            <input type="password" pattern={`^${password}$`} required={true} onChange={(e) => { setPassword(e.target.value) }} />
                            <span>Confirmar contraseña</span>
                        </div>
                    </div>

                    <button id='btn-save-pass' type="submit">Guardar Contraseña</button>
                </form>
            </div>
        </div>
        </>
        
    );
};

export default PasswordResetForm;