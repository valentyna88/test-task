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
  span.addEventListener('dragover', e => e.preventDefault());
  span.addEventListener('drop', handleDrop);

  return span;
}

function handleHighlight(e) {
  if (e.ctrlKey) {
    e.target.classList.toggle('highlight');
  }
}

function handleDragStart(e) {
  const selectedChars = getSelectedCharacters(e.target);
  const indices = selectedChars.map(char =>
    [...textDisplay.children].indexOf(char)
  );
  e.dataTransfer.setData('text/plain', JSON.stringify(indices));
}

function getSelectedCharacters(span) {
  const selected = [...document.querySelectorAll('.highlight')];
  return span.classList.contains('highlight') ? selected : [span];
}

function handleDrop(e) {
  e.preventDefault();

  const droppedIndices = JSON.parse(e.dataTransfer.getData('text/plain'));
  const targetIndex = [...textDisplay.children].indexOf(e.target);

  if (targetIndex === -1) return;

  const spans = [...textDisplay.children];
  const draggedChars = droppedIndices.map(i => spans[i].textContent);

  droppedIndices.sort((a, b) => b - a).forEach(i => spans[i].remove());

  draggedChars.forEach((char, i) => {
    const newSpan = createCharacterSpan(char);
    if (i === 0) {
      e.target.insertAdjacentElement('beforebegin', newSpan);
    } else {
      textDisplay.insertBefore(newSpan, e.target);
    }
  });

  if (droppedIndices[0] < targetIndex) {
    const targetSpan = createCharacterSpan(e.target.textContent);
    e.target.remove();
    textDisplay.insertBefore(
      targetSpan,
      textDisplay.children[droppedIndices[0]]
    );
  }
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
  box.style.position = 'absolute';
  box.style.border = '1px dashed #000';
  box.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
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
