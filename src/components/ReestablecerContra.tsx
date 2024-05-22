
import '../styles/modalFlotante.css'


function ReestablecerContra() {
  return (
      <div className="modal-info">
        <h2>Restablecer Contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico para restablecer tu contraseña.</p>
          <div className="inputBox">
            <input type="email" required={true}/>
            <span>E-mail de recuperación</span>
          </div>
        <button>Enviar</button>
      </div>
  );
};

export default ReestablecerContra;
