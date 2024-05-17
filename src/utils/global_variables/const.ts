export const URL_API = 'http://localhost:8080/';

export let sucursalId: number | null = 1;

const usuarioString = localStorage.getItem('usuario');

if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    sucursalId = usuario.id;
}

