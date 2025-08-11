// scripts.js

// 1. Scroll Function for Header
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {
    scrollFunction();
    adjustNavMenuPosition(); // Call this on scroll to adjust for header height changes
};

function customAlert(message) {
    // Check if a modal is already open to prevent multiple modals
    if (document.getElementById('custom-alert-modal')) {
        return;
    }
    const modalHtml = `
        <div id="custom-alert-modal">
            <div class="modal-content">
                <p>${message}</p>
                <button id="close-alert-button">OK</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('close-alert-button').addEventListener('click', () => {
        document.getElementById('custom-alert-modal').remove();
    });
}

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

// 1. Hamburger Menu Functionality
function hamburgerMenu() {
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
}

// 2. Scroll Animation Function
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

function lightbox() {
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

}

function form() {

        // --- Logic for the General Inquiry Form ---
        const inquiryButton = document.getElementById('inquiryButton');
        const inquiryName = document.getElementById('inquiryName');
        const inquiryEmail = document.getElementById('inquiryEmail');
        const inquiryMessage = document.getElementById('inquiryMessage');

    // Check if form elements exist on the page
    if (inquiryButton && inquiryName && inquiryEmail && inquiryMessage) {
        // Listen for clicks on the inquiry button
        inquiryButton.addEventListener('click', (e) => {
            // Prevent the default link behavior if the form is empty
            if (!inquiryName.value || !inquiryEmail.value || !inquiryMessage.value) {
                // Now using the custom modal function
                customAlert('Vă rugăm să completați toate câmpurile.');
                return;
            }
            const subject = 'Întrebare Generală de pe site';
            const body = `De la: ${inquiryName.value}\nEmail: ${inquiryEmail.value}\n\nMesaj:\n${inquiryMessage.value}`;
            const mailtoLink = `mailto:raileanu.sabina00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            inquiryButton.href = mailtoLink;
        });
    }

        // --- Logic for the Booking Form ---
        const bookingButton = document.getElementById('bookingButton');
        const bookingName = document.getElementById('bookingName');
        const bookingTel = document.getElementById('bookingTel');
        const bookingService = document.getElementById('bookingService');
        const bookingMessage = document.getElementById('bookingMessage');

        // Listen for clicks on the booking button
        if (bookingButton && bookingName && bookingTel && bookingService && bookingMessage) {
        // Listen for clicks on the booking button
        bookingButton.addEventListener('click', (e) => {
            // Prevent the default link behavior if the form is empty
            if (!bookingName.value || !bookingTel.value || !bookingService.value || !bookingMessage.value) {
                customAlert('Vă rugăm să completați toate câmpurile.');
                return;
            }
            const subject = 'Cerere de Programare de pe site';
            const body = `De la: ${bookingName.value}\nTelefon: ${bookingTel.value}\nServiciu dorit: ${bookingService.value}\n\nDetalii Programare:\n${bookingMessage.value}`;
            const mailtoLink = `mailto:raileanu.sabina00@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            bookingButton.href = mailtoLink;
        });
    }}

function cert() {
        const certificationCards = document.querySelectorAll('.certification-card');
        const certPopup = document.getElementById('cert-popup');
        const certPopupImage = document.getElementById('cert-popup-image-content');
        const closeCertPopupButton = document.getElementById('close-cert-popup-button');

        // Check if the essential elements are found
        if (!certPopup || !certPopupImage || !closeCertPopupButton) {
            console.error('--- CRITICAL ERROR: One or more essential pop-up elements were not found in the HTML. Please ensure the full HTML file is loaded correctly. ---');
            return; // Exit the script to prevent further errors
        }

        console.log('--- SCRIPT INITIALIZED: All pop-up elements found successfully. ---');

        // Function to open the cert pop-up
        function openCertPopup(imageUrl) {
            if (imageUrl) {
                console.log('--- LOG: Attempting to open pop-up with image URL:', imageUrl);
                certPopupImage.src = imageUrl;
                certPopup.classList.add('is-visible');
            } else {
                console.error('--- ERROR: Image URL is missing from the data-full-image attribute. Cannot open pop-up.');
            }
        }

        // Function to close the cert pop-up
        function closeCertPopup() {
            console.log('--- LOG: Closing pop-up.');
            certPopup.classList.remove('is-visible');
            // Clear the image source after the transition
            setTimeout(() => {
                certPopupImage.src = '';
            }, 300);
        }

        // Add click event listener to each certification card
        certificationCards.forEach(card => {
            card.addEventListener('click', () => {
                const fullImageUrl = card.dataset.fullImage;
                openCertPopup(fullImageUrl);
            });
        });

        // Add click event listener to the close button
        closeCertPopupButton.addEventListener('click', closeCertPopup);

        // Add a click event listener to the pop-up background to close it
        certPopup.addEventListener('click', (event) => {
            if (event.target === certPopup) {
                closeCertPopup();
            }
        });
}    

function galleryLightbox() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lightboxOverlay = document.getElementById('portfolio-lightbox-overlay');
            const lightboxImage = document.querySelector('.gallery-lightbox-image');
            const closeButton = document.querySelector('.gallery-lightbox-close');
            const prevButton = document.querySelector('.gallery-lightbox-prev');
            const nextButton = document.querySelector('.gallery-lightbox-next');
            let currentImageIndex;
            const images = Array.from(galleryItems).map(item => item.querySelector('img'));

            // Function to show the lightbox with a specific image
            const showLightbox = (index) => {
                currentImageIndex = index;
                // Get the data-full-src attribute from the selected image
                const fullSrc = images[currentImageIndex].getAttribute('data-full-src');
                lightboxImage.src = fullSrc;
                lightboxImage.alt = images[currentImageIndex].alt;

                // Add an active class to trigger the CSS transition
                lightboxOverlay.style.display = 'flex';
                // Use a slight delay to ensure the display change is registered before the opacity transition starts
                setTimeout(() => {
                    lightboxOverlay.classList.add('is-active');
                }, 10);
            };

            // Function to hide the lightbox
            const hideLightbox = () => {
                lightboxOverlay.classList.remove('is-active');
                // Use a delay to allow the opacity transition to finish before hiding the element completely
                setTimeout(() => {
                    lightboxOverlay.style.display = 'none';
                }, 300);
            };

            // Function to navigate to the next image
            const showNextImage = () => {
                currentImageIndex = (currentImageIndex + 1) % images.length;
                showLightbox(currentImageIndex);
            };

            // Function to navigate to the previous image
            const showPrevImage = () => {
                currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                showLightbox(currentImageIndex);
            };

            // Add click listeners to all gallery items
            galleryItems.forEach((item, index) => {
                item.addEventListener('click', () => {
                    showLightbox(index);
                });
            });

            // Add click listeners to lightbox controls
            closeButton.addEventListener('click', hideLightbox);
            prevButton.addEventListener('click', showPrevImage);
            nextButton.addEventListener('click', showNextImage);

            // Hide lightbox when clicking on the overlay itself (not the image)
            lightboxOverlay.addEventListener('click', (e) => {
                if (e.target === lightboxOverlay) {
                    hideLightbox();
                }
            });

            // Add keyboard support for navigation and closing
            document.addEventListener('keydown', (e) => {
                if (lightboxOverlay.classList.contains('is-active')) {
                    if (e.key === 'ArrowRight') {
                        showNextImage();
                    } else if (e.key === 'ArrowLeft') {
                        showPrevImage();
                    } else if (e.key === 'Escape') {
                        hideLightbox();
                    }
                }
            });
        }




// 3. DOMContentLoaded Listener (existing, with added calls)
// This ensures that all elements are available before the scripts try to find them.
document.addEventListener('DOMContentLoaded', function(){
    initScrollAnimations();
    adjustNavMenuPosition();
    if (window.location.pathname.includes('index.html')) {
        lightbox(); // Initialize lightbox only on index.html
    }
    hamburgerMenu();
    form();
    if (window.location.pathname.includes('certifications.html')) {
        cert();
    }
    if (window.location.pathname.includes('portfolio.html')) {
        galleryLightbox(); // Initialize gallery lightbox only on portfolio.html
    }

// Add an event listener for window resize to re-adjust the nav menu position
// in case the user resizes the browser window across the mobile/desktop breakpoint.
window.addEventListener('resize', adjustNavMenuPosition)
  })