// scripts.js

// 1. Scroll Function for Header
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {
    scrollFunction();
    adjustNavMenuPosition(); // Call this on scroll to adjust for header height changes
};

function scrollFunction() {
    const header = document.getElementById("mainHeader"); // Correctly target the main header
    const logo = document.getElementById("logo").querySelector('img'); // Target the img inside the logo div

    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        header.style.padding = "10px 20px"; // Adjust header padding for smaller state
        logo.style.height = "50px"; // Adjust logo image height for smaller state
    } else {
        header.style.padding = "20px"; // Original header padding
        logo.style.height = "80px"; // Original logo image height
    }
}

// New function: Dynamically adjust the mobile navigation menu's top position
function adjustNavMenuPosition() {
    const header = document.getElementById("mainHeader"); // CHANGED: Get the actual header element
    const navMenu = document.querySelector(".navbar ul");

    // Only apply this logic if the screen is considered mobile (same as your media query breakpoint)
    if (window.innerWidth <= 768 && header && navMenu) { // Added null checks
        // Get the current computed height of the header
        const headerHeight = header.offsetHeight;
        navMenu.style.top = `${headerHeight}px`;
    } else if (navMenu) { // Only reset if navMenu exists
        // On desktop, reset the 'top' style to allow CSS rules to take over,
        // or ensure it doesn't interfere with desktop layout.
        navMenu.style.top = ''; // Clears the inline style set by JS
    }
}

// Select the hamburger menu and the navigation list
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navbar ul");

// Listen for a click on the hamburger menu
if (hamburger && navMenu) { // Ensure elements exist before adding listeners
    hamburger.addEventListener("click", () => {
        // Toggle the 'active' class on the hamburger icon
        hamburger.classList.toggle("active");
        // Toggle the 'active' class on the navigation menu
        navMenu.classList.toggle("active");

        // Important: When opening/closing, ensure the top is correctly set
        adjustNavMenuPosition(); // Call this immediately after toggle
    });

    // Optional: Close the menu when a link is clicked
    document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        adjustNavMenuPosition(); // Call this when closing
    }));
}

// 2. Scroll Animation Function
/**
 * Initializes scroll animations for elements with the 'hidden' class.
 * When an element with 'hidden' class enters the viewport,
 * the 'show' class is added, triggering a CSS transition.
 */
function initScrollAnimations() {
    // Create a new IntersectionObserver instance
    const observer = new IntersectionObserver((entries) => {
        // Iterate over each entry (each observed element)
        entries.forEach((entry) => {
            // If the element is currently intersecting (visible in the viewport)
            if (entry.isIntersecting) {
                // Add the 'show' class to trigger the animation
                entry.target.classList.add('show');
                // Optional: Stop observing the element once it's shown
                // This prevents the animation from re-triggering if it scrolls out and back in
                observer.unobserve(entry.target);
            }
        });
    }, );

    // Select all elements that should have the scroll animation
    // These elements should initially have the 'hidden' class in your HTML
    const hiddenElements = document.querySelectorAll('section, .gallery img');

    // Observe each of the selected elements
    hiddenElements.forEach((el) => observer.observe(el));
}


// 3. DOMContentLoaded Listener (existing, with added calls)
// This ensures that all elements are available before the scripts try to find them.
document.addEventListener('DOMContentLoaded', function() {
    // Call the new scroll animation function here
    initScrollAnimations();
    // Also call adjustNavMenuPosition on load to set the initial correct position
    adjustNavMenuPosition();

// --- Lightbox Functionality ---
    // --- Lightbox Functionality ---
    const galleryImages = document.querySelectorAll('.gallery img');
    let currentImageIndex = 0;
    let imagesArray = []; // To store only the *non-blurred* gallery image sources for navigation

    // Create lightbox elements if they don't exist
    let lightboxOverlay = document.getElementById('lightbox-overlay');
    if (!lightboxOverlay) {
        lightboxOverlay = document.createElement('div');
        lightboxOverlay.id = 'lightbox-overlay';
        lightboxOverlay.classList.add('lightbox-overlay');
        lightboxOverlay.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Full size image" class="lightbox-image">
                <span class="lightbox-close">&times;</span>
                <span class="lightbox-nav lightbox-prev">&lsaquo;</span>
                <span class="lightbox-nav lightbox-next">&rsaquo;</span>
            </div>
        `;
        document.body.appendChild(lightboxOverlay);
    }

    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');
    const lightboxPrev = lightboxOverlay.querySelector('.lightbox-prev');
    const lightboxNext = lightboxOverlay.querySelector('.lightbox-next');

    // Populate imagesArray and add click listeners to *non-blurred* gallery images
    galleryImages.forEach((img) => {
        if (!img.classList.contains('blurred-preview')) { // ONLY add non-blurred images to the lightbox array
            imagesArray.push(img.getAttribute('data-full-src') || img.src);
            img.addEventListener('click', () => {
                // Find the index of the clicked image within the imagesArray (non-blurred ones)
                currentImageIndex = imagesArray.indexOf(img.getAttribute('data-full-src') || img.src);
                openLightbox(imagesArray[currentImageIndex]);
            });
        }
    });

    // Function to open the lightbox
    function openLightbox(src) {
        lightboxImage.src = src;
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
    }

    // Function to close the lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);

    lightboxPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : imagesArray.length - 1;
        lightboxImage.src = imagesArray[currentImageIndex];
    });

    lightboxNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex < imagesArray.length - 1) ? currentImageIndex + 1 : 0;
        lightboxImage.src = imagesArray[currentImageIndex];
    });

    // Close lightbox on overlay click (but not on content click)
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });

// Add an event listener for window resize to re-adjust the nav menu position
// in case the user resizes the browser window across the mobile/desktop breakpoint.
window.addEventListener('resize', adjustNavMenuPosition)
  })