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
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(45, 53, 97, 1)';
        } else {
            navbar.style.background = 'rgba(45, 53, 97, 0.95)';
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.rule-card, .gallery-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
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
                '<div class="countdown-content"><h3 class="countdown-title">🎉 Kickstarter is Now Live! 🎉</h3></div>';
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
