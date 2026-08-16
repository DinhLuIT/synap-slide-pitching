const slides = document.querySelectorAll('.slide');
const progressBar = document.getElementById('progressBar');
const slideCounter = document.getElementById('slideCounter');
const totalSlides = slides.length;
let current = 0;

function goTo(index) {
    if (index < 0 || index >= totalSlides) return;

    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === index) {
            slide.classList.add('active');
        } else if (i < index) {
            slide.classList.add('prev');
        }
    });

    current = index;

    // Update progress bar
    const progress = totalSlides > 1 ? (current / (totalSlides - 1)) * 100 : 100;
    progressBar.style.width = `${progress}%`;

    // Update counter
    slideCounter.textContent = `${current + 1} / ${totalSlides}`;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown':
            e.preventDefault();
            goTo(current + 1);
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            goTo(current - 1);
            break;
        case 'Home':
            e.preventDefault();
            goTo(0);
            break;
        case 'End':
            e.preventDefault();
            goTo(totalSlides - 1);
            break;
    }
});

// Click navigation: right half = next, left half = prev
document.addEventListener('click', (e) => {
    // Avoid triggering when clicking on interactive elements inside slides if any
    const x = e.clientX;
    if (x > window.innerWidth / 2) {
        goTo(current + 1);
    } else {
        goTo(current - 1);
    }
});

// Touch/swipe support
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
        goTo(dx < 0 ? current + 1 : current - 1);
    }
}, { passive: true });

// Dynamic Scaling for Responsiveness
function updateScale() {
    // Standard presentation size: 1280x720
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;
    
    const scaleWidth = availableWidth / 1280;
    const scaleHeight = availableHeight / 720;
    
    // Scale by whichever is smaller so it always fits perfectly in viewport
    const scale = Math.min(scaleWidth, scaleHeight) * 0.95; // 0.95 adds a little breathing room
    
    document.documentElement.style.setProperty('--scale-factor', scale);
}
window.addEventListener('resize', updateScale);
updateScale(); // Initial call

// Init
goTo(0);

// Custom Cursor Logic
const customCursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
    if (!customCursor) return;
    const x = e.clientX;
    const y = e.clientY;
    
    // Show cursor when mouse moves
    customCursor.style.opacity = '1';
    
    // Move cursor to pointer position
    customCursor.style.transform = `translate(${x}px, ${y}px)`;
    
    // Update arrow direction based on screen half
    if (x < window.innerWidth / 2) {
        customCursor.innerHTML = '←';
    } else {
        customCursor.innerHTML = '→';
    }
});
