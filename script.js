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
        serviceID: 'service_qzm4b85',
        templateID: 'template_p8ivg4k',
        userID: 'U_ocY0NHNPqX9QOvW'
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
                const templateParams = {
                    from_name: name,
                    from_email: email,
                    message: message,
                    reply_to: email,
                    to_email: 'taimoorr2002@gmail.com'
                };
                emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
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

            // Fallback: open user's mail client via mailto (quick & easy)
            if (status) status.textContent = 'Opening your mail client...';
            const subject = 'Portfolio contact — new message';
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const mailto = `mailto:taimoorr2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = mailto;
            setTimeout(() => {
                if (status) status.textContent = '';
                contactForm.reset();
            }, 4000);
        });
    }

    // Mini game: star catcher
    const gameBoard = document.getElementById('star-game-board');
    const gameTarget = document.getElementById('game-target');
    const gameStart = document.getElementById('game-start');
    const gameReset = document.getElementById('game-reset');
    const gameScore = document.getElementById('game-score');
    const gameTime = document.getElementById('game-time');
    const gameStatus = document.getElementById('game-status');

    let gameScoreValue = 0;
    let gameTimeLeft = 20;
    let gameRunning = false;
    let gameTimer = null;

    function updateGameUI(message) {
        if (gameScore) gameScore.textContent = String(gameScoreValue);
        if (gameTime) gameTime.textContent = String(gameTimeLeft);
        if (gameStatus) gameStatus.textContent = message;
    }

    function placeTarget() {
        if (!gameBoard || !gameTarget) return;
        const boardRect = gameBoard.getBoundingClientRect();
        const targetSize = 68;
        const padding = 12;
        const maxX = Math.max(padding, boardRect.width - targetSize - padding);
        const maxY = Math.max(padding, boardRect.height - targetSize - padding);
        const x = Math.floor(Math.random() * (maxX - padding + 1)) + padding;
        const y = Math.floor(Math.random() * (maxY - padding + 1)) + padding;
        gameTarget.style.left = `${x}px`;
        gameTarget.style.top = `${y}px`;
        gameTarget.style.display = 'inline-flex';
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameTimer);
        gameTimer = null;
        if (gameTarget) gameTarget.style.display = 'none';
        updateGameUI(`Finished with ${gameScoreValue} points`);
        if (gameStart) gameStart.textContent = 'Play Again';
    }

    function startGame() {
        gameScoreValue = 0;
        gameTimeLeft = 20;
        gameRunning = true;
        if (gameStart) gameStart.textContent = 'Playing...';
        placeTarget();
        updateGameUI('Go!');
        clearInterval(gameTimer);
        gameTimer = setInterval(() => {
            gameTimeLeft -= 1;
            updateGameUI(gameRunning ? 'Catch the star!' : 'Ready');
            if (gameTimeLeft <= 0) {
                gameTimeLeft = 0;
                updateGameUI('Time is up');
                endGame();
            }
        }, 1000);
    }

    function resetGame() {
        gameScoreValue = 0;
        gameTimeLeft = 20;
        gameRunning = false;
        clearInterval(gameTimer);
        gameTimer = null;
        if (gameTarget) gameTarget.style.display = 'none';
        if (gameStart) gameStart.textContent = 'Start Game';
        updateGameUI('Ready');
    }

    if (gameBoard && gameTarget && gameStart && gameReset) {
        gameStart.addEventListener('click', startGame);
        gameReset.addEventListener('click', resetGame);
        gameTarget.addEventListener('click', () => {
            if (!gameRunning) return;
            gameScoreValue += 1;
            updateGameUI('Nice!');
            placeTarget();
        });
        window.addEventListener('resize', () => {
            if (gameRunning) placeTarget();
        });
        resetGame();
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }
});