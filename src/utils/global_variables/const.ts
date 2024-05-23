export const URL_API = 'http://localhost:8080/';

export let sucursalId: number | null = 1;

const usuarioString = localStorage.getItem('usuario');

if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    sucursalId = usuario.id;
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