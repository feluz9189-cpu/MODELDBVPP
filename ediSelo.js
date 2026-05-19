// Elements
const photoInput = document.getElementById('photoInput');
const uploadBtn = document.querySelector('.upload-btn');
const previewCanvas = document.getElementById('previewCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const previewSection = document.getElementById('previewSection');
const positionControl = document.getElementById('positionControl');
const positionBtns = document.querySelectorAll('.position-btn');

// State
let uploadedImage = null;
let sealImage = null;
let currentPosition = 'bottom-right';

// Load seal image on page load
window.addEventListener('load', () => {
    loadSealImage();
});

// File upload handler
uploadBtn.addEventListener('click', () => {
    photoInput.click();
});

photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                uploadedImage = img;
                previewSection.classList.remove('hidden');
                positionControl.classList.remove('hidden');
                renderPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Load seal image
function loadSealImage() {
    const img = new Image();
    img.onload = () => {
        sealImage = img;
    };
    img.onerror = () => {
        console.error('Failed to load seal image');
    };
    img.src = 'img/SELO.png';
}

// Position button handlers
positionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        positionBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentPosition = btn.dataset.position;
        renderPreview();
    });
});

// Render preview canvas
function renderPreview() {
    if (!uploadedImage || !sealImage) return;

    const ctx = previewCanvas.getContext('2d');
    
    // Set canvas size to match image aspect ratio
    const maxWidth = 600;
    const maxHeight = 600;
    let width = uploadedImage.width;
    let height = uploadedImage.height;
    
    if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    }
    if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }
    
    previewCanvas.width = width;
    previewCanvas.height = height;
    
    // Draw image
    ctx.drawImage(uploadedImage, 0, 0, width, height);
    
    // Calculate seal size (10% of image width, maintaining aspect ratio)
    const sealWidth = width * 0.15;
    const sealHeight = (sealImage.height * sealWidth) / sealImage.width;
    
    // Calculate position
    const padding = 15;
    let x, y;
    
    switch (currentPosition) {
        case 'bottom-left':
            x = padding;
            y = height - sealHeight - padding;
            break;
        case 'bottom-center':
            x = (width - sealWidth) / 2;
            y = height - sealHeight - padding;
            break;
        case 'bottom-right':
        default:
            x = width - sealWidth - padding;
            y = height - sealHeight - padding;
            break;
    }
    
    // Draw seal with shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.drawImage(sealImage, x, y, sealWidth, sealHeight);
    ctx.shadowColor = 'transparent';
}

// Download handler
downloadBtn.addEventListener('click', () => {
    if (!previewCanvas) return;
    
    const link = document.createElement('a');
    link.href = previewCanvas.toDataURL('image/png');
    link.download = `foto-selo-turista-consciente-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Reset handler
resetBtn.addEventListener('click', () => {
    photoInput.value = '';
    uploadedImage = null;
    previewSection.classList.add('hidden');
    positionControl.classList.add('hidden');
    previewCanvas.innerHTML = '';
    currentPosition = 'bottom-right';
    positionBtns.forEach((btn) => btn.classList.remove('active'));
    positionBtns[0].classList.add('active');
});
