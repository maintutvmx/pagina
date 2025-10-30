// --- Código para el Menú Hamburguesa ---
const hamburger = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.main-nav');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    navMenu.classList.toggle('nav-active');
});

const navLinks = document.querySelectorAll('.main-nav a');

function closeMenu() {
    hamburger.classList.remove('is-active');
    navMenu.classList.remove('nav-active');
}

navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// --- Lógica para Modales ---
const modalTriggers = document.querySelectorAll('.modal-trigger');
const modalCloses = document.querySelectorAll('.modal-close');
const modals = document.querySelectorAll('.modal');

modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const targetId = trigger.dataset.target;
        const modal = document.getElementById(targetId);
        modal.classList.add('is-open');
    });
});

modalCloses.forEach(closeButton => {
    closeButton.addEventListener('click', () => {
        closeButton.closest('.modal').classList.remove('is-open');
    });
});

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
        }
    });
});

// --- Lógica para Animación de Scroll (Intersection Observer) ---
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
};

const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

fadeElements.forEach(el => {
    scrollObserver.observe(el);
});

// --- Lógica para Acordeón de FAQ ---
const faqToggles = document.querySelectorAll('.faq-toggle');

faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('is-active');
        const content = toggle.nextElementSibling;
        content.classList.toggle('is-open');
    });
});

/* ============================================== */
/* === Lógica para Carrusel de Logos (CON LOOP) ===== */
/* ============================================== */

const track = document.querySelector('.logo-carousel-track');
const items = Array.from(track.children);
const nextButton = document.querySelector('.carousel-next');
const prevButton = document.querySelector('.carousel-prev');

// Recalculate itemWidth dynamically
let itemWidth = items.length > 0 ? items[0].getBoundingClientRect().width : 225; // Default width if no items initially
let visibleItems = calculateVisibleItems(); // Calculate initially
let currentPosition = 0; // Posición actual del track (translateX)

// Function to calculate how many items are visible
function calculateVisibleItems() {
    const containerWidth = document.querySelector('.logo-carousel-container').offsetWidth;
    // Update itemWidth in case it changed due to resize
    itemWidth = items.length > 0 ? items[0].getBoundingClientRect().width : 225;
    if (itemWidth === 0) return 4; // Avoid division by zero
    return Math.max(1, Math.floor(containerWidth / itemWidth)); // Ensure at least 1 is visible
}

// --- Event Listener para el botón Siguiente ---
nextButton.addEventListener('click', () => {
    // Recalculate in case of resize
    visibleItems = calculateVisibleItems(); 
    // Calculate the position of the *last* fully visible item group start
    const maxPosition = -(track.scrollWidth - (itemWidth * visibleItems)); 
    
    // If we can still move right without going past the end
    if (currentPosition > maxPosition) {
        currentPosition -= itemWidth; // Move one item to the left
    } else {
        // Loop: If we are at or past the end, jump back to the beginning
        currentPosition = 0; 
    }
    
    // Apply the new position
    track.style.transform = `translateX(${currentPosition}px)`;
});

// --- Event Listener para el botón Anterior ---
prevButton.addEventListener('click', () => {
     // Recalculate in case of resize
    visibleItems = calculateVisibleItems();
    const maxPosition = -(track.scrollWidth - (itemWidth * visibleItems)); 

    // If we are not at the beginning
    if (currentPosition < 0) {
        currentPosition += itemWidth; // Move one item to the right
    } else {
        // Loop: If we are at the beginning, jump to the end
        currentPosition = maxPosition; 
    }

    // Apply the new position
    track.style.transform = `translateX(${currentPosition}px)`;
});

// --- Reiniciar la posición y recalcular si la ventana cambia de tamaño ---
window.addEventListener('resize', () => {
    visibleItems = calculateVisibleItems(); // Recalculate visible items count
    
    // Recalculate itemWidth after resize might have changed it
    itemWidth = items.length > 0 ? items[0].getBoundingClientRect().width : 225;
    
    // Reset position to avoid visual glitches or being stuck out of bounds
    currentPosition = 0;
    track.style.transform = `translateX(0px)`;
});