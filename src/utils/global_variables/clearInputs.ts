export function clearInputs() {
    let inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.value = '';
    });
}