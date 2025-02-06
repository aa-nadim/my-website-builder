// Undo and Redo functionality
let historyStack = [];
let redoStack = [];

function saveState() {
  const canvas = document.querySelector(".canvas");
  historyStack.push(canvas.innerHTML);
  redoStack = []; // Clear redo history when a new change is made
}

function undo() {
  if (historyStack.length > 0) {
    const canvas = document.querySelector(".canvas");
    redoStack.push(canvas.innerHTML);
    canvas.innerHTML = historyStack.pop();
    reattachDragListeners();
  }
}

function redo() {
  if (redoStack.length > 0) {
    const canvas = document.querySelector(".canvas");
    historyStack.push(canvas.innerHTML);
    canvas.innerHTML = redoStack.pop();
    reattachDragListeners();
  }
}

function reattachDragListeners() {
  document.querySelectorAll(".canvas .draggable").forEach((element) => {
    element.draggable = true;
    element.addEventListener("dragstart", (e) => {
      draggedElement = e.target;
      const rect = draggedElement.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
    });
  });
}

// Assign Undo/Redo Buttons
document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);

// Zoom functionality
let zoomLevel = 1;
const zoomStep = 0.1;
const maxZoom = 2;
const minZoom = 0.5;

document.getElementById("zoomIn").addEventListener("click", () => {
  if (zoomLevel < maxZoom) {
    zoomLevel += zoomStep;
    updateCanvasZoom();
  }
});

document.getElementById("zoomOut").addEventListener("click", () => {
  if (zoomLevel > minZoom) {
    zoomLevel -= zoomStep;
    updateCanvasZoom();
  }
});

function updateCanvasZoom() {
  const canvas = document.getElementById("canvas");
  canvas.style.transform = `scale(${zoomLevel})`;
  canvas.style.transformOrigin = "top left"; // Ensures zooming happens from the top-left corner
}

// Drag & Drop Functionality
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let elementCounter = 0;
let selectedElement = null;

// Handle drag start
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("draggable")) {
    draggedElement = e.target;
    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

// Handle drag over
document.querySelector(".canvas").addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Handle drop
document.querySelector(".canvas").addEventListener("drop", (e) => {
  e.preventDefault();
  const canvas = document.querySelector(".canvas");
  const canvasRect = canvas.getBoundingClientRect();

  if (draggedElement.parentElement.classList.contains("sidebar") || draggedElement.parentElement.id === "sidebarModal") {
    const type = draggedElement.dataset.type;
    const newElement = document.createElement("div");
    elementCounter++;

    if (type === "button") {
      newElement.className = "draggable button bg-blue-500 text-white px-4 py-2 rounded-md cursor-move";
      newElement.innerHTML = "Button " + elementCounter;
    } else if (type === "text") {
      newElement.className = "draggable p-2 bg-gray-200 rounded-md cursor-move";
      newElement.innerHTML = "Text Block " + elementCounter;
    } else if (type === "card") {
      newElement.className = "draggable cursor-move";
      newElement.innerHTML = `
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
          <a href="#">
            <img class="rounded-t-lg" src="https://via.placeholder.com/300" alt="Placeholder Image" />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">Noteworthy technology acquisitions 2021</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700">Here are the biggest enterprise technology acquisitions of 2021 so far.</p>
            <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800">
                Read more
                <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
            </a>
          </div>
        </div>
      `;
    }

    newElement.draggable = true;
    newElement.dataset.type = type;
    canvas.appendChild(newElement);
    draggedElement = newElement;
    saveState(); // Save state after adding new element
  }

  // Position the element
  const x = e.clientX - canvasRect.left - offsetX;
  const y = e.clientY - canvasRect.top - offsetY;
  draggedElement.style.position = "absolute";
  draggedElement.style.left = x + "px";
  draggedElement.style.top = y + "px";
});

// Context menu handling
document.addEventListener("contextmenu", (e) => {
  if (e.target.classList.contains("draggable") && e.target.parentElement.classList.contains("canvas")) {
    e.preventDefault();
    selectedElement = e.target;
    const menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
    saveState(); // Save state before deleting
  }
});

document.addEventListener("click", () => {
  document.getElementById("contextMenu").style.display = "none";
});

function editElement() {
  if (selectedElement) {
    const newText = prompt("Enter new text:", selectedElement.innerText);
    if (newText) {
      selectedElement.innerText = newText;
    }
  }
}

function deleteElement() {
  if (selectedElement) {
    selectedElement.remove();
    saveState(); // Save state after deleting
  }
}
