import React from 'react';
import Modal from 'react-modal';


function ReestablecerContra() {
  return (
      <div className="modal-info">
        <h2>Restablecer Contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico para restablecer tu contraseña.</p>
        <div>
          <div className="inputBox">
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              required
            />
            <span>E-mail de recuperación:</span>
            <div className="error-message">Formato incorrecto de e-mail.</div>
          </div>
          <button>Enviar</button>
        </div>
      </div>
  );
};

export default ReestablecerContra;
