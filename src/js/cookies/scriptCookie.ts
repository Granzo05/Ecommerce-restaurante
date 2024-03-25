// En caso que requiera privilegios la pagina deberia llamara a esta funcion como verificarCookies(true), si es una pagina donde puede ingresar el cliente deberia llamarla
// como verificarCookies();

export function verificarCookies(privilegioNecesario = false) {
    function getCookie(cookieName: String) {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === cookieName) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    // Verificar la cookie de usuario y privilegio
    const id = getCookie('id');
    const privilegio = getCookie('privilegio');
    const email = getCookie('email');

    if (!id) {
        // El usuario no está autenticado
        window.location.href = 'login/loginCliente.html';
        return;
    }

    if (privilegioNecesario && privilegio !== 'negocio') {
        // El usuario no tiene el tipo de privilegio adecuado
        window.location.href = 'accesoDenegado.html';
    }
}


