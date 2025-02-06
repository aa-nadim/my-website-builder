let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let elementCounter = 0;
let selectedElement = null;

// Save states for Undo/Redo
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

// Function to reattach drag listeners after undo/redo
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

// Handle Drag Start
document.addEventListener("dragstart", (e) => {
  if (e.target.classList.contains("draggable")) {
    draggedElement = e.target;
    const rect = draggedElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  }
});

// Handle Drag Over
document.querySelector(".canvas").addEventListener("dragover", (e) => {
  e.preventDefault();
});

// Handle Drop
document.querySelector(".canvas").addEventListener("drop", (e) => {
  e.preventDefault();
  const canvas = document.querySelector(".canvas");
  const canvasRect = canvas.getBoundingClientRect();

  // Check if dragged element is from sidebar
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
      newElement.className = "draggable card relative cursor-move p-4 bg-white border border-gray-300 rounded-lg shadow-md";
      newElement.innerHTML = `
        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm relative p-5">
          <a href="#">
            <img class="rounded-t-lg w-full" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAwwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADEQAQACAQIDBwIDCQAAAAAAAAABAgMEESExUQUSIjJBYXEjUhMUwRUzYoGRoaKx0f/EABcBAQEBAQAAAAAAAAAAAAAAAAABAgP/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APoIDo5gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9232z/QGAAAAAAAAAAAAAAAAAAAAASdHpLam2/lxxzt/wABqw4cme/dx13n/SywdmY67Tmnvz0jhCZixUw0imOu1Ye2dakeaY6Y42x0rX4jZ73YEV4yYseSPqUrb5hEzdmYr7zimaT05wnAKDUaXNp/PXw/dHGGl0s8Y2nkr9X2bW299P4bfZ6T8NSs2KoZtE0tNbRMTHOJFRgAAABmtbXtFaxMzPpEMLzQaeuHBWdvHaN7T+iWrIq/yOp23/Bnb5homJrMxaJiY5xLpEPtPT1yYZyxHjpG+/WDVxTAKyAAA94cVs2WuOnOf7A26PTW1OTblSPNK8pSuOkUpG1Y5Q84MVcGKMdOUevV7ZtakAEUAAAAAA2iecQwyA5oBtgAAdDp7xkwUvXlNXPJGk1l9NO0R3qTzrKWLKvWjXXimkyzPrXux/NG/auPb91ffpwQdVqsmptE34VjlWPRJFtaAGmQABd9n6b8vi3tH1Lc/b2Q+y9N37/jXjw1nw+8rZm1qQARQAAAAAAAAAFVbsrJHky1n5jZFzaXPh43xzt1jjC/F1Mc0LvUaDDm3msdy/WsfoqtRpsunttkrw9LRyldTGkBUAAAAG3TYbZ80Y6+vOekNS80Gm/L4vFH1Lcbe3slqyJFKVx0ilI2rEbQyDLQAAAAAAAAAAAAAAxatb1mt4iazziWQFRrOz7Yt74d7U9Y9YQXSq/XaCL75MEbW9a9fhZUsVQTG07TwkaZAS9Bo51Fu/eNsUf5ewN3Zel70xnyRwjyR191oREREREbRHKBhuAAAAAAAAAAAAAAAAAAAAIur0VNR4qz3MnXr8oE9m6iJ2iKz7xZci6mK7T9mRExbPaLfw15LGIiIiIiIiOUQCKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//Z" alt="Placeholder Image" />
          </a>
          <div class="p-5">
            <a href="#">
              <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">Noteworthy technology acquisitions 2021</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700">Here are the biggest enterprise technology acquisitions of 2021 so far.</p>
            <div class="card-content relative w-full h-auto min-h-[50px]"></div>
          </div>
        </div>
      `;
    }

    newElement.draggable = true;
    newElement.dataset.type = type;
    canvas.appendChild(newElement);
    draggedElement = newElement;
    saveState();
  }

  // Position the element
  const x = e.clientX - canvasRect.left - offsetX;
  const y = e.clientY - canvasRect.top - offsetY;
  draggedElement.style.position = "absolute";
  draggedElement.style.left = x + "px";
  draggedElement.style.top = y + "px";
});

// Handle Drag Over Inside Card
document.addEventListener("dragover", (e) => {
  if (e.target.classList.contains("card-content")) {
    e.preventDefault();
  }
});

// Handle Drop Inside Card
document.addEventListener("drop", (e) => {
  if (e.target.classList.contains("card-content")) {
    e.preventDefault();
    const cardContent = e.target;
    
    if (draggedElement.dataset.type === "button") {
      const newButton = document.createElement("div");
      newButton.className = "draggable button bg-blue-500 text-white px-4 py-2 rounded-md cursor-move";
      newButton.innerHTML = "Button " + elementCounter;
      newButton.draggable = true;
      newButton.dataset.type = "button";

      cardContent.appendChild(newButton);
      draggedElement = newButton;

      saveState();
    }
  }
});

// Prevent Button from Leaving Card
document.addEventListener("dragend", (e) => {
  if (e.target.dataset.type === "button" && e.target.parentElement.classList.contains("card-content")) {
    const cardRect = e.target.parentElement.getBoundingClientRect();
    const buttonRect = e.target.getBoundingClientRect();

    if (buttonRect.left < cardRect.left || buttonRect.right > cardRect.right || buttonRect.top < cardRect.top || buttonRect.bottom > cardRect.bottom) {
      e.target.style.left = "0px";
      e.target.style.top = "0px";
    }
  }
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
    saveState();
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
    saveState();
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