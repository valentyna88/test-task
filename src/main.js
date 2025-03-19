let isSelecting = false;
let startX = 0,
  startY = 0;
let selectionBox = null;

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

textDisplay.addEventListener('mousedown', e => {
  isSelecting = true;
  startX = e.clientX;
  startY = e.clientY;

  selectionBox = document.createElement('div');
  selectionBox.classList.add('selection-box');
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;

  document.body.appendChild(selectionBox);
});

document.addEventListener('mousemove', e => {
  if (!isSelecting || !selectionBox) return;

  const currentX = e.clientX;
  const currentY = e.clientY;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;

  selectionBox.style.left = `${Math.min(startX, currentX)}px`;
  selectionBox.style.top = `${Math.min(startY, currentY)}px`;
});

document.addEventListener('mouseup', () => {
  if (!isSelecting || !selectionBox) return;

  const boxRect = selectionBox.getBoundingClientRect();
  document.querySelectorAll('.char').forEach(span => {
    const charRect = span.getBoundingClientRect();
    if (
      charRect.left < boxRect.right &&
      charRect.right > boxRect.left &&
      charRect.top < boxRect.bottom &&
      charRect.bottom > boxRect.top
    ) {
      span.style.color = getRandomColor();
    }
  });

  selectionBox.remove();
  selectionBox = null;
  isSelecting = false;
});
