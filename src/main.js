const textInput = document.getElementById('textInput');
const submitButton = document.getElementById('submitButton');
const textDisplay = document.getElementById('textDisplay');

submitButton.addEventListener('click', () => {
  textDisplay.innerHTML = '';

  const text = textInput.value;

  const characters = text.split('');

  characters.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');

    textDisplay.appendChild(span);
  });

  textInput.value = '';
});
