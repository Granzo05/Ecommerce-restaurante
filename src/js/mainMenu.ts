var primerClic = true;

export function toggleImage(divId: string) {

    const div = document.getElementById(divId);
    
    if (div && div.classList.contains("enlarged")) {
        switch (divId) {
            case "hamburguesas":
                window.location.href = '/restaurantes/hamburguesas'
                break;
            case "panchos":
                window.location.href = '/restaurantes/panchos'

                break;
            case "empanadas":
                window.location.href = '/restaurantes/empanadas'

                break;
            case "pizzas":
                window.location.href = '/restaurantes/pizzas'

                break;
            case "lomos":
                window.location.href = '/restaurantes/lomos'

                break;
            case "helado":
                window.location.href = '/restaurantes/helado'

                break;
            case "parrilla":
                window.location.href = '/restaurantes/parrilla'

                break;
            case "pastas":
                window.location.href = '/restaurantes/pastas'

                break;
            case "sushi":
                window.location.href = '/restaurantes/sushi'

                break;
            case "vegetariano":
                window.location.href = '/restaurantes/vegetariano'

                break;
            case "sanguche":
                window.location.href = '/restaurantes/sanguche'

                break;
        }
    } else if (primerClic === null && divId === "hamburguesas") {
        window.location.href = '/restaurantes/hamburguesas'
    } 
}
