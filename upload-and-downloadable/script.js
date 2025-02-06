// Undo and Redo functionality
let historyStack = [];
let redoStack = [];

function saveState() {
  const canvas = document.querySelector('.canvas');
  historyStack.push(canvas.innerHTML);
  redoStack = []; // Clear redo history when a new change is made
}

function undo() {
  if (historyStack.length > 0) {
    const canvas = document.querySelector('.canvas');
    redoStack.push(canvas.innerHTML);
    canvas.innerHTML = historyStack.pop();
    reattachDragListeners();
  }
}

function redo() {
  if (redoStack.length > 0) {
    const canvas = document.querySelector('.canvas');
    historyStack.push(canvas.innerHTML);
    canvas.innerHTML = redoStack.pop();
    reattachDragListeners();
  }
}

function reattachDragListeners() {
  document.querySelectorAll('.canvas .draggable').forEach(element => {
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
      draggedElement = e.target;
      const rect = draggedElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    });
  });
}
document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);
document.querySelector('.canvas').addEventListener('drop', (e) => {
  saveState(); // Save state before adding new element
});
document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('draggable') && e.target.parentElement.classList.contains('canvas')) {
    saveState(); // Save state before deleting
  }
});
document.querySelector('.canvas').addEventListener('click', (e) => {
  if (e.target.classList.contains('draggable')) {
    saveState(); // Save state before modifying
  }
});

// Zoom functionality
let zoomLevel = 1;
const zoomStep = 0.1;
const maxZoom = 2;
const minZoom = 0.5;

document.getElementById('zoomIn').addEventListener('click', () => {
  if (zoomLevel < maxZoom) {
    zoomLevel += zoomStep;
    updateCanvasZoom();
  }
});

document.getElementById('zoomOut').addEventListener('click', () => {
  if (zoomLevel > minZoom) {
    zoomLevel -= zoomStep;
    updateCanvasZoom();
  }
});

function updateCanvasZoom() {
  const canvas = document.getElementById('canvas');
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = 'top left'; // Ensures zooming happens from the top-left corner
}



let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let elementCounter = 0;
let selectedElement = null;
// Handle drag start
document.addEventListener('dragstart', (e) => {
  draggedElement = e.target;
  const rect = draggedElement.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});
// Handle drag over
document.querySelector('.canvas').addEventListener('dragover', (e) => {
  e.preventDefault();
});
// Handle drop
document.querySelector('.canvas').addEventListener('drop', (e) => {
  e.preventDefault();
  const canvas = document.querySelector('.canvas');
  const canvasRect = canvas.getBoundingClientRect();
  // Create new element if dragged from sidebar
  if (draggedElement.parentElement.className === 'sidebar') {
    const type = draggedElement.dataset.type;
    const newElement = document.createElement('div');
    elementCounter++;
    if (type === 'button') {
      newElement.className = 'draggable button';
      newElement.innerHTML = 'Button ' + elementCounter;
    } else {
      newElement.className = 'draggable';
      newElement.innerHTML = 'Text Block ' + elementCounter;
    }
    newElement.draggable = true;
    newElement.dataset.type = type;
    canvas.appendChild(newElement);
    draggedElement = newElement;
  }
  // Position the element
  const x = e.clientX - canvasRect.left - offsetX;
  const y = e.clientY - canvasRect.top - offsetY;
  draggedElement.style.left = x + 'px';
  draggedElement.style.top = y + 'px';
});
// Context menu handling
document.addEventListener('contextmenu', (e) => {
  if (e.target.classList.contains('draggable') && e.target.parentElement.classList.contains('canvas')) {
    e.preventDefault();
    selectedElement = e.target;
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = e.pageX + 'px';
    menu.style.top = e.pageY + 'px';
  }
});
document.addEventListener('click', (e) => {
  const menu = document.getElementById('contextMenu');
  menu.style.display = 'none';
});

function editElement() {
  if (selectedElement) {
    const newText = prompt('Enter new text:', selectedElement.innerText);
    if (newText) {
      selectedElement.innerText = newText;
    }
  }
}

function deleteElement() {
  if (selectedElement) {
    selectedElement.remove();
  }
}
// Load HTML file
document.getElementById('loadFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Create a temporary container to parse the HTML
      const temp = document.createElement('div');
      temp.innerHTML = e.target.result;
      // Clear current canvas
      const canvas = document.querySelector('.canvas');
      canvas.innerHTML = '';
      // Find all components in the loaded HTML
      const components = temp.querySelectorAll('.component');
      components.forEach(comp => {
        const newElement = document.createElement('div');
        newElement.className = `draggable${comp.classList.contains('button') ? ' button' : ''}`;
        newElement.draggable = true;
        newElement.innerHTML = comp.innerHTML;
        newElement.dataset.type = comp.classList.contains('button') ? 'button' : 'text';
        // Extract and apply position
        const style = comp.getAttribute('style');
        const leftMatch = style.match(/left: ([^;]+);/);
        const topMatch = style.match(/top: ([^;]+);/);
        if (leftMatch && topMatch) {
          newElement.style.left = leftMatch[1];
          newElement.style.top = topMatch[1];
        }
        canvas.appendChild(newElement);
      });
    };
    reader.readAsText(file);
  }
});
// Export function
function exportHTML() {
  const canvas = document.querySelector('.canvas');
  const components = canvas.getElementsByClassName('draggable');
  let exportedHTML = `
          <!DOCTYPE html>
          <html>
              <head>
                  <style>
.component { position: absolute; }
.button {
background: #3b82f6;
color: white;
border: none;
padding: 8px 16px;
border-radius: 4px;
}
</style>
              </head>
              <body>`;
  Array.from(components).forEach(comp => {
    const style = `left: ${comp.style.left}; top: ${comp.style.top};`;
    const className = `component ${comp.dataset.type === 'button' ? 'button' : ''}`;
    exportedHTML += `\n  
                  <div class="${className}" style="${style}">${comp.innerHTML}</div>`;
  });
  exportedHTML += '\n < /body>\n < /html>';
  // Create and download the file
  const blob = new Blob([exportedHTML], {
    type: 'text/html'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'website.html';
  a.click();
  URL.revokeObjectURL(url);
}

