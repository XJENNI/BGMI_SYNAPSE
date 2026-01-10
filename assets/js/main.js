/**
 * SYNAPSE MAMC BGMI 2026 - Main JavaScript
 * Handles: Preloader, Navigation, Scroll Effects, Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== Preloader ==========
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    });

    // Fallback: Hide preloader after 3 seconds max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ========== Mobile Navigation ==========
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    // Scroll lock state for mobile nav
    const scrollLockState = { scrollY: 0 };

    // Accessibility hint: connect toggle to menu
    if (menuToggle && mainNav) {
        menuToggle.setAttribute('aria-controls', 'mainNav');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // Improved mobile nav behavior: open/close, focus trap, keyboard nav
    let lastFocusedBeforeNav = null;
    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    let focusableEls = [];

    function toggleMobileNav() {
        if (menuToggle.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    function openMobileNav() {
        if (!menuToggle || !mainNav) return;

        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        navOverlay.classList.add('active');
        document.body.classList.add('nav-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        mainNav.setAttribute('aria-hidden', 'false');

        // scroll lock
        scrollLockState.scrollY = window.scrollY || document.documentElement.scrollTop;
        document.documentElement.style.height = '100%';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollLockState.scrollY}px`;

        // save focus
        lastFocusedBeforeNav = document.activeElement;
        trapFocus(mainNav);

        // focus the close button when opened
        const closeBtn = document.getElementById('navClose');
        if (closeBtn) closeBtn.focus();
    }

    function closeMobileNav() {
        if (!menuToggle || !menuToggle.classList.contains('active')) return;
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.setAttribute('aria-hidden', 'true');

        // restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.documentElement.style.height = '';
        window.scrollTo(0, scrollLockState.scrollY || 0);

        releaseFocus();
        if (lastFocusedBeforeNav) lastFocusedBeforeNav.focus();
    }

    function trapFocus(container) {
        focusableEls = Array.from(container.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);
        document.addEventListener('keydown', focusTrapKeyHandler);
    }

    function releaseFocus() {
        document.removeEventListener('keydown', focusTrapKeyHandler);
        focusableEls = [];
    }

    function focusTrapKeyHandler(e) {
        if (!menuToggle.classList.contains('active')) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            closeMobileNav();
            return;
        }

        if (e.key === 'Tab') {
            if (!focusableEls.length) return;
            const first = focusableEls[0];
            const last = focusableEls[focusableEls.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIndex = focusableEls.indexOf(document.activeElement);
            let nextIndex = 0;
            if (currentIndex === -1) nextIndex = 0;
            else nextIndex = (currentIndex + (e.key === 'ArrowDown' ? 1 : -1) + focusableEls.length) % focusableEls.length;
            focusableEls[nextIndex].focus();
        }
    }

    // Improved handlers for menu toggle and overlay
    if (menuToggle) {
        // ensure it's a true button
        if (!menuToggle.hasAttribute('type')) menuToggle.setAttribute('type', 'button');

        // Use pointerdown for faster response on touch devices
        let isToggling = false;
        menuToggle.addEventListener('pointerdown', (e) => {
            if (isToggling) return;
            isToggling = true;
            e.preventDefault();
            toggleMobileNav();
            setTimeout(() => { isToggling = false; }, 300);
        }, { passive: false });

        // Fallback click
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            if (!isToggling) toggleMobileNav();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileNav);
        navOverlay.addEventListener('touchstart', closeMobileNav, { passive: true });
    }

    // Close button inside nav
    const navCloseBtn = document.getElementById('navClose');
    if (navCloseBtn) navCloseBtn.addEventListener('click', (e) => { e.preventDefault(); closeMobileNav(); });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // close nav on mobile after navigation
            setTimeout(() => { if (matchMedia('(max-width: 768px)').matches) closeMobileNav(); }, 0);
        });
    });

    // Ensure mainNav starts hidden for assistive tech
    if (mainNav) mainNav.setAttribute('aria-hidden', 'true');

    // Set active link based on URL
    function setActiveLink() {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === current || window.location.href.indexOf(href) !== -1) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    setActiveLink();

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileNav);
        // Ensure it's a true button for accessibility
        if (!menuToggle.hasAttribute('type')) menuToggle.setAttribute('type', 'button');
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeMobileNav);
        navOverlay.addEventListener('touchstart', closeMobileNav);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileNav);
    });

    // Close mobile nav on Escape for keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeMobileNav();
        }
    });

    // ========== Sticky Header with Scroll Effect ==========
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for styling
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide scroll top button
        if (currentScroll > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== Registration Alert ==========
    const registerBtns = document.querySelectorAll('#registerBtn, .btn-primary');
    registerBtns.forEach(btn => {
        if (btn.getAttribute('href') === '#' || btn.getAttribute('href') === '') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Enhanced Alert with Cyberpunk branding
                const alertOverlay = document.createElement('div');
                alertOverlay.style = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(5px);';
                alertOverlay.innerHTML = `
                    <div style="background: #0a0a0a; border: 2px solid var(--accent-cyan); padding: 2.5rem; max-width: 400px; width: 90%; text-align: center; box-shadow: 0 0 30px rgba(0, 243, 255, 0.3);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🛰️</div>
                        <h3 style="color: var(--accent-cyan); font-family: var(--font-heading); text-transform: uppercase; margin-bottom: 1rem;">Signal Detected</h3>
                        <p style="color: var(--text-light); margin-bottom: 1.5rem;">The official registration portal for <strong>SYNAPSE 2026</strong> will be activated shortly. Follow @mavericks_mamc for the exact drop time!</p>
                        <button id="closeAlert" class="btn btn-primary" style="padding: 10px 30px;">ACKNOWLEDGE</button>
                    </div>
                `;
                document.body.appendChild(alertOverlay);
                document.getElementById('closeAlert').onclick = () => alertOverlay.remove();
            });
        }
    });

    // ========== Scroll Animations (Fade In) ==========
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight + 40; // Account for ticker
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Active Navigation Link ==========
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // ========== Keyboard Navigation ==========
    document.addEventListener('keydown', function(e) {
        // Close mobile nav on Escape
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMobileNav();
        }
    });

    // ========== Button Hover Sound Effect (Optional) ==========
    const buttons = document.querySelectorAll('.btn, .filter-btn, .community-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            // Add subtle scale animation
            this.style.transform = this.style.transform.replace('scale(1)', '') + ' scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // ========== Optimized Hero Parallax (works on mobile/iOS) ==========
    (function() {
        const hero = document.querySelector('.hero');
        const heroBg = document.querySelector('.hero-bg');
        if (!hero || !heroBg) return;

        let latestScroll = 0;
        let ticking = false;

        window.addEventListener('scroll', () => {
            latestScroll = window.scrollY || window.pageYOffset;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rate = Math.min(latestScroll * 0.25, window.innerHeight * 0.5);
                    heroBg.style.transform = `translate3d(0, ${rate}px, 0)`;
                    heroBg.style.willChange = 'transform';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    })();

    // ========== Console Easter Egg ==========
    console.log('%c⚡ SYNAPSE MAMC BGMI 2026 ⚡', 
        'color: #00f0ff; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0 #bc13fe;');
    console.log('%cWelcome to the tournament website!', 
        'color: #b0b0b0; font-size: 12px;');
    console.log('%c🎮 May the best team win! 🏆', 
        'color: #ffd700; font-size: 14px;');
});

// ========== Utility Functions ==========

/**
 * Debounce function to limit rapid function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format time to HH:MM format
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

/**
 * Add loading state to element
 */
function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}
