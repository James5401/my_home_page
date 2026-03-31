/**
 * Modernized Personal Webpage JS
 * Including Pretext for text-wrapping around images
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
 * Pretext Highlight Logic
 */
async function initPretextHighlight() {
    const canvas = document.getElementById('highlight-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = document.getElementById('highlight-container');

    const image = new Image();
    image.src = 'assets/goose.jpg';
    
    // Text to wrap
    const text = "The future of computing lies at the intersection of biology-inspired algorithms and silicon. My work focuses on leveraging Deep Neural Networks to simulate evolutionary processes, optimizing the physical architecture of next-generation RISC processors. By treating circuit paths like neural pathways, we can achieve unprecedented efficiency in SoC designs. This '0xide' approach isn't just about faster clock speeds; it's about creating hardware that can adapt and learn, mirroring the complex systems found in nature. As we push the boundaries of LLMs, the underlying hardware must evolve in tandem to support the massive computational demands of tomorrow's artificial general intelligence.";

    // Load image before drawing
    await new Promise(resolve => { image.onload = resolve; });

    const render = () => {
        // Set canvas resolution for crisp text (High-DPI)
        const dpr = window.devicePixelRatio || 1;
        const width = container.offsetWidth;
        const height = 400; // Fixed height for highlight
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        ctx.clearRect(0, 0, width, height);

        // Styling
        const fontSize = 18;
        const lineHeight = 28;
        const font = `${fontSize}px Inter, sans-serif`;
        ctx.font = font;
        ctx.fillStyle = '#f8fafc'; // --text-color
        ctx.textBaseline = 'top';

        // Image position and size
        const imgSize = 180;
        const imgPadding = 20;
        const imgX = width - imgSize; // Align to right
        const imgY = 0;

        // Draw image (rounded)
        ctx.save();
        ctx.beginPath();
        ctx.arc(imgX + imgSize/2, imgY + imgSize/2, imgSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(image, imgX, imgY, imgSize, imgSize);
        ctx.restore();

        // Pretext Layout
        const prepared = prepareWithSegments(text, font);
        let cursor = { segmentIndex: 0, graphemeIndex: 0 };
        let y = 10;

        while (true) {
            // Calculate available width for this line
            // If y is within the image vertical range, reduce width
            let currentMaxWidth = width;
            if (y < imgY + imgSize + imgPadding) {
                currentMaxWidth = width - imgSize - imgPadding;
            }

            const line = layoutNextLine(prepared, cursor, currentMaxWidth);
            if (line === null) break;

            ctx.fillText(line.text, 0, y);

            cursor = line.end;
            y += lineHeight;

            if (y > height - 20) break; // Overflow safety
        }
    };

    render();
    window.addEventListener('resize', render);
}
