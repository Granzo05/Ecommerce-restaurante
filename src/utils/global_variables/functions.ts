import { EnumMedida } from "../../types/Ingredientes/EnumMedida";

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
  console.log(medida)
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