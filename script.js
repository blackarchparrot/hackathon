/**
 * Textile Engineering Hub - Core JavaScript
 * Premium Interactive Canvas Background, Tilt effects, Theme Management, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavbarScroll();
    initCursorSpotlight();
    initCanvasBackground();
    initButtonRipple();
});

/* ==========================================
   THEME TOGGLE MANAGEMENT
   ================================---------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    const savedTheme = localStorage.getItem('textile_hub_theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('textile_hub_theme', newTheme);
        
        updateCanvasTheme(newTheme);
    });
}

function updateCanvasTheme(theme) {
    if (window.updateCanvasColors) {
        window.updateCanvasColors(theme);
    }
}

/* ==========================================
   NAVBAR SCROLL EFFECT
   ================================---------- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ==========================================
   CURSOR SPOTLIGHT EFFECT
   ================================---------- */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursorSpotlight');
    let mouseX = 0, mouseY = 0;
    let spotlightX = 0, spotlightY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderSpotlight() {
        spotlightX += (mouseX - spotlightX) * 0.1;
        spotlightY += (mouseY - spotlightY) * 0.1;
        spotlight.style.left = `${spotlightX}px`;
        spotlight.style.top = `${spotlightY}px`;
        requestAnimationFrame(renderSpotlight);
    }
    renderSpotlight();
}

/* ==========================================
   DYNAMIC CANVAS BACKGROUND (Textile + AI)
   ================================---------- */
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let threads = [];
    let nodes = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function getColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            threadColor: isDark ? 'rgba(106, 92, 255, 0.08)' : 'rgba(79, 70, 229, 0.06)',
            nodeColor: isDark ? 'rgba(22, 245, 163, 0.4)' : 'rgba(5, 150, 105, 0.3)',
            lineColor: isDark ? 'rgba(0, 229, 255, 0.07)' : 'rgba(2, 132, 199, 0.05)'
        };
    }

    let colors = getColors();
    window.updateCanvasColors = () => {
        colors = getColors();
    };

    class ThreadWave {
        constructor(yOffset, frequency, amplitude, speed) {
            this.yOffset = yOffset;
            this.frequency = frequency;
            this.amplitude = amplitude;
            this.speed = speed;
            this.angle = Math.random() * Math.PI * 2;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.strokeStyle = colors.threadColor;
            ctx.lineWidth = 1.5;

            for (let x = 0; x < width; x += 15) {
                const y = this.yOffset + Math.sin(x * this.frequency + this.angle) * this.amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            this.angle += this.speed;
        }
    }

    class NodeParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = colors.nodeColor;
            ctx.fill();
        }
    }

    function initElements() {
        threads = [];
        nodes = [];

        for (let i = 0; i < height; i += 40) {
            threads.push(new ThreadWave(i, 0.003, 15, 0.01));
        }

        const nodeCount = Math.floor((width * height) / 25000);
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new NodeParticle());
        }
    }

    initElements();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        threads.forEach(thread => thread.draw(ctx));

        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw(ctx);

            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = colors.lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================
   BUTTON RIPPLE EFFECT
   ================================---------- */
function initButtonRipple() {
    const buttons = document.querySelectorAll('.portal-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* ==========================================
   NAVIGATION REDIRECT FUNCTION
   ================================---------- */
function navigateTo(url) {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
        window.location.href = url;
    }, 400);
}