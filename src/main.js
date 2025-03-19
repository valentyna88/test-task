const textInput = document.getElementById('textInput');
const submitButton = document.getElementById('submitButton');
const textDisplay = document.getElementById('textDisplay');

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

let isControlPressed = false;

document.addEventListener('keydown', e => {
  if (e.key === 'Control' || e.key === 'Meta') {
    isControlPressed = true;
  }
});

document.addEventListener('keyup', e => {
  if (e.key === 'Control' || e.key === 'Meta') {
    isControlPressed = false;
  }
});

submitButton.addEventListener('click', () => {
  textDisplay.innerHTML = '';

  const text = textInput.value;

  const characters = text.split('');

  characters.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.classList.add('char');

    span.addEventListener('click', () => {
      if (isControlPressed) {
        span.style.color = getRandomColor();
      }
    });

    textDisplay.appendChild(span);
  });

  textInput.value = '';
});
