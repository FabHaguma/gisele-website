document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('mobile-menu');
    const mainNav = document.getElementById('main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked (if it's not a submenu toggle)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('open')) {
                    // Check if it's a link that navigates, not a submenu trigger
                    if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
                         mainNav.classList.remove('open');
                         menuToggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // Active Nav Link Highlighting based on current page URL
    const currentPage = window.location.pathname.split("/").pop() || 'index.html';
    const navAnchors = document.querySelectorAll('#main-nav ul li a');

    navAnchors.forEach(link => {
        const linkPage = link.getAttribute('href').split("/").pop() || 'index.html';
        if (linkPage === currentPage) {
            // For homepage, if there are section links, ensure only the main "Home" is active
            if (currentPage === 'index.html' && link.getAttribute('href').includes('#')) {
                // Check if it's the root index.html link
                if (link.getAttribute('href') === 'index.html') {
                    link.classList.add('active-nav');
                } else {
                    link.classList.remove('active-nav');
                }
            } else {
                link.classList.add('active-nav');
            }
        } else {
            link.classList.remove('active-nav');
        }
    });
    // Special case: if on index.html and no specific section is targeted by nav, mark "Home" active
    if (currentPage === 'index.html' && !window.location.hash) {
        const homeLink = document.querySelector('#main-nav a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active-nav');
    }


    // Section Fade-in Animation on Scroll (for sections on the homepage)
    const sections = document.querySelectorAll('section:not(.hero-section)'); // Exclude hero from fade-in
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: stop observing once visible
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Contact Form (Homepage) - Basic Frontend Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = contactForm.querySelector('#name');
            const name = nameInput ? nameInput.value : 'Friend';

            formMessage.textContent = `Thank you, ${name}! Your message has been "sent". (This is a demo.)`;
            formMessage.style.color = 'var(--primary-blue)';
            contactForm.reset();

            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }

    // Update Copyright Year
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});