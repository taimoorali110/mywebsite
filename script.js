// Add smooth scrolling, menu toggle, contact form validation, and small UI polish
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const id = href.substring(1);
            const target = document.getElementById(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({behavior:'smooth', block:'start'});
                // close mobile nav if open
                document.querySelector('.site-nav')?.classList.remove('active');
            }
        });
    });

    // Menu toggle (mobile)
    const menuToggle = document.getElementById('menu-toggle');
    const siteNav = document.querySelector('.site-nav');
    if (menuToggle && siteNav) {
        menuToggle.addEventListener('click', () => siteNav.classList.toggle('active'));
    }

    // Set current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Animate elements into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, {threshold:0.08});
    document.querySelectorAll('.fade-in, .card').forEach(el => observer.observe(el));

    // Header shrink on scroll and scrollspy
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-center a');
    const sections = Array.from(navLinks).map(l => document.getElementById(l.getAttribute('href').substring(1))).filter(Boolean);

    function onScroll() {
        const y = window.scrollY || window.pageYOffset;
        if (header) header.classList.toggle('scrolled', y > 24);

        // simple scrollspy: highlight link when section top near viewport
        sections.forEach((sec, i) => {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= 120 && rect.bottom > 120) {
                navLinks.forEach(a => a.classList.remove('active'));
                navLinks[i].classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();

    // Contact form handling — EmailJS integration with Formsubmit fallback
    // To use EmailJS: sign up at https://www.emailjs.com, create a service and template,
    // then set the IDs below (or replace with your own config storage).
    const EMAILJS_CONFIG = {
        serviceID: '', // e.g. 'service_xxx'
        templateID: '', // e.g. 'template_xxx'
        userID: '' // e.g. 'user_xxx'
    };

    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (window.emailjs && EMAILJS_CONFIG.userID) {
        try { emailjs.init(EMAILJS_CONFIG.userID); } catch (e) { console.warn('EmailJS init failed', e); }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = (document.getElementById('name')?.value || '').trim();
            const email = (document.getElementById('email')?.value || '').trim();
            const message = (document.getElementById('message')?.value || '').trim();
            if (!name || !email || !message) {
                if (status) status.textContent = 'Please fill all fields.';
                return;
            }
            if (!validateEmail(email)) {
                if (status) status.textContent = 'Please enter a valid email address.';
                return;
            }

            // Prefer EmailJS if configured
            if (EMAILJS_CONFIG.serviceID && EMAILJS_CONFIG.templateID && EMAILJS_CONFIG.userID && window.emailjs) {
                if (status) status.textContent = 'Sending...';
                emailjs.sendForm(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, contactForm)
                    .then(() => {
                        if (status) status.textContent = 'Thank you — message sent.';
                        contactForm.reset();
                        setTimeout(() => { if (status) status.textContent = ''; }, 4000);
                    }, (err) => {
                        console.error('EmailJS error', err);
                        if (status) status.textContent = 'Sending failed — try again later.';
                    });
                return;
            }

            // Fallback: POST to Formsubmit (note: Formsubmit requires verification on first use)
            if (status) status.textContent = 'Sending...';
            const formData = new FormData(contactForm);
            formData.append('_subject', 'Portfolio contact — new message');
            fetch('https://formsubmit.co/taimoorr2002@gmail.com', {method:'POST', body: formData})
                .then(resp => {
                    if (resp.ok) {
                        if (status) status.textContent = 'Thank you — message sent (or verification email sent).';
                        contactForm.reset();
                    } else {
                        if (status) status.textContent = 'Submission blocked; try verifying Formsubmit or set up EmailJS.';
                    }
                    setTimeout(() => { if (status) status.textContent = ''; }, 5000);
                }).catch(err => {
                    console.error('Form submit error', err);
                    if (status) status.textContent = 'Submission failed; try again later.';
                });
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }
});