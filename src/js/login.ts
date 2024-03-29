import { Restaurant } from "../types/Restaurant";
import { User } from "../types/User";

export function cargarUsuario(nombre: string, apellido: string, email: string, contraseña: string, telefono: number, domicilio: string) {

    const user = {} as User;

    user.name = `${nombre} ${apellido}`;
    user.email = email;
    user.password = contraseña;
    user.phone = telefono;
    user.address = domicilio;

    fetch('http://localhost:8080/user/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
            }
            return await response.json()
        })
        .then(data => {
            let user = {
                id: data.id,
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                telefono: data.telefono
            }
            localStorage.setItem('user', JSON.stringify(user));
            // Redirige al usuario al menú principal
            window.location.href = '/'
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

export function iniciarSesion(email: string, contraseña: string) {
    const user = {} as User;

    user.email = email;
    user.password = contraseña;

    // Validaciones aca

    fetch('http://localhost:8080/client/login/' + user.email + '/' + user.password, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
            }
            return await response.json()
        })
        .then(data => {
            let user = {
                id: data.id,
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email
            }
            localStorage.setItem('user', JSON.stringify(user));

            // Redirige al usuario al menú principal
            window.location.href = '/'
        })
        .catch(error => {
            console.error('Error:', error)
        })
}



export function cargarNegocio(nombre: string, email: string, contraseña: string, domicilio: string, telefono: number) {

    const restaurant = {} as Restaurant;

    restaurant.name = nombre;
    restaurant.email = email;
    restaurant.password = contraseña;
    restaurant.phone = telefono;
    restaurant.address = domicilio;

    // Creamos el restaurante en la db
    fetch('http://localhost:8080/restaurant/create', {
        method: 'POST',
        body: JSON.stringify(restaurant)
    })
        .then(async response => {
            if (!response.ok) {
                // MOSTRAR CARTEL DE QUE HUBO ALGUN ERROR
                throw new Error('Restaurante existente')
            }
            return await response.json()
        })
        .then(data => {
            let user = {
                id: data.id,
                email: data.email,
                telefono: data.telefono
            }
            localStorage.setItem('user', JSON.stringify(user));

            // Redirige al usuario al menú principal
            window.location.href = 'mainNegocio.html'
        })
        .catch(error => {
            console.error('Error:', error)
        })
}

export function iniciarSesionNegocio(email: string, contraseña: string) {

    const restaurant = {} as Restaurant;

    restaurant.email = email;
    restaurant.password = contraseña;

    fetch('http://localhost:8080/restaurant/login/' + restaurant.email + '/' + restaurant.password, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(async response => {
            if (!response.ok) {
                throw new Error('Usuario existente')
            }

            return await response.json()
        })
        .then(data => {
            let user = {
                id: data.id,
                email: data.email,
                telefono: data.telefono
            }
            localStorage.setItem('user', JSON.stringify(user));

            // Redirige al usuario al menú principal
            window.location.href = 'mainNegocio.html'
        })
        .catch(error => {
            console.error('Error:', error)
        })
}