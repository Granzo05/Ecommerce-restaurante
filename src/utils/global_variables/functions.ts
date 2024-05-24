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