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

    // Handle form submission - Mailchimp handles it, just visual feedback
    const contactForm = document.querySelector('.newsletter-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Let Mailchimp handle the actual submission
            setTimeout(() => {
                alert('Welcome to the Posse! Check your email to confirm your subscription.');
            }, 500);
        });
    }

    // Handle Buttondown form submission
    const posseForm = document.querySelector('.newsletter-form');
    const formMessage = document.getElementById('form-message');
    
    if (posseForm) {
        posseForm.addEventListener('submit', function(e) {
            setTimeout(() => {
                formMessage.textContent = 'Welcome to the Posse! Check your email to confirm your subscription.';
                formMessage.style.display = 'block';
                formMessage.style.color = 'var(--accent-gold)';
            }, 500);
        });
    } else {
        console.log('Form not found!'); // Debug log
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
});
