/**
 * SYNAPSE MAMC BGMI 2026 - Main JavaScript
 * Handles: Preloader, Navigation, Scroll Effects, Animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========== Preloader ==========
    const preloader = document.getElementById('preloader');
    let preloaderHidden = false;

    window.addEventListener('load', function() {
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
            preloaderHidden = true;
        }, 800);
    });

    // Robust fallback: Hide preloader after 3s and show a compatibility banner after 5s if still present
    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            try { preloader.classList.add('hidden'); } catch (e) { preloader.style.display = 'none'; }
            preloaderHidden = true;
        }
    }, 3000);

    setTimeout(() => {
        if (preloader && !preloader.classList.contains('hidden')) {
            try { preloader.classList.add('hidden'); } catch (e) { preloader.style.display = 'none'; }
            preloaderHidden = true;
            showCompatibilityBanner('Compatibility issue detected: some features may not be supported on this device — content has been revealed for access.');
        }
    }, 5000);

    // Diagnostic banner for compatibility issues — unobtrusive and dismissible
    function showCompatibilityBanner(message) {
        if (document.getElementById('compatBanner')) return;
        const banner = document.createElement('div');
        banner.id = 'compatBanner';
        banner.setAttribute('role', 'status');
        banner.setAttribute('aria-live', 'polite');
        banner.style = 'position: fixed; right: 16px; bottom: 16px; background: rgba(16,16,24,0.95); color: white; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.6); max-width: 320px; font-size: 0.9rem;';
        banner.innerHTML = `
            <div style="display:flex; gap:0.6rem; align-items:center;">
                <div style="font-size:1.2rem; color:var(--accent-cyan);">⚠️</div>
                <div style="flex:1">${message}</div>
                <button id="compatClose" aria-label="Dismiss" style="background:transparent; border:0; color:var(--text-secondary); margin-left:0.6rem; cursor:pointer;">✕</button>
            </div>
        `;
        document.body.appendChild(banner);
        document.getElementById('compatClose').addEventListener('click', function() { banner.remove(); });
    }

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

    // Focus trap helpers
    let _lastFocused = null;
    function trapFocus(container) {
        if (!container) return;
        _lastFocused = document.activeElement;
        const focusables = Array.from(container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        if (focusables.length) focusables[0].focus();

        function focusTrapHandler(e) {
            if (e.key !== 'Tab') return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault(); first.focus();
            }
        }
        container._releaseTrap = () => container.removeEventListener('keydown', focusTrapHandler);
        container.addEventListener('keydown', focusTrapHandler);
    }
    function releaseFocus(container) {
        if (!container) return;
        if (container._releaseTrap) container._releaseTrap();
        if (_lastFocused && typeof _lastFocused.focus === 'function') _lastFocused.focus();
        _lastFocused = null;
    }

    function openMobileNav() {
        if (!menuToggle || !mainNav || !navOverlay) return;
        menuToggle.classList.add('active');
        mainNav.classList.add('active');
        navOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');

        // store and lock scroll without position:fixed hack
        scrollLockState.scrollY = window.scrollY || document.documentElement.scrollTop;
        document.body.classList.add('nav-open');
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';

        try { trapFocus(mainNav); } catch (e) { /* ignore */ }
        const closeBtn = document.getElementById('navClose');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function closeMobileNav() {
        if (!menuToggle || !mainNav || !navOverlay) return;
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        navOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');

        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
        document.body.style.touchAction = '';

        try { releaseFocus(mainNav); } catch (e) { /* ignore */ }

        const s = parseInt(document.body.dataset.scrollY || String(scrollLockState.scrollY || 0), 10) || 0;
        window.scrollTo(0, s);
        delete document.body.dataset.scrollY;
    }

    // Toggle uses pointer to avoid duplicate touch/click handlers
    function toggleMobileNav() {
        if (!menuToggle) return;
        if (menuToggle.classList.contains('active')) closeMobileNav(); else openMobileNav();
    }

    if (menuToggle) {
        menuToggle.addEventListener('pointerup', (e) => { e.preventDefault(); toggleMobileNav(); });
        // Ensure it's a true button for accessibility
        if (!menuToggle.hasAttribute('type')) menuToggle.setAttribute('type', 'button');
    }

    // Overlay and close handlers use pointer events to avoid double triggers
    if (navOverlay) navOverlay.addEventListener('pointerup', (e) => { e.preventDefault(); closeMobileNav(); });
    const navClose = document.getElementById('navClose');
    if (navClose) navClose.addEventListener('pointerup', (e) => { e.preventDefault(); closeMobileNav(); });

    // Close nav on link click when in mobile width
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => { if (window.innerWidth <= 768) closeMobileNav(); });
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

    // Schedule non-critical work during idle periods to reduce main-thread blocking
    function scheduleNonCritical(callback) {
        if ('requestIdleCallback' in window) {
            try { requestIdleCallback(callback, { timeout: 2000 }); return; } catch (e) {}
        }
        // fallback to setTimeout
        setTimeout(callback, 1500);
    }

    // ========== Scroll Animations (Fade In) ==========
    function initFadeInObserver() {
        const fadeElements = document.querySelectorAll('.fade-in');

        // If IntersectionObserver is supported, use it; otherwise reveal elements immediately.
        if ('IntersectionObserver' in window) {
            try {
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
            } catch (err) {
                console.warn('IntersectionObserver initialization failed — falling back to immediate reveal.', err);
                fadeElements.forEach(el => el.classList.add('visible'));
                document.documentElement.classList.add('no-intersection');
            }
        } else {
            // Reveal immediately for environments without IntersectionObserver
            fadeElements.forEach(el => el.classList.add('visible'));
            document.documentElement.classList.add('no-intersection');
        }
    }

    scheduleNonCritical(initFadeInObserver);

    // Buttons hover subtle scale animation (non-critical)
    scheduleNonCritical(() => {
        const buttons = document.querySelectorAll('.btn, .filter-btn, .community-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = this.style.transform.replace('scale(1)', '') + ' scale(1.02)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = this.style.transform.replace(' scale(1.02)', '');
            });
        });
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

    // Defensive initialization: ensure nav is closed and inline styles cleared to avoid stuck state on some devices
    try {
        if (mainNav) {
            mainNav.classList.remove('active','open','show');
            mainNav.setAttribute('aria-hidden','true');
            mainNav.style.transform = '';
            mainNav.style.right = '';
        }
        if (navOverlay) {
            navOverlay.classList.remove('active','show','visible');
            navOverlay.style.opacity = '0';
            navOverlay.style.visibility = 'hidden';
            navOverlay.style.pointerEvents = 'none';
        }
        if (menuToggle) menuToggle.setAttribute('aria-expanded','false');
    } catch (e) { console.warn('Nav defensive init failed', e); }

    // ========== Keyboard Navigation ==========
    document.addEventListener('keydown', function(e) {
        // Close mobile nav on Escape && mainNav
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
