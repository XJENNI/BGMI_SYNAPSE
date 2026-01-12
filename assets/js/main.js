/**
 * Main JS for Synapse BGMI Website - Optimized for Mobile
 */

// Remove no-js class if JavaScript is enabled
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('reduce-motion');

(() => {
    const init = () => {
        // 1. Elements
        const body = document.body;
        const preloader = document.getElementById("preloader");
        const menuToggle = document.getElementById("menuToggle");
        const mainNav = document.getElementById("mainNav");
        const navOverlay = document.getElementById("navOverlay");
        const navClose = document.getElementById("navClose");
        const header = document.querySelector(".site-header") || document.getElementById("header");
    
    // 1a. FORCE RESET ON LOAD - This ensures every page starts fresh, removing any stuck blur/overlay
    body.classList.remove("nav-open", "menu-open", "no-scroll", "blur-active", "no-scroll-lock");
    if (mainNav) mainNav.classList.remove("active", "show", "open");
    if (navOverlay) navOverlay.classList.remove("active", "show", "visible");
    document.documentElement.style.overflow = ""; // Restore scrolling
    document.body.style.overflow = ""; // Restore body scrolling
    
    // 2. Preloader - Optimized for Speed (short safety net)
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
            }, 300);
        }
    };

    if (preloader) {
        // Hide ASAP and also after load as a safety net
        hidePreloader();
        window.addEventListener("load", hidePreloader, { once: true });
        setTimeout(hidePreloader, 200);
    }

    // 3. Navigation Controls
    const openMobileNav = () => {
        if (!mainNav) return;
        mainNav.classList.add("active");
        mainNav.setAttribute("aria-hidden", "false");
        if (navClose) {
            try { navClose.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
        }

        // show overlay and lock scroll
        if (navOverlay) navOverlay.classList.add("active");
        if (menuToggle) {
            menuToggle.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
        }

        body.classList.add("nav-open");
        // Lock page scrolling simply
        document.body.style.overflow = "hidden";
    };

    const closeMobileNav = (options = {}) => {
        if (!mainNav) return;
        mainNav.classList.remove("active", "open", "show");
        mainNav.setAttribute("aria-hidden", "true");

        if (navOverlay) navOverlay.classList.remove("active", "show", "visible");

        if (menuToggle) {
            menuToggle.classList.remove("active", "open");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        // Remove known body classes that can cause blur or no-scroll issues
        body.classList.remove("nav-open", "menu-open", "no-scroll", "blur-active", "no-scroll-lock");

        // Restore page scrolling
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    };

    const toggleMobileNav = () => {
        if (mainNav && mainNav.classList.contains("active")) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    };

    // 4. Navigation Event Listeners (Support both click and touch)
    if (menuToggle) {
        menuToggle.dataset.bound = "1";
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
            menuToggle.dataset.clicked = "1";
        });
    }

    if (navClose) {
        navClose.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileNav();
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener("click", (e) => {
            e.preventDefault();
            closeMobileNav();
        });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mainNav && mainNav.classList.contains("active")) {
            closeMobileNav();
        }
    });

    // Handle internal nav link clicks (close menu) — robust for anchor links
    const navLinks = document.querySelectorAll(".nav-link, .nav-item a, .nav-list a");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Close menu immediately
            closeMobileNav();

            // If this is an in-page anchor (href starts with '#'), let the browser jump, but ensure focus/scroll is handled
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Small timeout to allow the menu to close before the page jumps
                setTimeout(() => {
                    // Use location.hash so anchor jump occurs on single-page
                    window.location.hash = href;
                }, 20);
            }
        });
    });

    // 5. Header Scroll Effect
    const handleHeaderScroll = () => {
        if (header && window.scrollY > 50) {
            header.classList.add("scrolled");
        } else if (header) {
            header.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleHeaderScroll);
    handleHeaderScroll(); 

    // 6. Active Page Link Detection
    const setActiveNavLink = () => {
        const currentPath = window.location.pathname;
        const page = currentPath.split("/").pop() || "index.html";
        
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === page || (page === "index.html" && href === "#")) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    };
    setActiveNavLink();

    // ========== Registration Banner Insert & Controls ==========
    function setupRegistrationBanner() {
        const REG_KEY = 'synapse_reg_closed_v1';
        if (typeof window === 'undefined' || !document) return;

        const banner = document.getElementById('registrationBanner');
        if (!banner) return;

        // If the banner was previously closed, remove it immediately to avoid showing a non-interactive banner
        if (localStorage.getItem(REG_KEY) === '1') {
            banner.remove();
            document.body.classList.remove('registration-visible');
            document.documentElement.style.removeProperty('--reg-banner-height');
            return;
        }

        const closeBtn = banner.querySelector('.registration-close');
        const closeHandler = (e) => {
            if (e && e.preventDefault) e.preventDefault();
            banner.classList.add('closing');
            setTimeout(() => {
                banner.remove();
                document.body.classList.remove('registration-visible');
                document.documentElement.style.removeProperty('--reg-banner-height');
            }, 220);
            try { localStorage.setItem(REG_KEY, '1'); } catch (err) { /* ignore storage errors */ }
        };

        if (closeBtn) {
            closeBtn.addEventListener('click', closeHandler);
            // support pointer devices and touch for immediate response (prevent default to avoid focus delay)
            closeBtn.addEventListener('pointerdown', (ev) => { ev.preventDefault && ev.preventDefault(); closeHandler(ev); });
            closeBtn.addEventListener('touchstart', (ev) => { ev.preventDefault && ev.preventDefault(); closeHandler(ev); }, { passive: false });
            // keyboard accessibility (Enter / Space)
            closeBtn.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
                    ev.preventDefault && ev.preventDefault();
                    closeHandler(ev);
                }
            });
            // ensure the element is treated as a button if markup changes
            if (!closeBtn.getAttribute('type')) closeBtn.setAttribute('type', 'button');
        }

        // Push page content down while banner is visible (avoid overlap)
        const applyBannerSpacing = () => {
            const rect = banner.getBoundingClientRect();
            // if banner appears near the top, apply top spacing; if it is at bottom (mobile), remove spacing
            if (rect.top < window.innerHeight / 2) {
                document.documentElement.style.setProperty('--reg-banner-height', `${Math.ceil(rect.height)}px`);
                document.body.classList.add('registration-visible');
            } else {
                document.body.classList.remove('registration-visible');
                document.documentElement.style.removeProperty('--reg-banner-height');
            }
        };
        applyBannerSpacing();
        // recompute on resize and when layout may change
        window.addEventListener('resize', applyBannerSpacing);

        // Observe body class changes to hide banner when nav opens
        const obs = new MutationObserver(() => {
            if (document.body.classList.contains('nav-open')) banner.style.display = 'none';
            else banner.style.display = '';
            // also re-evaluate placement
            applyBannerSpacing();
        });
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // call it after DOM is ready
    setTimeout(setupRegistrationBanner, 60);
    // setup contact tab
    setTimeout(setupContactTab, 60);
    // small registration toast popup (show once per user)
    setTimeout(setupRegistrationToast, 900);

    // ========== Contact Tab ==========
    function setupContactTab() {
        const tab = document.getElementById('contactTab');
        if (!tab) return;
        const toggle = document.getElementById('contactToggle');
        const panel = document.getElementById('contactPanel');

        const closePanel = () => {
            tab.classList.remove('open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
            if (panel) panel.setAttribute('aria-hidden', 'true');
            // return focus to toggle for keyboard users
            if (toggle) toggle.focus();
        };

        const openPanel = () => {
            tab.classList.add('open');
            if (toggle) toggle.setAttribute('aria-expanded', 'true');
            if (panel) panel.setAttribute('aria-hidden', 'false');
            // Focus first actionable element inside panel for accessibility
            setTimeout(() => {
                if (!panel) return;
                const firstAction = panel.querySelector('.contact-whatsapp, .contact-phone, .contact-card a');
                if (firstAction) firstAction.focus();
            }, 260);
        };

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (tab.classList.contains('open')) closePanel(); else openPanel();
            });
            // Ensure no duplicate events
            toggle.addEventListener('keydown', (ev) => { 
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    toggle.click();
                }
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (tab.classList.contains('open') && !tab.contains(e.target)) {
                closePanel();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && tab.classList.contains('open')) closePanel();
        });
    }

    // ========== Registration Toast ==========
    function setupRegistrationToast() {
        const toast = document.getElementById('regToast');
        const closeBtn = document.getElementById('regToastClose');
        const SHOWN_KEY = 'synapse_reg_toast_shown_v1';
        if (!toast) return;
        // don't show repeatedly if user already closed it
        if (localStorage.getItem(SHOWN_KEY)) return;

        const show = () => {
            toast.classList.add('visible');
        };
        const hide = () => {
            toast.classList.remove('visible');
            try { localStorage.setItem(SHOWN_KEY, '1'); } catch (err) { /* ignore */ }
        };

        // show after a short delay if not shown before
        setTimeout(show, 1500);
        // auto hide after 9s
        const timer = setTimeout(hide, 10500);

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                hide();
                clearTimeout(timer);
            });
        }

        // if user clicks the register link, mark as shown and let link open
        toast.addEventListener('click', (e) => {
            if (e.target && e.target.tagName === 'A') {
                try { localStorage.setItem(SHOWN_KEY, '1'); } catch (err) { }
                hide();
            }
        });
    }

    // 7. Reveal Animations on Scroll - Using IntersectionObserver for Performance
    const setupScrollAnimations = () => {
        const revealElements = document.querySelectorAll(".fade-in, .slide-up");
        if (!revealElements.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -40px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    // Once animated, we don't need to observe it anymore
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    };

        // Initial setup
        setupScrollAnimations();
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
