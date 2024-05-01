import { EnumMedida } from "../../types/Ingredientes/EnumMedida";
import { EnumTipoArticuloComida } from "../../types/Productos/EnumTipoArticuloComida";

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


export function stringToEnumTipoComida(valor: string): EnumTipoArticuloComida | null {
  switch (valor) {
    case 'PIZZAS':
      return EnumTipoArticuloComida.PIZZAS;
    case 'HAMBURGUESAS':
      return EnumTipoArticuloComida.HAMBURGUESAS;
    case 'PASTAS':
      return EnumTipoArticuloComida.PASTAS;
    default:
      return null;
  }
}

export function stringToEnumMedidas(valor: string): EnumMedida | null {
  switch (valor) {
    case 'CENTIMETROS_CUBICOS':
      return EnumMedida.CENTIMETROS_CUBICOS;
    case 'GRAMOS':
      return EnumMedida.GRAMOS;
    case 'KILOGRAMOS':
      return EnumMedida.KILOGRAMOS;
    case 'LITROS':
      return EnumMedida.LITROS;
    case 'PAQUETES':
      return EnumMedida.PAQUETES;
    case 'UNIDADES':
      return EnumMedida.UNIDADES;
    default:
      return null;
  }
}