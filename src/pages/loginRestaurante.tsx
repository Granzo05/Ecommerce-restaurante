import { useEffect, useState } from 'react'
import '../styles/loginRestaurante.css'
import { SucursalService } from '../services/SucursalService';
import { Toaster, toast } from 'sonner';
import Modal from 'react-modal';
import HeaderLogin from '../components/headerLogin';

const LoginNegocio = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleIniciarSesionNegocio = () => {
    toast.promise(SucursalService.getSucursal(email, contraseña), {
      loading: 'Iniciando sesión...',
      success: (message: string) => {
        setInterval(() => {
          window.location.href = '/'
        }, 1000);
        return message;
      },
      error: (message: string) => {
        return message;
      },
    });
  };

  const [frase, setFrase] = useState('');
  const [autor, setAutor] = useState('');
  const [comidaImg, setComidaImg] = useState('');
  const [autorImg, setAutorImg] = useState('');

  const frases = [
    {
      frase: "La comida es nuestra mejor medicina.",
      autor: "Hipócrates",
      comidaImg: "../src/assets/img/fondo-login-negocio.jpg",
      autorImg: "../src/assets/img/autores/hipocrates.jpeg"
    },
    {
      frase: "Uno no puede pensar bien, amar bien, dormir bien, si no ha cenado bien.",
      autor: "Virginia Woolf",
      comidaImg: "../src/assets/img/hamburguesa-background.png",
      autorImg: "../src/assets/img/autores/virgi.jpg"
    },
    {
      frase: "La comida es la parte más primitiva de nosotros mismos que nos conecta con la vida y la experiencia.",
      autor: "Ferran Adrià",
      comidaImg: "../src/assets/img/lomo-background.jpeg",
      autorImg: "../src/assets/img/autores/ferran.jpeg"
    },
    {
      frase: "La comida es nuestra fuente de energía y vitalidad. ¡Disfrútala!",
      autor: "Martha Stewart",
      comidaImg: "../src/assets/img/pastas.png",
      autorImg: "../src/assets/img/autores/marta.jpg"
    },
    {
      frase: "La cocina es un acto de amor.",
      autor: "Joel Robuchon",
      comidaImg: "../src/assets/img/pizza-background.png",
      autorImg: "../src/assets/img/autores/joel.jpeg"
    },
    {
      frase: "Una mesa bien servida alimenta más que un festín mal ordenado.",
      autor: "Luciano Pavarotti",
      comidaImg: "../src/assets/img/sushi-background.jpg",
      autorImg: "../src/assets/img/autores/luciano.jpg"
    },
    {
      frase: "Comer bien es un acto de amor hacia uno mismo.",
      autor: "Jamie Oliver",
      comidaImg: "../src/assets/img/vegetariano.jpg",
      autorImg: "../src/assets/img/autores/jamie.jpeg"
    },
    {
      frase: "No hay amor más sincero que el amor a la comida.",
      autor: "George Bernard Shaw",
      comidaImg: "../src/assets/img/asado.jpg",
      autorImg: "../src/assets/img/autores/george.jpeg"
    },
    {
      frase: "La comida es el ingrediente que une a las personas.",
      autor: "Guy Fieri",
      comidaImg: "../src/assets/img/tacos.jpg",
      autorImg: "../src/assets/img/autores/guy.jpeg"
    },
    {
      frase: "La cocina es un arte, la comida es el medio de expresión.",
      autor: "François Minot",
      comidaImg: "../src/assets/img/nose.jpg",
      autorImg: "../src/assets/img/autores/francois.jpeg"
    }
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * frases.length);
    setFrase(frases[randomIndex].frase);
    setAutor(frases[randomIndex].autor);
    setComidaImg(frases[randomIndex].comidaImg);
    setAutorImg(frases[randomIndex].autorImg);
  }, []); // Se ejecutará una vez al cargar la página

  const [modalIsOpenP, setModalIsOpenP] = useState(false);

  const openModalP = () => {
    setModalIsOpenP(true);
  };

  const closeModalP = () => {
    setModalIsOpenP(false);
  };

  const [modalIsOpenC, setModalIsOpenC] = useState(false);

  const openModalC = () => {
    setModalIsOpenC(true);
  };

  const closeModalC = () => {
    setModalIsOpenC(false);
  };


  return (
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
        <form className="my-form">
          <div className="form-welcome-row">
            <h1>¡Bienvenido, otra vez! &#128079;</h1>
            <h2>- Ingresa a tu cuenta -</h2>
          </div>
          <div className="text-field">
            <label htmlFor="email">E-mail:</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              placeholder="tu@ejemplo.com"
              required
            />
            
            <div className="error-message">Formato incorrecto de e-mail.</div>
          </div>
          <div className="text-field">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="tu contraseña"
              title="Minimum 6 characters at least 1 Alphabet and 1 Number"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
              required
            />
            <div className="error-message">Mínimo 6 caracteres. 1 letra y 1 número.</div>
          </div>
          <div className="my-form__actions">
            <div className="my-form__row_contra">
              <span>¿Has olvidado tu contraseña? <a href="#reestablecerContra" title="Reset Password" onClick={openModalP}>
                Reestablecela
              </a></span>
              <div>
                <Modal
                  isOpen={modalIsOpenP}
                  onRequestClose={closeModalP}
                  id='modal-pass-forget'
                  style={{
                    content: {
                      top: '50%',
                      left: '50%',
                      right: 'auto',
                      bottom: 'auto',
                      marginRight: '-50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 200px black'
                    },
                  }}
                  shouldCloseOnOverlayClick={false}
                >
                  <div className="modal-content">
                    <button className="close-button" onClick={closeModalP}><a href=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC" /></a></button>
                    <h2>Restablecer Contraseña</h2>
                    <p>Por favor, ingresa tu correo electrónico para restablecer tu contraseña.</p>
                    <form className="password-reset-form">
                      <div className="text-field">
                        <label htmlFor="email" style={{ display: 'flex' }}>E-mail:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="off"
                          placeholder="tu@ejemplo.com"
                          required
                        />
                        <div className="error-message">Formato incorrecto de e-mail.</div>
                      </div>
                      <button type="submit">Enviar</button>
                    </form>

                  </div>
                </Modal>
              </div>

            </div>
          </div>
          <button className="my-form__button" type="submit">
            Ingresar
          </button>
        </form>
      </main>
    </div>
  )
}

