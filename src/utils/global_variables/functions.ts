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

export const formatearFechaReportesYYYYMMDD = (date: Date | undefined) => {
  if (date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();

    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${año}-${mesFormateado}-${diaFormateado}`;
  }
  return '';
};


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
      return `${diaFormateado}-${mesFormateado}-${año}`;
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

export const formatearFechaFinalYYYYMMDDHHMM = (date: Date) => {
  const dia = date.getDate() - 1;
  const mes = date.getMonth() + 1;
  const año = date.getFullYear();

  const horas = String(date.getHours() - 3).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');

  // Verificar si el día es el último día del mes
  let ultimoDiaMes = new Date(año, mes, 0).getDate();

  // Si el día actual es el último día del mes, ajustar el día a 1
  if (dia === ultimoDiaMes) {
    // Asegurarse de que el mes siguiente sea válido (evitar que sea 13)
    const siguienteMes = mes === 12 ? 1 : mes + 1;
    const siguienteAño = mes === 12 ? año + 1 : año;
    return `${siguienteAño}-${siguienteMes < 10 ? '0' + siguienteMes : siguienteMes}-01T${horas}:${minutos}`;
  } else {
    const diaFormateado = dia < 10 ? `0${dia}` : dia;
    const mesFormateado = mes < 10 ? `0${mes}` : mes;
    return `${año}-${mesFormateado}-${diaFormateado}T${horas}:${minutos}`;
  }
};


export const formatearFechaYYYYMMDDHHMM = (date: Date | undefined) => {
  if (date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const año = date.getFullYear();

    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');

    // Verificar si el día es el último día del mes
    let ultimoDiaMes = new Date(año, mes, 0).getDate();

    // Si el día actual es el último día del mes, ajustar el día a 1
    if (dia === ultimoDiaMes && año.toString().length === 4) {
      // Asegurarse de que el mes siguiente sea válido (evitar que sea 13)
      const siguienteMes = mes === 12 ? 1 : mes + 1;
      const siguienteAño = mes === 12 ? año + 1 : año;
      return `${siguienteAño}-${siguienteMes < 10 ? '0' + siguienteMes : siguienteMes}-01T${horas}:${minutos}`;
    } else {
      const diaFormateado = dia < 10 ? `0${dia}` : dia;
      const mesFormateado = mes < 10 ? `0${mes}` : mes;
      return `${año}-${mesFormateado}-${diaFormateado}T${horas}:${minutos}`;
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

export function parsearMonedaArgentina(value: number): string {
  return value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function desparsearMonedaArgentina(value: string): number {
  const soloNumeros = value.replace(/[^0-9,.-]+/g, '').replace('.', '').replace(',', '.');
  return parseFloat(soloNumeros);
}


export default function decodeJWT(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3) {
    throw new Error("Token incorrecto");
  }

  const header = JSON.parse(atob(parts[0]));
  const payload = JSON.parse(atob(parts[1]));

  return { header, payload }
};

