import { Cliente } from "../../types/Cliente/Cliente";
import { Empleado } from "../../types/Restaurante/Empleado";
import { Empresa } from "../../types/Restaurante/Empresa";
import { Sucursal } from "../../types/Restaurante/Sucursal";

export const URL_API = 'http://localhost:8080/';

export const DESACTIVAR_PRIVILEGIOS = false; // false hay privilegios, true no hay privilegios

export function mostrarFecha(fecha: Date) {
    // Obtener los componentes de la fecha
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    // Formatear la fecha y hora
    return `${dia}-${mes}-${año} - ${horas}:${minutos} `;
}

export function convertirFecha(fecha: Date) {
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();

    // Verificar si el día es el último día del mes
    let ultimoDiaMes = new Date(año, mes, 0).getDate();

    // Si el día actual es el último día del mes, ajustar el día a 1
    if (año.toString().length === 4) {
        if (dia === ultimoDiaMes) {
            // Asegurarse de que el mes siguiente sea válido (evitar que sea 13)
            const siguienteMes = mes === 12 ? 1 : mes + 1;
            return `${año}-${siguienteMes < 10 ? '0' + siguienteMes : siguienteMes}-01`;
        } else {
            const diaFormateado = dia < 10 ? `0${dia}` : dia;
            const mesFormateado = mes < 10 ? `0${mes}` : mes;
            return `${año}-${mesFormateado}-${diaFormateado}`;
        }
    }
}


export function sucursalId(): number {
    const usuarioString = localStorage.getItem('usuario');
    const empleadoString = localStorage.getItem('empleado');
    const sucursalString = localStorage.getItem('sucursal');
    const empresaString = localStorage.getItem('empresa');

    if (usuarioString) {
        const usuario: Cliente = JSON.parse(usuarioString);

        if (usuario.idSucursal > 0 && usuario.idSucursal !== undefined) {
            return usuario.idSucursal;
        }
    } else if (empleadoString) {
        if (empleadoString) {
            const empleado: Empleado = JSON.parse(empleadoString);

            if (empleado && empleado.sucursales && empleado.sucursales[0]?.id > 0 && empleado.sucursales[0]?.id !== undefined) {
                return empleado.sucursales[0]?.id;
            }
        }
    } else if (sucursalString) {
        const sucursal: Sucursal = JSON.parse(sucursalString);

        if (sucursal && sucursal.id && sucursal.id !== undefined && sucursal.id > 0) {
            return sucursal.id;
        }
    } else if (empresaString) {
        const empresa: Empresa = JSON.parse(empresaString);

        if (empresa && empresa.id && empresa.id !== undefined && empresa.id > 0) {
            return empresa.id;
        }
    }

    return 0;
}

export function empresaId(): number {

    const empresaString = localStorage.getItem('empresa');

    if (empresaString) {
        const empresa: Empresa = JSON.parse(empresaString);

        if (empresa && empresa.id && empresa.id !== undefined && empresa.id > 0) {
            return empresa.id;
        }
    }

    return 0;
}

export function getBaseUrl(): string {
    const idSucursal = sucursalId();

    return `${window.location.protocol}//${window.location.host}/${idSucursal}`;
}

export function getBaseUrlCliente(): string {
    return `${window.location.protocol}//${window.location.host}`;
}

export function limpiarCredenciales() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('empleado');
    localStorage.removeItem('sucursal');
    localStorage.removeItem('empresa');
}

// Frases del login del restaurante

export const frases = [
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