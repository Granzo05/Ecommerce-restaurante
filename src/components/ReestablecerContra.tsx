
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import '../styles/modalFlotante.css'



function ReestablecerContra() {
  const [email, setEmail] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) {
      toast.error('ERROR, CORREO INCORRECTO');
    } else {
      // Aquí puedes manejar el envío del correo
      console.log('Correo válido, enviar solicitud');
    }
  };
  
  return (
      <div className="modal-info">
        <h2>Restablecer Contraseña</h2>
        <p>Por favor, ingresa tu correo electrónico para restablecer tu contraseña.</p>
          <div className="inputBox">
            <input type="text" required={true}/>
            <span>E-mail de recuperación</span>
          </div>
        <button onClick={handleSubmit}>Enviar</button>
      </div>
  );
}

export default ReestablecerContra;
