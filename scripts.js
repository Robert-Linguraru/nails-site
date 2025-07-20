// 1. Scroll Function for Header (already exists)
// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  const header = document.getElementById("navbar"); // This ID is on the <nav> element now
  const logo = document.getElementById("logo").querySelector('img'); // Target the img inside the logo div

  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    header.style.padding = "10px 20px"; // Adjust header padding for smaller state
    logo.style.height = "50px"; // Adjust logo image height for smaller state
  } else {
    header.style.padding = "20px"; // Original header padding
    logo.style.height = "80px"; // Original logo image height
  }
}

// 2. Scroll Animation Function (newly added)
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
    }, 
  );

    // Select all elements that should have the scroll animation
    // These elements should initially have the 'hidden' class in your HTML
    const hiddenElements = document.querySelectorAll('section, .gallery img');

    // Observe each of the selected elements
    hiddenElements.forEach((el) => observer.observe(el));
}


// 3. DOMContentLoaded Listener (existing, with added call to initScrollAnimations)
// This ensures that all elements are available before the scripts try to find them.
document.addEventListener('DOMContentLoaded', function() {

    // Call the new scroll animation function here
    initScrollAnimations();
});
