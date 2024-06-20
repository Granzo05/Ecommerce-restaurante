export function clearInputs() {
  let inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    input.value = '';
  });

  let selects = document.querySelectorAll('select');

  selects.forEach(select => {
    select.value = '';
  });
}


export const formatearFechaDDMMYYYY = (date: Date) => {
  const dia = date.getDate() - 1;
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;

  if (año.toString().length === 4) {
    return `${diaFormateado}-${mesFormateado}-${año}`;
  }
};

export const formatearFechaYYYYMMDD = (date: Date) => {
  const dia = date.getDate() - 1;
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;

  if (año.toString().length === 4) {
    return `${año}-${mesFormateado}-${diaFormateado}`;
  }
};

export const formatearFechaYYYYMMDDHHMM = (date: Date) => {
  const dia = date.getDate() - 1;
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  const añoFormateado = año < 10 ? `0${año}` : año;
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  if (añoFormateado.toString.length === 4) {
    return `${año}/${mesFormateado}/${diaFormateado}T${horas}:${minutos}`;
  }
};