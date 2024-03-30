import { Cliente } from '../types/Cliente'
import { URL_API } from '../utils/global_variables/const';

export const ClienteService = {
    createUser: async (nombre: string, apellido: string, email: string, contraseña: string, telefono: number, domicilio: string) => {
        const cliente = {} as Cliente;

        cliente.nombre = `${nombre} ${apellido}`;
        cliente.email = email;
        cliente.contraseña = contraseña;
        cliente.telefono = telefono;
        cliente.domicilio = domicilio;

        fetch(URL_API + 'cliente/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })
            .then(async response => {
                if (!response.ok) {
                    throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`)
                }
                return await response.json()
            })
            .then(data => {
                let cliente = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email,
                    telefono: data.telefono
                }
                localStorage.setItem('cliente', JSON.stringify(cliente));
                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    getUser: async (email: string, contraseña: string) => {
        const cliente = {} as Cliente;

        cliente.email = email;
        cliente.contraseña = contraseña;

        fetch(URL_API + 'cliente/login/' + cliente.email + '/' + cliente.contraseña, {
            method: 'GET',
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
                console.log(data)
                let cliente = {
                    id: data.id,
                    nombre: data.nombre,
                    email: data.email
                }
                localStorage.setItem('cliente', JSON.stringify(cliente));

                // Redirige al usuario al menú principal
                window.location.href = '/'
            })
            .catch(error => {
                console.error('Error:', error)
            })
    },

    updateUser: async (cliente: Cliente): Promise<string> => {
        const response = await fetch(URL_API + 'cliente/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })

        return await response.text();

    },

    deleteUser: async (cliente: Cliente): Promise<string> => {
        const response = await fetch(URL_API + 'cliente/delete', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        })

        return await response.text();

    },
}