export default LoginNegocio


/*<div>
      <Toaster />
      <div className={styles.containerForm}>
        <div className={styles.formInfo}>
          <div>
            <h2>Iniciar sesión</h2>
            <form className={styles.form}>
              <label>
                <input required type="text" placeholder="Correo electrónico" id="emailLogin"
                  onChange={(e) => { setEmail(e.target.value) }} />
              </label>
              <label>
                <input required type="password" placeholder="Contraseña" id="contraseñaLogin"
                  onChange={(e) => { setContraseña(e.target.value) }} />
              </label>
              <input type="button" onClick={handleIniciarSesionNegocio} />
            </form>
          </div>
        </div>
      </div>
    </div>*/

/*<div className="my-form__actions">
            <div className="my-form__row">
              <span>¿No tienes cuenta? <a href="#" title="Create account" onClick={openModalC}>
                Crea una ahora
              </a></span>
              <div>
                <Modal
                  isOpen={modalIsOpenC}
                  onRequestClose={closeModalC}
                  id='modal-pass-forget'
                  style={{
                    content: {
                      top: '50%',
                      left: '50%',
                      right: 'auto',
                      bottom: 'auto',
                      marginRight: '-50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 200px black'
                    },
                  }}
                  shouldCloseOnOverlayClick={false}
                >
                  <div className="modal-content">
                    <button className="close-button" onClick={closeModalC}><a href=""><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nO3ZTQqDMBAF4HeKPOkV2+MWbE9jKXUhRcQk8xeZt3Il8xFNZgiQyWQyV8odwORdBH41fGtpygPAAmB2xkxrDctaU3UKgOf6gjeAG+zDTQ2vnho8MZRCeGIojfDAUAthiaE2wgJjhtDEmCM0MG4ISYw7QgITBtGDCYdowYRF1GDCI85ghkEcYYZD7M0Q899zhEGteWWGW4lttp+T53DWlUt8Wtz5sSOMzVU52p2GwfDEFhsew4pzIiyGDYddOAw7TuwwGAq0He4YCvZObhgqNIDmGCp2sWYYi1a8aGMs54mihfEYioo0xnOyK1KYCONpkcBc5urtMpehmUwmg3D5AAklyc9YEtl/AAAAAElFTkSuQmCC" /></a></button>
                    <h2>Crear cuenta</h2>
                    <p>Por favor, completa los siguientes campos para crear una nueva cuenta:</p>
                    <form className="password-reset-form">
                      <div className="text-field">
                        <label htmlFor="email" style={{ display: 'flex' }}>E-mail:</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autoComplete="off"
                          placeholder="tu@ejemplo.com"
                          required
                        />
                        <div className="error-message">Formato incorrecto de e-mail.</div>
                      </div>
                      <div className="text-field">
                        <label htmlFor="password" style={{ display: 'flex' }}>Contraseña:</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Tu contraseña"
                          pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                          title="Mínimo 6 caracteres. Al menos 1 letra y 1 número."
                          required
                        />
                        <div className="error-message">Mínimo 6 caracteres. Al menos 1 letra y 1 número.</div>
                      </div>
                      <div className="text-field">
                        <label htmlFor="phone" style={{ display: 'flex' }}>Número de Teléfono:</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Tu número de teléfono"
                          pattern="[0-9]{10}"
                          title="Por favor, ingresa un número de teléfono válido (10 dígitos)."
                          required
                        />
                        <div className="error-message">Por favor, ingresa un número de teléfono válido (10 dígitos).</div>
                      </div>
                      <div className="text-field">
                        <label htmlFor="address" style={{ display: 'flex' }}>Domicilio:</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="Tu domicilio"
                          required
                        />
                        <div className="error-message">Por favor, ingresa tu domicilio.</div>
                      </div>
                      <div className="text-field">
                        <label htmlFor="birthdate" style={{ display: 'flex' }}>Fecha de Nacimiento:</label>
                        <input
                          type="date"
                          id="birthdate"
                          name="birthdate"
                          required
                        />
                        <div className="error-message">Por favor, ingresa tu fecha de nacimiento.</div>
                      </div>
                      <button type="submit">Crear cuenta</button>
                    </form>

                  </div>
                </Modal>
              </div>
            </div>
          </div>*/
