document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Handle Google Sheets form submission
    const posseForm = document.getElementById('posse-form');
    const formMessage = document.getElementById('form-message');
    
    if (posseForm) {
        posseForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = posseForm.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;
            
            const formData = new FormData(posseForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                timestamp: new Date().toISOString()
            };
            
            // Replace this URL with your Google Apps Script web app URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbwaViF7MdopXiyYbn2y4-gbddX7nEIVoys37I7MHrGOZU17_hydDXhg3-vLPeVkzneW/exec';
            
            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'no-cors'
            })
            .then(response => {
                formMessage.textContent = 'Welcome to the Posse! Thanks for joining.';
                formMessage.style.display = 'block';
                formMessage.style.color = 'var(--accent-gold)';
                posseForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.textContent = 'Thanks for signing up! Your submission has been recorded.';
                formMessage.style.display = 'block';
                formMessage.style.color = 'var(--accent-gold)';
                posseForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Intersection Observer for scroll-reveal animations
    const revealSelectors = [
        '.card-type',
        '.setup-step',
        '.turn-step',
        '.combat-step',
        '.death-step',
        '.location-card',
        '.slinger-card',
        '.attribute-card',
        '.blog-post',
        '.formula-step',
        '.movement-rule',
        '.win-condition',
        '.tie-condition',
        '.round-step',
        '.component',
        '.legend-objective',
        '.damage-calculation',
        '.turn-notes'
    ];

    const revealElements = document.querySelectorAll(revealSelectors.join(','));
    revealElements.forEach((el, idx) => {
        el.classList.add('reveal');
        // Stagger items within the same grid for a cascade effect
        el.style.transitionDelay = `${Math.min(idx % 6, 5) * 60}ms`;
    });

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Equalize slinger card heights to the tallest one
    function equalizeSlingerCards() {
        const cards = document.querySelectorAll('.slinger-card');
        if (cards.length === 0) return;
        cards.forEach(c => { c.style.height = 'auto'; });
        // Force layout, then measure
        const maxHeight = Math.max(...Array.from(cards).map(c => c.offsetHeight));
        cards.forEach(c => { c.style.height = `${maxHeight}px`; });
    }

    if (document.readyState === 'complete') {
        equalizeSlingerCards();
    } else {
        window.addEventListener('load', equalizeSlingerCards);
    }

    let equalizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(equalizeTimeout);
        equalizeTimeout = setTimeout(equalizeSlingerCards, 150);
    });

    // Countdown Timer for Kickstarter Launch
    function updateCountdown() {
        // Use ISO format for better cross-browser compatibility
        const launchDate = new Date('2026-10-17T00:00:00').getTime();
        const now = new Date().getTime();
        const distance = launchDate - now;

        const countdownBanner = document.querySelector('.countdown-banner');
        if (!countdownBanner) return;

        if (distance < 0) {
            countdownBanner.innerHTML =
                '<div class="countdown-content"><h3 class="countdown-title">Kickstarter is Now Live</h3></div>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
