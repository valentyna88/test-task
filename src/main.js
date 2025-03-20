const textInput = document.getElementById('textInput');
const submitButton = document.getElementById('submitButton');
const textDisplay = document.getElementById('textDisplay');

let isSelecting = false;
let selectionBox = null;
let startX = 0;
let startY = 0;

submitButton.addEventListener('click', () => {
  const text = textInput.value.trim();
  textDisplay.innerHTML = '';

  text.split('').forEach(char => {
    const span = createCharacterSpan(char);
    textDisplay.appendChild(span);
  });
});

function createCharacterSpan(char) {
  const span = document.createElement('span');
  span.textContent = char;
  span.setAttribute('draggable', true);
  span.classList.add('char');

  span.addEventListener('click', handleHighlight);
  span.addEventListener('dragstart', handleDragStart);
  span.addEventListener('dragend', handleDragEnd);

  return span;
}

function handleHighlight(e) {
  if (e.ctrlKey) {
    e.target.classList.toggle('highlight');
  }
}

let draggedChars = [];
function handleDragStart(e) {
  draggedChars = getSelectedCharacters(e.target);
}

function handleDragEnd(e) {
  const mouseX = e.pageX;
  const mouseY = e.pageY;

  draggedChars.forEach((char, index) => {
    char.style.position = 'absolute';
    char.style.left = `${mouseX + index * 20}px`;
    char.style.top = `${mouseY}px`;
    document.body.appendChild(char);
    char.classList.remove('highlight');
  });

  draggedChars = [];
}

function getSelectedCharacters(span) {
  const selected = [...document.querySelectorAll('.highlight')];
  return span.classList.contains('highlight') ? selected : [span];
}

textDisplay.addEventListener('mousedown', e => {
  if (e.target === textDisplay) {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;

    selectionBox = createSelectionBox();
    document.body.appendChild(selectionBox);
  }
});

function createSelectionBox() {
  const box = document.createElement('div');
  box.classList.add('selection-box');
  box.style.left = `${startX}px`;
  box.style.top = `${startY}px`;
  return box;
}

document.addEventListener('mousemove', e => {
  if (isSelecting) {
    const currentX = e.clientX;
    const currentY = e.clientY;

    selectionBox.style.left = `${Math.min(startX, currentX)}px`;
    selectionBox.style.top = `${Math.min(startY, currentY)}px`;
    selectionBox.style.width = `${Math.abs(currentX - startX)}px`;
    selectionBox.style.height = `${Math.abs(currentY - startY)}px`;
  }
});

document.addEventListener('mouseup', e => {
  if (isSelecting) {
    isSelecting = false;

    const rect = selectionBox.getBoundingClientRect();

    document.querySelectorAll('.char').forEach(span => {
      const spanRect = span.getBoundingClientRect();
      if (isIntersecting(rect, spanRect)) {
        span.classList.add('highlight');
      }
    });

    selectionBox.remove();
    selectionBox = null;
  }
});

function isIntersecting(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}
