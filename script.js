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

    // Mini game: snake
    const snakeBoard = document.getElementById('snake-game-board');
    const snakeCanvas = document.getElementById('snake-canvas');
    const snakeStart = document.getElementById('game-start');
    const snakeReset = document.getElementById('game-reset');
    const snakeScore = document.getElementById('game-score');
    const snakeLength = document.getElementById('game-length');
    const snakeStatus = document.getElementById('game-status');
    const snakeOverlay = document.getElementById('snake-overlay');
    const snakeLeaderboard = document.getElementById('snake-leaderboard');

    const snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    const snakeGrid = 18;
    const snakeCells = 20;
    const snakeSize = snakeGrid * snakeCells;
    const snakeLeaderboardKey = 'taimoor-snake-leaderboard-v1';

    let snakeRunning = false;
    let snakeLoop = null;
    let snakeScoreValue = 0;
    let snakeDirection = {x: 1, y: 0};
    let snakeNextDirection = {x: 1, y: 0};
    let snakeBody = [];
    let snakeFood = {x: 10, y: 10};
    let snakeSpeed = 180;
    let snakeLeaderboardData = loadSnakeLeaderboard();
    let snakeLeaderboardSubmittedScore = 0;

    function resizeSnakeCanvas() {
        if (!snakeCanvas) return;
        snakeCanvas.width = snakeSize;
        snakeCanvas.height = snakeSize;
    }

    function updateSnakeUI(message) {
        if (snakeScore) snakeScore.textContent = String(snakeScoreValue);
        if (snakeLength) snakeLength.textContent = String(snakeBody.length);
        if (snakeStatus) snakeStatus.textContent = message;
        if (snakeOverlay) snakeOverlay.textContent = message;
    }

    function loadSnakeLeaderboard() {
        try {
            const stored = window.localStorage.getItem(snakeLeaderboardKey);
            const parsed = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(parsed)) return [];
            return parsed
                .filter(entry => entry && typeof entry.name === 'string' && Number.isFinite(entry.score))
                .slice(0, 5);
        } catch (error) {
            return [];
        }
    }

    function saveSnakeLeaderboard() {
        try {
            window.localStorage.setItem(snakeLeaderboardKey, JSON.stringify(snakeLeaderboardData));
        } catch (error) {
            console.warn('Unable to save snake leaderboard', error);
        }
    }

    function renderSnakeLeaderboard() {
        if (!snakeLeaderboard) return;
        snakeLeaderboard.innerHTML = '';

        if (!snakeLeaderboardData.length) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'leaderboard-empty';
            emptyItem.textContent = 'No scores yet. Be the first one.';
            snakeLeaderboard.appendChild(emptyItem);
            return;
        }

        snakeLeaderboardData.forEach((entry, index) => {
            const item = document.createElement('li');
            const rank = document.createElement('span');
            rank.className = 'rank';
            rank.textContent = String(index + 1);

            const player = document.createElement('span');
            player.className = 'player';
            player.textContent = entry.name;

            const points = document.createElement('span');
            points.className = 'points';
            points.textContent = `${entry.score} pts`;

            item.append(rank, player, points);
            snakeLeaderboard.appendChild(item);
        });
    }

    function qualifiesForSnakeLeaderboard(score) {
        if (score <= 0) return false;
        if (snakeLeaderboardData.length < 5) return true;
        return score >= snakeLeaderboardData[snakeLeaderboardData.length - 1].score;
    }

    function currentSnakeHighScore() {
        return snakeLeaderboardData.length ? snakeLeaderboardData[0].score : 0;
    }

    function maybeSubmitSnakeLeaderboardScore() {
        if (snakeScoreValue <= snakeLeaderboardSubmittedScore) return;
        if (snakeScoreValue <= currentSnakeHighScore()) return;

        const enteredName = window.prompt('New high score! Enter your name for the leaderboard:', 'Anonymous');
        if (enteredName === null) {
            snakeLeaderboardSubmittedScore = snakeScoreValue;
            return;
        }

        const name = enteredName.trim() || 'Anonymous';
        snakeLeaderboardData = snakeLeaderboardData
            .concat({name, score: snakeScoreValue, createdAt: Date.now()})
            .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
            .slice(0, 5);
        snakeLeaderboardSubmittedScore = snakeScoreValue;
        saveSnakeLeaderboard();
        renderSnakeLeaderboard();
        updateSnakeUI(`New high score: ${snakeScoreValue}`);
    }

    function submitSnakeLeaderboardScore(score) {
        if (!qualifiesForSnakeLeaderboard(score)) return;

        const enteredName = window.prompt('New high score! Enter your name for the leaderboard:', 'Anonymous');
        if (enteredName === null) return;

        const name = enteredName.trim() || 'Anonymous';
        snakeLeaderboardData = snakeLeaderboardData
            .concat({name, score, createdAt: Date.now()})
            .sort((a, b) => b.score - a.score || a.createdAt - b.createdAt)
            .slice(0, 5);
        saveSnakeLeaderboard();
        renderSnakeLeaderboard();
    }

    function randomFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * snakeCells),
                y: Math.floor(Math.random() * snakeCells)
            };
        } while (snakeBody.some(segment => segment.x === food.x && segment.y === food.y));
        return food;
    }

    function resetSnakeState() {
        snakeScoreValue = 0;
        snakeDirection = {x: 1, y: 0};
        snakeNextDirection = {x: 1, y: 0};
        snakeLeaderboardSubmittedScore = 0;
        snakeBody = [
            {x: 9, y: 10},
            {x: 8, y: 10},
            {x: 7, y: 10}
        ];
        snakeFood = randomFood();
        snakeSpeed = 180;
        updateSnakeUI('Ready');
        drawSnake();
    }

    function drawSnake() {
        if (!snakeCtx || !snakeCanvas) return;
        snakeCtx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        const cell = snakeGrid;

        snakeCtx.fillStyle = '#0b1220';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        for (let y = 0; y < snakeCells; y += 1) {
            for (let x = 0; x < snakeCells; x += 1) {
                snakeCtx.fillStyle = (x + y) % 2 === 0 ? '#0f172a' : '#111827';
                snakeCtx.fillRect(x * cell, y * cell, cell, cell);
            }
        }

        snakeCtx.fillStyle = '#ef4444';
        snakeCtx.fillRect(snakeFood.x * cell + 2, snakeFood.y * cell + 2, cell - 4, cell - 4);

        snakeBody.forEach((segment, index) => {
            snakeCtx.fillStyle = index === 0 ? '#facc15' : '#22c55e';
            snakeCtx.fillRect(segment.x * cell + 1, segment.y * cell + 1, cell - 2, cell - 2);
        });
    }

    function setDirection(x, y) {
        const isReverse = snakeDirection.x === -x && snakeDirection.y === -y;
        if (!isReverse) {
            snakeNextDirection = {x, y};
        }
    }

    function gameOver() {
        snakeRunning = false;
        clearInterval(snakeLoop);
        snakeLoop = null;
        if (snakeStart) snakeStart.textContent = 'Play Again';
        updateSnakeUI('Game Over');
    }

    function stepSnake() {
        snakeDirection = snakeNextDirection;
        const head = snakeBody[0];
        const nextHead = {
            x: (head.x + snakeDirection.x + snakeCells) % snakeCells,
            y: (head.y + snakeDirection.y + snakeCells) % snakeCells
        };

        const ateFood = nextHead.x === snakeFood.x && nextHead.y === snakeFood.y;
        const bodyToCheck = ateFood ? snakeBody : snakeBody.slice(0, -1);
        const hitSelf = bodyToCheck.some(segment => segment.x === nextHead.x && segment.y === nextHead.y);
        if (hitSelf) {
            drawSnake();
            gameOver();
            return;
        }

        snakeBody.unshift(nextHead);

        if (ateFood) {
            snakeScoreValue += 1;
            snakeFood = randomFood();
            snakeSpeed = Math.max(90, snakeSpeed - 4);
            updateSnakeUI('Nice!');
            maybeSubmitSnakeLeaderboardScore();
            clearInterval(snakeLoop);
            snakeLoop = setInterval(stepSnake, snakeSpeed);
        } else {
            snakeBody.pop();
        }

        drawSnake();
    }

    function startSnake() {
        if (snakeRunning) return;
        snakeRunning = true;
        if (snakeStart) snakeStart.textContent = 'Playing...';
        updateSnakeUI('Go!');
        clearInterval(snakeLoop);
        snakeLoop = setInterval(stepSnake, snakeSpeed);
    }

    function resetSnake() {
        snakeRunning = false;
        clearInterval(snakeLoop);
        snakeLoop = null;
        if (snakeStart) snakeStart.textContent = 'Start Game';
        resetSnakeState();
    }

    if (snakeBoard && snakeCanvas && snakeStart && snakeReset && snakeCtx) {
        resizeSnakeCanvas();
        renderSnakeLeaderboard();
        resetSnakeState();
        snakeBoard.addEventListener('click', () => snakeBoard.focus());
        snakeStart.addEventListener('click', startSnake);
        snakeReset.addEventListener('click', resetSnake);
        document.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            if (key === 'arrowup' || key === 'w') setDirection(0, -1);
            if (key === 'arrowdown' || key === 's') setDirection(0, 1);
            if (key === 'arrowleft' || key === 'a') setDirection(-1, 0);
            if (key === 'arrowright' || key === 'd') setDirection(1, 0);
            if ((key === 'enter' || key === ' ') && !snakeRunning) startSnake();
        });
        document.querySelectorAll('.snake-btn').forEach(button => {
            button.addEventListener('click', () => {
                const dir = button.getAttribute('data-dir');
                if (dir === 'up') setDirection(0, -1);
                if (dir === 'down') setDirection(0, 1);
                if (dir === 'left') setDirection(-1, 0);
                if (dir === 'right') setDirection(1, 0);
                if (!snakeRunning) startSnake();
            });
        });
        window.addEventListener('resize', resizeSnakeCanvas);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    }
});