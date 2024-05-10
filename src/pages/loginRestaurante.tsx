import { useEffect, useState } from 'react'
import '../styles/loginRestaurante.css'
import { SucursalService } from '../services/SucursalService';
import { Toaster, toast } from 'sonner'

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
            <span>¿Has olvidado tu contraseña? <a href="#" title="Reset Password">
              Reestablecela
            </a></span>
            
          </div>
        </div>
        <button className="my-form__button" type="submit">
          Ingresar
        </button>
        <div className="my-form__actions">
          <div className="my-form__row">
            <span>¿No tienes cuenta? <a href="#" title="Reset Password">
              Crea una ahora
            </a></span>
            
          </div>
        </div>
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
