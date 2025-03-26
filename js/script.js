/**
 * AlumVidrio Website Scripts
 * This file contains all the JavaScript functionality for the website
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initCarousel();
    initScrollAnimation();
    initContactForm();
    initHeaderScroll();
});

/**
 * Mobile Menu Functionality
 * Handles the toggle of mobile navigation
 */
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on links
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = menuButton.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
}

/**
 * Image Carousel Functionality
 * Handles the automatic and manual slide transitions
 */
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    
    if (carousel) {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.carousel-button.prev');
        const nextBtn = document.querySelector('.carousel-button.next');
        const indicators = document.querySelectorAll('.carousel-indicators .indicator');
        
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        let interval;
        
        // Function to show a specific slide
        function showSlide(index) {
            // Remove active class from all slides
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            // Add active class to current slide
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
            
            currentIndex = index;
        }
        
        // Function to show next slide
        function nextSlide() {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex);
        }
        
        // Function to show previous slide
        function prevSlide() {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            showSlide(prevIndex);
        }
        
        // Set up automatic slide transitions
        function startInterval() {
            interval = setInterval(nextSlide, 5000);
        }
        
        // Add event listeners for controls
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                prevSlide();
                // Reset the interval when manually changing slides
                clearInterval(interval);
                startInterval();
            });
            
            nextBtn.addEventListener('click', function() {
                nextSlide();
                // Reset the interval when manually changing slides
                clearInterval(interval);
                startInterval();
            });
        }
        
        // Add event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showSlide(index);
                // Reset the interval when manually changing slides
                clearInterval(interval);
                startInterval();
            });
        });
        
        // Start the carousel
        startInterval();
        
        // Pause carousel on mouse enter
        carousel.addEventListener('mouseenter', function() {
            clearInterval(interval);
        });
        
        // Resume carousel on mouse leave
        carousel.addEventListener('mouseleave', function() {
            startInterval();
        });
    }
}

/**
 * Scroll Animation
 * Adds animations to elements when they come into view
 */
function initScrollAnimation() {
    // Get all elements that should be animated
    const elements = document.querySelectorAll('.section-title, .featured-item, .mission-box, .vision-box, .benefit-card, .process-step');
    
    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add the animation class if the element is visible
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Stop observing after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when at least 10% of the element is visible
    });
    
    // Observe each element
    elements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Contact Form Handling
 * Validates and processes form submissions
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic form validation
            if (validateForm(this)) {
                // In a real application, you would send the form data to a backend service here
                // For this example, we'll just show a success message
                
                // Create a success message
                const successMessage = document.createElement('div');
                successMessage.className = 'alert success mt-2';
                successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Su mensaje ha sido enviado con éxito. Nos pondremos en contacto con usted pronto.';
                
                // Insert the success message after the form
                contactForm.insertAdjacentElement('afterend', successMessage);
                
                // Reset the form
                contactForm.reset();
                
                // Remove the success message after 5 seconds
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
}

/**
 * Form Validation Helper
 * Validates form fields and shows error messages
 */
function validateForm(form) {
    let isValid = true;
    const errorMessages = form.querySelectorAll('.error-message');
    
    // Remove any existing error messages
    errorMessages.forEach(message => message.remove());
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showError(field, 'Este campo es obligatorio');
            isValid = false;
        }
    });
    
    // Validate email field
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
            showError(emailField, 'Por favor, ingrese un correo electrónico válido');
            isValid = false;
        }
    }
    
    // Validate phone field
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value.trim()) {
        const phonePattern = /^[0-9\s\-\+\(\)]{8,15}$/;
        if (!phonePattern.test(phoneField.value)) {
            showError(phoneField, 'Por favor, ingrese un número de teléfono válido');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Show Error Message Helper
 * Displays an error message below a form field
 */
function showError(field, message) {
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = 'var(--error)';
    errorElement.style.fontSize = 'var(--font-sm)';
    errorElement.style.marginTop = '5px';
    errorElement.textContent = message;
    
    // Insert error message after the field
    field.parentNode.appendChild(errorElement);
    
    // Highlight the field
    field.style.borderColor = 'var(--error)';
    
    // Remove error styling when field is focused
    field.addEventListener('focus', function() {
        this.style.borderColor = '';
        if (errorElement.parentNode) {
            errorElement.parentNode.removeChild(errorElement);
        }
    });
}

/**
 * Header Scroll Effect
 * Changes header appearance on scroll
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.height = '60px';
                header.style.boxShadow = 'var(--shadow)';
            } else {
                header.style.height = '80px';
                header.style.boxShadow = 'var(--shadow-sm)';
            }
        });
    }
}
