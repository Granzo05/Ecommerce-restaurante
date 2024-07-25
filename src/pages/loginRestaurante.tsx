import { useEffect, useState } from 'react'
import '../styles/loginRestaurante.css'
import { Toaster, toast } from 'sonner';
import { frases } from '../utils/global_variables/const';
import ModalCrud from '../components/ModalCrud';
import HeaderLogin from '../components/headerLogin';
import { EmpresaService } from '../services/EmpresaService';

const LoginNegocio = () => {
  const handleAgregarArticulo = () => {
    setModalIsOpenP(true);
  };

  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ingresar = () => {
    if (email === 'a@gmail.com' && contraseña === '123') {
      window.location.href = 'http://localhost:5173/1/opciones'
    }
  }

  const handleIniciarSesionNegocio = () => {

    setIsLoading(true);
    if (email.length === 0) {
      toast.error('Debe ingresar un e-mail o CUIT válido');
      setIsLoading(false);
      return;
    } else if (contraseña.length === 0) {
      toast.error('Debe ingresar una contraseña válida');
      setIsLoading(false);
      return;
    }

    toast.promise(EmpresaService.getEmpresa(email, contraseña), {
      loading: 'Iniciando sesión...',
      success: 'Abriendo sesión',
      error: 'Credenciales incorrectas',
      duration: 3000,
      finally: () => {
        setIsLoading(false);
      }
    });
  };

  const [frase, setFrase] = useState('');
  const [autor, setAutor] = useState('');
  const [comidaImg, setComidaImg] = useState('');
  const [autorImg, setAutorImg] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * frases.length);
    setFrase(frases[randomIndex].frase);
    setAutor(frases[randomIndex].autor);
    setComidaImg(frases[randomIndex].comidaImg);
    setAutorImg(frases[randomIndex].autorImg);
  }, []);

  const [modalIsOpenP, setModalIsOpenP] = useState(false);


  const closeModalP = () => {
    setModalIsOpenP(false);
  };

  const [error, setError] = useState('');

  const validateEmailOrCuit = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cuitPattern = /^\d{11}$/;

    if (emailPattern.test(value)) {
      setError('');
    } else if (cuitPattern.test(value)) {
      setError('');
    } else {
      setError('Por favor ingresa un correo válido o un CUIT de 11 dígitos.');
    }
  };

  const handleChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setEmail(value);
    validateEmailOrCuit(value);
  };


  return (
    <>
      <HeaderLogin></HeaderLogin>
      <div className="form-wrapper">

        <aside className="info-side">
          <div className="blockquote-wrapper">
            <img id='comida-img'
              src={comidaImg}
              alt="Returns"
              className="returns"
            />
            <blockquote id='frase'>~&nbsp;
              {frase}&nbsp;~
            </blockquote>
            <div className="author">
              <img id='autor-img' src={autorImg} alt="Avatar" className="avatar" />
              <span className="author-name" id='nombre-autor'>{autor}</span>
            </div>
          </div>
        </aside>
        <main className="form-side">
          <Toaster />
          <div className="my-form">
            <div className="form-welcome-row">
              <h1>¡Bienvenido, otra vez! &#128079;</h1>
              <h2>- Ingresa a tu cuenta -</h2>
            </div>
            <div className="text-field">
              <label htmlFor="emailOrCuit">E-mail o CUIT:</label>
              <input
                type="text"
                id="emailOrCuit"
                name="emailOrCuit"
                autoComplete="off"
                placeholder="tu@ejemplo.com o 12345678901"
                required
                value={email}
                onChange={handleChange}
              />
            </div>
            <div className="text-field">
              <label htmlFor="password">Contraseña:</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="tu contraseña"
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            <div className="my-form__actions">
              <div className="my-form__row_contra">
                <span>¿Has olvidado tu contraseña? <a href="#reestablecerContra" title="Reset Password" onClick={handleAgregarArticulo}>
                  Reestablecela
                </a></span>
                <div>
                  <ModalCrud
                    isOpen={modalIsOpenP}
                    onClose={closeModalP}
                  >
                    <div className="modal-info">
                      <h2>&mdash; Reestablecer contraseña &mdash;</h2>
                      <p>Por favor, ingresa tu correo electrónico para reestablecer tu contraseña:</p>
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
                        <div className="btns-pasos">
                          <button className='btn-agregar'>Enviar correo</button>

                        </div>
                      </div>

                    </div>
                  </ModalCrud>
                </div>

              </div>
            </div>
            <button className="my-form__button" onClick={handleIniciarSesionNegocio} disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
            </button>
          </div>
        </main>
      </div>
    </>

  )
}

export default LoginNegocio