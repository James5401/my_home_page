/**
 * Modernized Personal Webpage JS
 * Including Pretext for text-wrapping around images and Shuttle Animation
 */

import { prepareWithSegments, layoutNextLine } from 'https://esm.sh/@chenglou/pretext';

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initContactForm();
    initPretextHighlight();
});

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
        indicators[currentSlide].classList.add('active');
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

    // Indicators click
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoSlide();
        });
    });

    // Initialize
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
        
        // Simple visual feedback
        const btn = form.querySelector('.btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Message Sent!';
        btn.style.background = '#10b981'; // Success green
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

/**
 * Pretext Highlight Logic with Shuttle Animation
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

    // Shuttle State
    const shuttle = {
        x: -100,
        y: 250,
        vx: 2,
        vy: -0.2,
        angle: -0.1,
        width: 40,
        height: 20
    };

    let animationFrame;
    const fontSize = 18;
    const lineHeight = 28;
    const font = `${fontSize}px Inter, sans-serif`;
    const prepared = prepareWithSegments(text, font);

    const drawShuttle = (ctx, x, y, angle) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Flame effect
        const gradient = ctx.createRadialGradient(-20, 0, 0, -25, 0, 15);
        gradient.addColorStop(0, '#ffeb3b');
        gradient.addColorStop(0.5, '#ff9800');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(-20, 0, 15, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shuttle Body (Stylized)
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(20, 0); // Nose
        ctx.lineTo(-15, -10); // Wing Top
        ctx.lineTo(-10, 0); // Back
        ctx.lineTo(-15, 10); // Wing Bottom
        ctx.closePath();
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        ctx.ellipse(5, 0, 8, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#7c4dff';
        ctx.strokeStyle = '#7c4dff';
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

        // 1. Draw Static Highlight Image
        const imgSize = 180;
        const imgPadding = 20;
        const imgX = width - imgSize;
        const imgY = 0;

        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // 2. Draw Pretext Wrapped Text (Base Layer)
        ctx.font = font;
        ctx.fillStyle = 'rgba(248, 250, 252, 0.8)'; 
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

        // 3. Update and Draw Shuttle (Moving THROUGH the text)
        shuttle.x += shuttle.vx;
        shuttle.y += shuttle.vy;
        if (shuttle.x > width + 100) {
            shuttle.x = -100;
            shuttle.y = 150 + Math.random() * 100;
        }
        
        // Use 'lighter' composite mode so the shuttle's glow interacts with the text
        ctx.globalCompositeOperation = 'lighter';
        drawShuttle(ctx, shuttle.x, shuttle.y, shuttle.angle);
        ctx.globalCompositeOperation = 'source-over';

        animationFrame = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', () => {
        // Resize handled inside animate loop check
    });
}
