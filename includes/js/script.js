// Burger menu toggle with side panel
(() => {
    const burgerMenu = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const body = document.body;
    
    if (!burgerMenu || !mobileMenu) return;
    
    burgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Close menu when a link is clicked (but allow navigation)
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
    
    // Close menu when clicking on overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    }
})();

// Lightweight animated scroll helper (short glide, gentle easing)
function animateScrollTo(targetY, duration = 360) {
    const startY = window.scrollY || window.pageYOffset;
    const maxY = document.documentElement.scrollHeight - window.innerHeight;
    const destY = Math.max(0, Math.min(targetY, maxY));
    const diff = destY - startY;
    if (Math.abs(diff) < 1) return;
    const startTime = performance.now();

    function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

    function step(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = easeOutCubic(t);
        window.scrollTo(0, Math.round(startY + diff * eased));
        if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

function scrollToElement(selector, instance = 0) {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length <= instance) return;
    const el = elements[instance];
    const y = el.getBoundingClientRect().top + window.scrollY - 24; // small offset
    animateScrollTo(y, 360);
}

// Attach nav link behavior (gliding scroll for anchor links, normal navigation for page links)
const link1 = document.getElementById('link1');
const link2 = document.getElementById('link2');
const link3 = document.getElementById('link3');
const link4 = document.getElementById('link4');

// Check if link href is an external page or an anchor
function isExternalLink(href) {
    return href && (href.includes('.html') || href.includes('.php') || href.startsWith('http'));
}

if (link1) {
    link1.addEventListener('click', (e) => {
        const href = link1.querySelector('a')?.getAttribute('href');
        if (!isExternalLink(href)) {
            e.preventDefault();
            scrollToElement('.hero');
        }
    });
}

if (link2) {
    link2.addEventListener('click', (e) => {
        const href = link2.querySelector('a')?.getAttribute('href');
        if (!isExternalLink(href)) {
            e.preventDefault();
            scrollToElement('.services');
        }
    });
}

if (link3) {
    link3.addEventListener('click', (e) => {
        const href = link3.querySelector('a')?.getAttribute('href');
        if (!isExternalLink(href)) {
            e.preventDefault();
            scrollToElement('footer');
        }
    });
}

if (link4) {
    link4.addEventListener('click', (e) => {
        const href = link4.querySelector('a')?.getAttribute('href');
        if (!isExternalLink(href)) {
            e.preventDefault();
            scrollToElement('.projects');
        }
    });
}

// Wheel smoothing: a minimal 'glide' by animating target scroll position
(() => {
    let target = window.scrollY;
    let ticking = false;

    function clamp(v) { return Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight)); }

    function update() {
        ticking = false;
        animateScrollTo(target, 420);
    }

    window.addEventListener('wheel', (e) => {
        // apply only for pointer-wheel type interactions; keep passive false to allow preventDefault when needed
        if (e.ctrlKey) return; // ignore when zooming
        e.preventDefault();
        target = clamp(target + e.deltaY);
        if (!ticking) {
            ticking = true;
            // schedule an animation to glide to the accumulated target
            setTimeout(update, 16);
        }
    }, { passive: false });
})();

// Simple fading slideshow for header images
(() => {
    const slides = document.querySelectorAll('.slideshow .slide');
    if (!slides || slides.length < 2) return;
    let idx = 0;
    const interval = 4500; // time each slide stays visible
    slides.forEach(s => s.classList.remove('visible'));
    slides[0].classList.add('visible');

    setInterval(() => {
        slides[idx].classList.remove('visible');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('visible');
    }, interval);
})();

// About page specific smooth scrolling behavior
(() => {
    const link1 = document.getElementById('link1');
    const link2 = document.getElementById('link2');
    const link3 = document.getElementById('link3');

    if (link1) link1.addEventListener('click', (e) => { e.preventDefault(); scrollToElement('#mission'); });
    if (link2) link2.addEventListener('click', (e) => { e.preventDefault(); scrollToElement('#vision'); });
    if (link3) link3.addEventListener('click', (e) => { e.preventDefault(); scrollToElement('#team'); });

    function scrollToElement(selector) {
        const el = document.querySelector(selector);
        if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 100;
            animateScrollTo(y, 360);
        }
    }
})();

