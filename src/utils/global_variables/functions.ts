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


export function convertirStringAEnumMedida(medida: string) {
  switch (medida.toUpperCase()) {
    case "KILOGRAMOS":
      return EnumMedida.KILOGRAMOS;
    case "GRAMOS":
      return EnumMedida.GRAMOS;
    case "LITROS":
      return EnumMedida.LITROS;
    case "CENTIMETROS_CUBICOS":
      return EnumMedida.CENTIMETROS_CUBICOS;
    case "PAQUETES":
      return EnumMedida.PAQUETES;
    case "UNIDADES":
      return EnumMedida.UNIDADES;
    default:
      return null;
  }
}


export function convertirStringAEnumTipoComida(tipo: string) {
  switch (tipo.toUpperCase()) {
    case "HAMBURGUESAS":
      return EnumTipoArticuloComida.HAMBURGUESAS;
    case "PANCHOS":
      return EnumTipoArticuloComida.PANCHOS;
    case "EMPANADAS":
      return EnumTipoArticuloComida.EMPANADAS;
    case "PIZZAS":
      return EnumTipoArticuloComida.PIZZAS;
    case "LOMOS":
      return EnumTipoArticuloComida.LOMOS;
    case "HELADO":
      return EnumTipoArticuloComida.HELADO;
    case "PARRILLA":
      return EnumTipoArticuloComida.PARRILLA;
    case "PASTAS":
      return EnumTipoArticuloComida.PASTAS;
    case "SUSHI":
      return EnumTipoArticuloComida.SUSHI;
    case "MILANESAS":
      return EnumTipoArticuloComida.MILANESAS;
    default:
      return null;
  }
}