import { Stock } from "../types";

let idRestaurante = 0;

export function buscarStock(id: number) {
    idRestaurante = id;
    fetch('http://localhost:8080/restaurante/id/' + idRestaurante + "/stock/", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            let contenedorPrincipal = document.getElementById("stock");

            data.forEach((stock: Stock) => {
                let contenedor = document.createElement("div");
                contenedor.className = "grid-item";

                let ingredienteNombre = document.createElement("h3");
                ingredienteNombre.textContent = stock.ingrediente.nombre;
                contenedor.appendChild(ingredienteNombre);

                let ingredienteCantidad = document.createElement("h3");
                ingredienteCantidad.textContent = stock.cantidad + stock.medida;
                contenedor.appendChild(ingredienteCantidad);

                let fechaLlegadaStockNuevo = document.createElement("h3");
                fechaLlegadaStockNuevo.textContent = stock.fechaLlegada.toLocaleString();
                contenedor.appendChild(fechaLlegadaStockNuevo);

                if (contenedorPrincipal) contenedorPrincipal.appendChild(contenedor);
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function agregarStock() {

    const nombreIngrediente = document.getElementById('nombreIngredienteAñadir') as HTMLSelectElement | null;
    const cantidadIngrediente = document.getElementById('cantidadIngredienteAñadir') as HTMLInputElement | null;
    const medidaIngrediente = document.getElementById('medidaIngredienteAñadir') as HTMLSelectElement | null;
    const costoIngrediente = document.getElementById('costoIngredienteAñadir') as HTMLInputElement | null;

    let datosIngrediente: string[] = completarIngredientes(nombreIngrediente, cantidadIngrediente, medidaIngrediente, costoIngrediente);

    fetch('http://localhost:8080/restaurante/id/' + idRestaurante + '/stock/carga', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosIngrediente)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            // AVISAR QUE FUE AÑADIDO CON EXITO

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function actualizarStock() {
    const nombreIngrediente = document.getElementById('select-nombre-ingrediente-actualizar') as HTMLSelectElement | null;
    const cantidadIngrediente = document.getElementById('cantidadIngredienteActualizar') as HTMLInputElement | null;
    const medidaIngrediente = document.getElementById('medidaIngredienteActualizar') as HTMLSelectElement | null;
    const costoIngrediente = document.getElementById('costoIngredienteActualizar') as HTMLInputElement | null;

    let datosIngrediente: string[] = completarIngredientes(nombreIngrediente, cantidadIngrediente, medidaIngrediente, costoIngrediente);

    fetch('http://localhost:8080/restaurante/id/' + idRestaurante + '/stock/update/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosIngrediente)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            // AVISAR QUE FUE EDITADO

        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function completarIngredientes(
    nombreIngrediente: HTMLSelectElement | null,
    cantidadIngrediente: HTMLInputElement | null,
    medidaIngrediente: HTMLSelectElement | null,
    costoIngrediente: HTMLInputElement | null
): string[] {
    const datos: string[] = [];

    if (nombreIngrediente && cantidadIngrediente && medidaIngrediente && costoIngrediente) {
        datos.push(nombreIngrediente.value);
        datos.push(cantidadIngrediente.value);
        datos.push(medidaIngrediente.value);
        datos.push(costoIngrediente.value);
    }

    return datos;
}

export function eliminarStock() {
    const nombreIngrediente = document.getElementById('select-nombre-ingrediente-actualizar') as HTMLSelectElement | null;

    fetch('http://localhost:8080/restaurante/id/' + idRestaurante + '/stock/delete/' + nombreIngrediente, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
            }
            // AVISAR QUE FUE BORRADO
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export function abrirModalAñadir() {

}

export function cerrarModalAñadir() {

}

export function abrirModalEditar() {

}

export function cerrarModalEditar() {

}

export function abrirModalBorrar() {

}

export function cerrarModalBorrar() {

}