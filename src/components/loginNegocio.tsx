import React, { useState, ChangeEvent } from 'react'
import styles from '../assets/styleLogin.module.css'


interface FormData {
  nombre: string;
  email: string;
  contraseña: string;
  domicilio: string;
  telefono: string;
  privilegios: string;
  imagen: File | null;
  tipoDeComida: string[];
}

const LoginNegocio = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    contraseña: '',
    domicilio: '',
    telefono: '',
    privilegios: '',
    imagen: null,
    tipoDeComida: []
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tipoDeComida: checked
        ? [...prevData.tipoDeComida, name]
        : prevData.tipoDeComida.filter((tipo) => tipo !== name)
    }));
  };

  function cargarNegocio() {

    const formDataToSend = new FormData();
    if (formData.nombre) formDataToSend.append('nombre', formData.nombre);
    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.contraseña) formDataToSend.append('contraseña', formData.contraseña);
    if (formData.domicilio) formDataToSend.append('domicilio', formData.domicilio);
    if (formData.telefono) formDataToSend.append('telefono', formData.telefono);
    if (formData.imagen && formData.imagen instanceof FileList && formData.imagen.length > 0) {
      formDataToSend.append('file', formData.imagen[0]);
    } if (formData.tipoDeComida) formDataToSend.append('tipoDeComida', formData.tipoDeComida.join(' '));
    formDataToSend.append('privilegios', 'negocio');

    const checkboxes = document.getElementsByClassName('checkboxs')
    let tipoComida = ''

    Array.from(checkboxes).forEach(checkbox => {
      if (checkbox instanceof HTMLInputElement && checkbox.checked) {
        tipoComida += checkbox.value + ' ';
      }
    });

    if (formData.tipoDeComida) formDataToSend.append('tipoDeComida', tipoComida);

    if (formData.privilegios) formDataToSend.append('privilegios', 'negocio');

    // Creamos el restaurante en la db
    fetch('http://localhost:8080/restaurante', {
      method: 'POST',
      body: formDataToSend
    })
      .then(async response => {
        if (!response.ok) {
          // MOSTRAR CARTEL DE QUE HUBO ALGUN ERROR
          throw new Error('Restaurante existente')
        }
        return await response.json() // Parsea la respuesta JSON para obtener el ID del cliente
      })
      // Con la respuesta de la db la enviamos al server.js y creamos el html para la pagina del negocio
      .then(data => {
        const datosAEnviar = {
          id: data.id,
          nombre: data.nombre
        }

        console.log(JSON.stringify(datosAEnviar))
        fetch('http://localhost:3000/crear-pagina/' + data.id, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datosAEnviar)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al crear la página')
            }
            // Si la pagina se creo bien terminamos de asignar la url al negocio

            // Asigna el ID del negocio a la cookie
            document.cookie = `usuario=${data.id}; privilegio=${data.privilegios}; expires=Sun, 31 Dec 2033 12:00:00 UTC; path=/`

            const url = `http://localhost:3000/restaurante/id/${data.id}`

            // Ahora actualizamos ese restaurante asignandole la url propia
            fetch('http://localhost:8080/restaurante/' + data.id, {
              method: 'POST',
              body: url
            })
              .then(response => {
                // abre la pagina del negocio
                if (response) {
                  window.location.href = url;
                }
              })
          })
          .catch(error => {
            console.error('Error:', error)
          })
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  function iniciarSesionNegocio() {
    const formDataToSend = new FormData();

    if (formData.email) formDataToSend.append('email', formData.email);
    if (formData.contraseña) formDataToSend.append('contraseña', formData.contraseña);
    if (formData.privilegios) formDataToSend.append('privilegios', formData.privilegios);

    // Validaciones aca

    fetch('http://localhost:8080/restaurante/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Usuario existente')
        }
        return await response.json()
      })
      .then(data => {
        // Asigna el ID del cliente a la cookie
        document.cookie = `usuario=${data.id}; privilegio=${data.privilegios}; expires=Sun, 31 Dec 2033 12:00:00 UTC; path=/`

        // Redirige al usuario al menú principal
        window.location.href = 'mainNegocio.html'
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  return (
    <div>
      <div className={styles.containerForm}>
        <div className={styles.info}>
          <div className={styles.infoChilds}>
            <h2>¡Bienvenido!</h2>
            <p>Si ya posees una cuenta, por favor, inicia sesión con tus datos</p>
            <input type="button" value="Iniciar sesión" id="iniciarSesionDatos" />
          </div>
        </div>
        <div className={styles.formInfo}>
          <div>
            <h2>Crear una cuenta</h2>
            <div>
              <form>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del negocio"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                />
                <input
                  type="password"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  placeholder="Contraseña"
                />
                <input
                  type="text"
                  name="domicilio"
                  value={formData.domicilio}
                  onChange={handleChange}
                  placeholder="Domicilio"
                />
                <input
                  type="number"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Telefono"
                />
                <label>
                  <input
                    type="checkbox"
                    name="panchos"
                    checked={formData.tipoDeComida.includes('panchos')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="sanguches"
                    checked={formData.tipoDeComida.includes('sanguches')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="vegetariano"
                    checked={formData.tipoDeComida.includes('vegetariano')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="pastas"
                    checked={formData.tipoDeComida.includes('pastas')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="parrilla"
                    checked={formData.tipoDeComida.includes('parrilla')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="lomos"
                    checked={formData.tipoDeComida.includes('lomos')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="sushi"
                    checked={formData.tipoDeComida.includes('sushi')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="helado"
                    checked={formData.tipoDeComida.includes('helado')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="empanadas"
                    checked={formData.tipoDeComida.includes('empanadas')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="hamburguesa"
                    checked={formData.tipoDeComida.includes('hamburguesa')}
                    onChange={handleCheckboxChange}
                  />
                  Pizza
                </label>
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="pizza" />Pizza
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="hamburguesa" />Hamburguesas
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="empanadas" />Empanadas
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="helado" />Helado
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="sushi" />Sushi
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="lomos" />Lomos
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="parrilla" />Parrilla
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="pastas" />Pastas
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="vegetariano" />Vegetariano
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="sanguches" />Sanguches
                <input type="checkbox" className={styles.tipoComidaCheckbox} value="panchos" />Panchos
                <input
                  type="file"
                  name="imagen"
                  onChange={handleChange}
                  accept="image/*"
                />
                <button type="submit" onClick={cargarNegocio}>Registrarse</button>
              </form>
            </div>
          </div>
        </div>
        <div className={styles.containerForm}>
          <div className={styles.info}>
            <div className={styles.infoChilds}>
              <h2>¡Bienvenido!</h2>
              <p>Si no posees una cuenta de negocio, por favor, registrate aquí</p>
              <input type="button" value="Registrarse" id="registrarDatos" />
            </div>
          </div>
          <div className={styles.formInfo}>
            <div>
              <h2>Iniciar sesión</h2>
              <form className={styles.form}>
                <label>
                  <input type="text" placeholder="Correo electrónico" id="emailLogin" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prevData => ({ ...prevData, email: e.target.value }))} />
                </label>
                <label>
                  <input type="password" placeholder="Contraseña" id="contraseñaLogin" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prevData => ({ ...prevData, contraseña: e.target.value }))} />
                </label>
                <input type="button" value="Iniciar sesión" id="iniciarSesion" onClick={iniciarSesionNegocio} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginNegocio
