import { Restaurante } from '../types/Restaurante';
import { URL_API } from '../utils/global_variables/const';

export const UserService = {
    createRestaurant: async (nombre: string, email: string, contraseña: string, domicilio: string, telefono: number) => {
        const restaurante = {} as Restaurante;

        restaurante.nombre = nombre;
        restaurante.email = email;
        restaurante.contraseña = contraseña;
        restaurante.telefono = telefono;
        restaurante.domicilio = domicilio;

        // Creamos el restaurante en la db
        fetch('http://localhost:8080/restaurant/create', {
            method: 'POST',
            body: JSON.stringify(restaurante)
        })
            .then(async response => {
                if (!response.ok) {
                    // MOSTRAR CARTEL DE QUE HUBO ALGUN ERROR
                    throw new Error('Restaurante existente')
                }
                return await response.json()
            })
            .then(data => {
                let cliente = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono
                }
                localStorage.setItem('cliente', JSON.stringify(cliente));

                // Redirige al usuario al menú principal
                window.location.href = 'mainNegocio.html'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getRestaurant: async (email: string, contraseña: string) => {
        const restaurante = {} as Restaurante;

        restaurante.email = email;
        restaurante.contraseña = contraseña;

        fetch('http://localhost:8080/restaurant/login/' + restaurante.email + '/' + restaurante.contraseña, {
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
                let cliente = {
                    id: data.id,
                    email: data.email,
                    telefono: data.telefono
                }
                localStorage.setItem('cliente', JSON.stringify(cliente));

                // Redirige al usuario al menú principal
                window.location.href = 'mainNegocio.html'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    updateRestaurant: async (restaurante: Restaurante): Promise<string> => {
        const response = await fetch(URL_API + 'restaurant/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(restaurante)
        })

        const data = await response.json();

        return data;
    },
    
}