// --- Services page gallery & navigation (merged from services.js) ---
(function() {
    // Services Gallery Functionality
    const totalGalleries = 13; // number of galleries expected

    // Initialize galleries when DOM is ready
    function initAllGalleries() {
        for (let galleryId = 0; galleryId < totalGalleries; galleryId++) {
            initGallery(galleryId);
        }
    }

    function initGallery(galleryId) {
        const prevBtn = document.querySelector(`.gallery-btn.prev[data-gallery="${galleryId}"]`);
        const nextBtn = document.querySelector(`.gallery-btn.next[data-gallery="${galleryId}"]`);
        const dots = document.querySelectorAll(`.dot[data-gallery="${galleryId}"]`);
        const container = document.querySelectorAll('.gallery-container')[galleryId];
        const images = container ? container.querySelectorAll('.gallery-image') : [];

        if (images.length === 0) return;

        let currentIndex = 0;
        const totalImages = images.length;

        // Prev/Next are optional now; if they exist wire them but don't require them
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateGallery(galleryId, currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % totalImages;
                updateGallery(galleryId, currentIndex);
            });
        }

        // Dots select a specific index — stopPropagation so container clicks don't immediately advance
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(dot.dataset.index, 10) || 0;
                currentIndex = idx;
                updateGallery(galleryId, currentIndex);
            });
        });

        // Clicking the gallery area advances to the next image
        const wrapper = container ? container.closest('.service-image-gallery') || container : null;
        if (wrapper) {
            wrapper.addEventListener('click', (e) => {
                // If the click originated on an interactive control, ignore (dots/btns stopPropagation)
                currentIndex = (currentIndex + 1) % totalImages;
                updateGallery(galleryId, currentIndex);
            });
        }

        // keyboard navigation local to the gallery: global listener is fine
        document.addEventListener('keydown', (e) => {
            if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + totalImages) % totalImages;
                updateGallery(galleryId, currentIndex);
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % totalImages;
                updateGallery(galleryId, currentIndex);
            }
        });
    }

    function updateGallery(galleryId, index) {
        const galleryContainers = document.querySelectorAll('.gallery-container');
        if (!galleryContainers[galleryId]) return;
        const images = galleryContainers[galleryId].querySelectorAll('.gallery-image');
        images.forEach(img => img.classList.remove('active'));
        if (images[index]) images[index].classList.add('active');

        const dots = document.querySelectorAll(`.dot[data-gallery="${galleryId}"]`);
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllGalleries);
    } else {
        initAllGalleries();
    }

    // Services page navigation smooth scroll (kept compact)
    (function() {
        const link2 = document.getElementById('link2');
        const link3 = document.getElementById('link3');
        const link4 = document.getElementById('link4');

        if (link2) {
            link2.addEventListener('click', (e) => {
                const href = link2.querySelector('a')?.getAttribute('href');
                if (!href || href === '#') {
                    e.preventDefault();
                    scrollToElement('#survey-services');
                }
            });
        }

        if (link3) {
            link3.addEventListener('click', (e) => {
                const href = link3.querySelector('a')?.getAttribute('href');
                if (!href || href === '#') {
                    e.preventDefault();
                    scrollToElement('footer');
                }
            });
        }

        if (link4) {
            link4.addEventListener('click', (e) => {
                const href = link4.querySelector('a')?.getAttribute('href');
                if (!href || href === '#') {
                    e.preventDefault();
                    scrollToElement('.projects');
                }
            });
        }

        function scrollToElement(selector) {
            const el = document.querySelector(selector);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 100;
                animateScrollTo(y, 360);
            }
        }
    })();

})();