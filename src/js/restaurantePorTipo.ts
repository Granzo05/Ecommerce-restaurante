export function cargarGrids(tipoComida: string) {
  return fetch('http://localhost:8080/restaurante/' + tipoComida)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
      }
      return response.json();
    });
}

export function getRestaurante(id: number) {
  return fetch('http://localhost:8080/restaurante/id/' + id)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error al obtener datos (${response.status}): ${response.statusText}`);
      }
      return response.json();
    });
}
