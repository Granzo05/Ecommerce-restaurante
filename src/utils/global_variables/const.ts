export const URL_API = 'http://localhost:8080/';

export let sucursalId: number | null = null;

const usuarioString = localStorage.getItem('usuario');

if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    sucursalId = usuario.id;
}

