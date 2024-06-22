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
  const dia = date.getDate() + 1;
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

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
};

export const formatearFechaYYYYMMDD = (date: Date | undefined) => {
  if (date) {
    const dia = date.getDate() + 1;
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();

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
};


export const formatearFechaYYYYMMDDHHMM = (date: Date) => {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

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
      return `${año}-${mesFormateado}-${diaFormateado}:${horas}:${minutos}`;
    }
  }
};

export const formatearFechaDDMMYYYYHHMMPromociones = (date: Date) => {
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  const añoFormateado = año;

  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  return `las ${horas}:${minutos} del ${diaFormateado}/${mesFormateado}/${añoFormateado}`;
};