
// DOM-safe High-Speed Typewriter
function typeTextNodes(element, speed) {
    if(element.dataset.typed === 'true') return;
    element.dataset.typed = 'true';

    const rect = element.getBoundingClientRect();
    element.style.minHeight = rect.height + 'px';

    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while(node = walker.nextNode()) {
        if(node.nodeValue.trim() !== '') {
            textNodes.push({
                node: node,
                text: node.nodeValue
            });
            node.nodeValue = ''; 
        }
    }
    
    let nodeIndex = 0;
    let charIndex = 0;
    
    function typeNextChar() {
        if (nodeIndex >= textNodes.length) {
            element.style.minHeight = '';
            return; 
        }
        
        const currentInfo = textNodes[nodeIndex];
        charIndex += 2; // Types 2 chars at a time for a balanced speed
        if(charIndex > currentInfo.text.length) charIndex = currentInfo.text.length;
        
        currentInfo.node.nodeValue = currentInfo.text.substring(0, charIndex);
        
        if (charIndex >= currentInfo.text.length) {
            nodeIndex++;
            charIndex = 0;
        }
        setTimeout(typeNextChar, speed);
    }
    typeNextChar();
}

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .card, .timeline-item, .skill-category, .cert-card, .social-circle');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

// Typewriter Effect
const roles = [
    "Computer Science Engineer", 
    "Full Stack Developer", 
    "AI & ML Explorer"
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.querySelector('.typewriter');

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at end
        typeSpeed = 2500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 600;
    }
    
    setTimeout(type, typeSpeed);
}

// Start typing effect on load
document.addEventListener('DOMContentLoaded', type);


// Intersection Observer for Smooth Scroll Reveals
const revealElements = document.querySelectorAll('.reveal-init');
const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');

            if(entry.target.querySelector('#about-text-container')) {
                typeTextNodes(entry.target.querySelector('#about-text-container'), 8); // Super fast 8ms typing
            }
            if(entry.target.id === 'about-text-container') {
                typeTextNodes(entry.target, 8);
            }

            
            // Remove classes after 1000ms transition completes to prevent hover conflicts
            setTimeout(() => {
                entry.target.style.transition = ''; 
                entry.target.classList.remove('reveal-init', 'reveal-active');
            }, 1000);
            
            observer.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

revealElements.forEach(el => revealObserver.observe(el));


// Mobile Navigation Toggle
const navSlide = () => {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const nav = document.querySelector('.nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        // Close mobile nav if open
        if(nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active');
            hamburger.classList.remove('toggle');
        }

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

navSlide();

// Resume Modal Functions
function openImageModal(e, src, title) {
    e.preventDefault();
    const modal = document.getElementById('image-modal');
    if(modal) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-image').src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize Particles.js
if(typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#0ea5e9" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.3, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#0ea5e9",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2.5,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": true, "mode": "grab" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 0.5 } }
            }
        },
        "retina_detect": true
    });
}

// Initialize VanillaTilt for 3D card effects
if(typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".glass"), {
        max: 3,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
        scale: 1.02
    });
}

// Scroll Progress Bar
const scrollProgress = document.getElementById('scroll-progress');
if(scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
    });
}

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
if(themeToggle) {
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        if (document.body.classList.contains('light-mode')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Confetti Effect Function
function fireConfetti() {
    if (typeof confetti !== 'undefined') {
        const duration = 2000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#0ea5e9', '#38bdf8', '#ffffff']
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#0ea5e9', '#38bdf8', '#ffffff']
            }));
        }, 250);
    }
}

// 1. Skill Radar Chart (Chart.js)
const ctxRadar = document.getElementById('skillRadar');
if(ctxRadar && typeof Chart !== 'undefined') {
    new Chart(ctxRadar, {
        type: 'radar',
        data: {
            labels: ['Java / OOP', 'Spring Boot', 'DSA', 'SQL', 'Networks'],
            datasets: [{
                label: 'Proficiency',
                data: [95, 80, 85, 80, 75],
                backgroundColor: 'rgba(14, 165, 233, 0.25)',
                borderColor: 'rgba(14, 165, 233, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(14, 165, 233, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    pointLabels: { color: '#9ca3af', font: { size: 12, family: 'Poppins', weight: '600' } },
                    ticks: { display: false, min: 0, max: 100 }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// 3. Konami Code
const secretCode = ['p','k'];
let keyIndex = 0;
let matrixInterval;

document.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === secretCode[keyIndex]) {
        keyIndex++;
        if(keyIndex === secretCode.length) {
            activateMatrix();
            keyIndex = 0;
        }
    } else {
        keyIndex = 0;
    }
});

function activateMatrix() {
    document.body.classList.toggle('pk-mode');
    const mCanvas = document.getElementById('matrix-canvas');
    if(!mCanvas) return;
    
    if(document.body.classList.contains('pk-mode')) {
        const mCtx = mCanvas.getContext('2d');
        mCanvas.width = window.innerWidth; mCanvas.height = window.innerHeight;
        
        // Matrix setup
        const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\|{}<>[]^~";
        const drops = [];
        const fontSize = 16;
        const columns = mCanvas.width / fontSize;
        for(let x=0; x<columns; x++) drops[x] = 1;
        
        if(matrixInterval) clearInterval(matrixInterval);
        matrixInterval = setInterval(() => {
            mCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
            mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
            mCtx.fillStyle = "#0F0";
            mCtx.font = fontSize + "px monospace";
            for(let i=0; i<drops.length; i++) {
                const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
                mCtx.fillText(text, i*fontSize, drops[i]*fontSize);
                if(drops[i]*fontSize > mCanvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }, 33);
        
        window.addEventListener('resize', () => {
            mCanvas.width = window.innerWidth; mCanvas.height = window.innerHeight;
        });
    }
}


// Cinematic Loading Screen Logic
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    if(loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');
            }, 800);
        }, 2500);
    }
});



// Premium 3D Tilt and Spotlight Hover Effect for Education Cards
document.addEventListener('DOMContentLoaded', () => {
    const eduCards = document.querySelectorAll('.edu-timeline-content');
    eduCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
});

// Initialize Lenis for buttery-smooth mousewheel scrolling
const lenis = new Lenis({
    lerp: 0.1, // Adjusts the smoothness (lower is smoother/heavier)
    smoothWheel: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
