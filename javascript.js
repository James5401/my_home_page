/**
 * 0xide - Cool Techie Website JS
 * Terminal effects, animations, and interactive features
 */

import { prepareWithSegments, layoutNextLine } from 'https://esm.sh/@chenglou/pretext';

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initSlider();
    initContactForm();
    initPretextHighlight();
    initStatCounters();
    initScrollAnimations();
});

/**
 * Mobile Nav Toggle
 */
function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('nav ul');
    if (!toggle || !navList) return;

    toggle.addEventListener('click', () => {
        navList.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav')) {
            navList.classList.remove('open');
        }
    });
}

/**
 * Slider Logic
 */
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.slider-indicators span');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        indicators.forEach(i => i.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    showSlide(0);
    startAutoSlide();
}

/**
 * Contact Form Logic
 */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Submission:', data);

        const btn = form.querySelector('.btn-submit');
        if (!btn) return;
        const originalText = btn.textContent;

        btn.textContent = '> Message Sent!';
        btn.style.background = 'var(--neon-green)';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

/**
 * Stat Counter Animation
 */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = current;
    }, 50);
}

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
    const elements = document.querySelectorAll('.glass-card, .grid-item, .card, .calendar-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.05}s, transform 0.6s ease ${i * 0.05}s`;
        observer.observe(el);
    });
}

/**
 * Pretext Highlight with Shuttle Animation
 */
async function initPretextHighlight() {
    const canvas = document.getElementById('highlight-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = document.getElementById('highlight-container');

    const image = new Image();
    image.src = 'assets/goose.jpg';

    const text = "The future of computing lies at the intersection of biology-inspired algorithms and silicon. My work focuses on leveraging Deep Neural Networks to simulate evolutionary processes, optimizing the physical architecture of next-generation RISC processors. By treating circuit paths like neural pathways, we can achieve unprecedented efficiency in SoC designs. This '0xide' approach isn't just about faster clock speeds; it's about creating hardware that can adapt and learn, mirroring the complex systems found in nature. As we push the boundaries of LLMs, the underlying hardware must evolve in tandem to support the massive computational demands of tomorrow's artificial general intelligence.";

    await new Promise(resolve => { image.onload = resolve; });

    const shuttle = {
        x: -100,
        y: 250,
        vx: 2,
        vy: -0.2,
        angle: -0.1,
        width: 40,
        height: 20
    };

    const fontSize = 16;
    const lineHeight = 26;
    const font = `${fontSize}px 'JetBrains Mono', monospace`;
    const prepared = prepareWithSegments(text, font);

    const drawShuttle = (ctx, x, y, angle) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Flame
        const gradient = ctx.createRadialGradient(-20, 0, 0, -25, 0, 15);
        gradient.addColorStop(0, '#00fff5');
        gradient.addColorStop(0.5, '#bf5af2');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(-20, 0, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#e8e8ed';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(-15, -10);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-15, 10);
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#00fff5';
        ctx.beginPath();
        ctx.ellipse(5, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00fff5';
        ctx.strokeStyle = '#00fff5';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    };

    const animate = () => {
        const dpr = window.devicePixelRatio || 1;
        const width = container.offsetWidth;
        const height = 400;

        if (canvas.width !== width * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, width, height);

        // Draw Image
        const imgSize = 160;
        const imgPadding = 20;
        const imgX = width - imgSize;
        const imgY = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // Cyan ring around image
        ctx.beginPath();
        ctx.arc(imgX + imgSize / 2, imgY + imgSize / 2, imgSize / 2 + 2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 255, 245, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pretext
        ctx.font = font;
        ctx.fillStyle = 'rgba(232, 232, 237, 0.7)';
        ctx.textBaseline = 'top';

        let cursor = { segmentIndex: 0, graphemeIndex: 0 };
        let y = 10;

        while (true) {
            let currentMaxWidth = width;
            if (y < imgY + imgSize + imgPadding) {
                currentMaxWidth = width - imgSize - imgPadding;
            }

            const line = layoutNextLine(prepared, cursor, currentMaxWidth);
            if (line === null) break;

            ctx.fillText(line.text, 0, y);
            cursor = line.end;
            y += lineHeight;
            if (y > height - 20) break;
        }

        // Shuttle
        shuttle.x += shuttle.vx;
        shuttle.y += shuttle.vy;
        if (shuttle.x > width + 100) {
            shuttle.x = -100;
            shuttle.y = 150 + Math.random() * 100;
        }

        ctx.globalCompositeOperation = 'lighter';
        drawShuttle(ctx, shuttle.x, shuttle.y, shuttle.angle);
        ctx.globalCompositeOperation = 'source-over';

        requestAnimationFrame(animate);
    };

    animate();
}
