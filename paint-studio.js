const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');
const brushSizeInput = document.getElementById('brushSize');
const brushShapeSelect = document.getElementById('brushShape');

let painting = false;
let brushSize = parseInt(brushSizeInput.value, 10);
let brushShape = brushShapeSelect.value;

// Start drawing
canvas.addEventListener('mousedown', () => {
    painting = true;
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
});

// Draw on the canvas
canvas.addEventListener('mousemove', (event) => {
    if (painting) {
        draw(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
});

// Draw function
function draw(x, y) {
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';

    if (brushShape === 'square') {
        ctx.lineCap = 'butt';
    } else if (brushShape === 'star') {
        // Star shape requires custom drawing logic
        // For simplicity, use round for now
        ctx.lineCap = 'round';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Update brush size
brushSizeInput.addEventListener('input', () => {
    brushSize = parseInt(brushSizeInput.value, 10);
});

// Update brush shape
brushShapeSelect.addEventListener('change', () => {
    brushShape = brushShapeSelect.value;
});

// Clear canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save art
saveButton.addEventListener('click', () => {
    const artData = canvas.toDataURL();
    const saveCode = btoa(artData); // Base64 encode the data URL
    console.log('Save Code:', saveCode); // Debugging
    prompt('Copy this save code to save your art:', saveCode);
});

// Load art
loadButton.addEventListener('click', () => {
    const saveCode = prompt('Enter your save code:');
    if (saveCode) {
        try {
            const artData = atob(saveCode); // Base64 decode the save code
            const img = new Image();
            img.src = artData;
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            img.onerror = () => {
                alert('Failed to load image. The save code might be invalid.');
            };
        } catch (error) {
            console.error('Error decoding save code:', error);
            alert('Invalid save code. Please check the code and try again.');
        }
    }
});
