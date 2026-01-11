/**
 * Main JS for Synapse BGMI Website - Optimized for Mobile
 */

// Remove no-js class if JavaScript is enabled
document.documentElement.classList.remove('no-js');

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
    
        // 1a. FORCE RESET ON LOAD - Ensures clean state
        body.classList.remove("nav-open", "menu-open", "no-scroll", "blur-active", "no-scroll-lock");
        if (mainNav) mainNav.classList.remove("active", "show", "open");
        if (navOverlay) navOverlay.classList.remove("active", "show", "visible");
        document.documentElement.style.overflow = "";
        body.style.overflow = "";
        
        // ========== 2. REDESIGNED PRELOADER SYSTEM ==========
        
        /**
         * Preloader Hide Logic - Guaranteed to work
         * Multiple fallback strategies ensure it never gets stuck
         */
        const PreloaderManager = {
            hidden: false,
            
            hide() {
                if (this.hidden || !preloader) return;
                this.hidden = true;
                
                // Step 1: Add hidden class (triggers CSS transition)
                preloader.classList.add('hidden');
                
                // Step 2: Force inline styles (overrides any stuck inline styles)
                preloader.style.opacity = "0";
                preloader.style.visibility = "hidden";
                preloader.style.pointerEvents = "none";
                
                // Step 3: Remove from DOM after transition completes
                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.style.display = "none";
                        // Completely remove element for better performance
                        try {
                            preloader.remove();
                        } catch (e) {
                            // Fallback for older browsers
                            preloader.parentNode.removeChild(preloader);
                        }
                    }
                }, 600); // Wait for CSS transition (400ms) + buffer
            },
            
            forceHide() {
                // Emergency hide - bypasses all transitions
                if (!preloader) return;
                this.hidden = true;
                preloader.style.cssText = "display: none !important; opacity: 0 !important; visibility: hidden !important; pointer-events: none !important;";
                if (preloader.parentNode) {
                    try {
                        preloader.remove();
                    } catch (e) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }
            }
        };
        
        // Strategy 1: Hide on immediate paint (fastest for modern browsers)
        if (preloader) {
            requestAnimationFrame(() => PreloaderManager.hide());
        }
        
        // Strategy 2: Hide on DOMContentLoaded (fallback for slower connections)
        window.addEventListener("DOMContentLoaded", () => PreloaderManager.hide(), { once: true });
        
        // Strategy 3: Hide on full page load (for images/resources)
        window.addEventListener("load", () => PreloaderManager.hide(), { once: true });
        
        // Strategy 4: Timed fallback (800ms - reasonable wait time)
        setTimeout(() => PreloaderManager.hide(), 800);
        
        // Strategy 5: Emergency force-hide after 2.5 seconds (absolute safety net)
        setTimeout(() => PreloaderManager.forceHide(), 2500);
        
        // Strategy 6: Hide when user interacts (handles edge cases)
        const userInteractionHide = () => {
            PreloaderManager.hide();
            document.removeEventListener('click', userInteractionHide);
            document.removeEventListener('touchstart', userInteractionHide);
            document.removeEventListener('keydown', userInteractionHide);
        };
        document.addEventListener('click', userInteractionHide, { once: true });
        document.addEventListener('touchstart', userInteractionHide, { once: true, passive: true });
        document.addEventListener('keydown', userInteractionHide, { once: true });

        // 3. Navigation Controls
        const openMobileNav = () => {
            if (!mainNav) return;
            
            body.classList.add("nav-open");
            mainNav.classList.add("active");
            if (navOverlay) navOverlay.classList.add("active");
            
            // Prevent scroll on body
            document.documentElement.style.overflow = "hidden";
            body.style.overflow = "hidden";
            
            // Accessibility
            mainNav.setAttribute("aria-hidden", "false");
            if (menuToggle) {
                menuToggle.classList.add("active");
                menuToggle.setAttribute("aria-expanded", "true");
            }
        };

        const closeMobileNav = () => {
            if (!mainNav) return;
            
            // Remove all possible stuck classes
            body.classList.remove("nav-open", "menu-open", "no-scroll", "blur-active", "no-scroll-lock");
            mainNav.classList.remove("active", "show", "open");
            if (navOverlay) navOverlay.classList.remove("active", "show", "visible");
            
            // Restore scroll - force override any stuck styles
            document.documentElement.style.overflow = "";
            body.style.overflow = "";
            
            // Accessibility
            mainNav.setAttribute("aria-hidden", "true");
            if (menuToggle) {
                menuToggle.classList.remove("active", "open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        };

        // Toggle mobile navigation
        if (menuToggle) {
            menuToggle.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mainNav && mainNav.classList.contains("active")) {
                    closeMobileNav();
                } else {
                    openMobileNav();
                }
            });
        }

        // Close button
        if (navClose) {
            navClose.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeMobileNav();
            });
        }

        // Close when clicking overlay
        if (navOverlay) {
            navOverlay.addEventListener("click", (e) => {
                e.preventDefault();
                closeMobileNav();
            });
        }

        // Close when clicking nav links
        const navLinks = document.querySelectorAll(".nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                closeMobileNav();
            });
        });

        // Close on ESC key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mainNav && mainNav.classList.contains("active")) {
                closeMobileNav();
            }
        });

        // 4. Scroll to Top Button
        const scrollTop = document.getElementById("scrollTop");
        if (scrollTop) {
            const toggleScrollButton = () => {
                if (window.scrollY > 300) {
                    scrollTop.classList.add("visible");
                } else {
                    scrollTop.classList.remove("visible");
                }
            };

            window.addEventListener("scroll", toggleScrollButton);
            scrollTop.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }

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
            const banner = document.getElementById('registrationBanner');
            if (!banner) return;
            
            const closeBtn = banner.querySelector('.registration-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    banner.style.display = 'none';
                    localStorage.setItem('bannerDismissed', 'true');
                });
            }
            
            // Show banner if not dismissed
            if (localStorage.getItem('bannerDismissed') !== 'true') {
                banner.style.display = 'block';
            }
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
                if (toggle) toggle.focus();
            };

            const openPanel = () => {
                tab.classList.add('open');
                if (toggle) toggle.setAttribute('aria-expanded', 'true');
                if (panel) panel.setAttribute('aria-hidden', 'false');
                setTimeout(() => {
                    if (!panel) return;
                    const firstAction = panel.querySelector('.contact-whatsapp, .contact-phone, .contact-card a');
                    if (firstAction) firstAction.focus();
                }, 260);
            };

            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (tab.classList.contains('open')) {
                        closePanel();
                    } else {
                        openPanel();
                    }
                });
            }

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (tab && tab.classList.contains('open') && !tab.contains(e.target)) {
                    closePanel();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && tab && tab.classList.contains('open')) {
                    closePanel();
                }
            });
        }

        // ========== Registration Toast ==========
        function setupRegistrationToast() {
            const toast = document.getElementById('regToast');
            if (!toast) return;

            const closeBtn = document.getElementById('regToastClose');
            
            const showToast = () => {
                toast.classList.add('visible');
            };
            
            const hideToast = () => {
                toast.classList.remove('visible');
                localStorage.setItem('regToastDismissed', 'true');
            };

            if (closeBtn) {
                closeBtn.addEventListener('click', hideToast);
            }

            // Auto-dismiss after 8 seconds
            let autoHideTimer;
            const scheduleAutoHide = () => {
                autoHideTimer = setTimeout(hideToast, 8000);
            };

            // Show toast if not dismissed
            if (localStorage.getItem('regToastDismissed') !== 'true') {
                setTimeout(() => {
                    showToast();
                    scheduleAutoHide();
                }, 1500);
            }

            // Pause auto-hide on hover
            toast.addEventListener('mouseenter', () => {
                if (autoHideTimer) clearTimeout(autoHideTimer);
            });

            toast.addEventListener('mouseleave', scheduleAutoHide);
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
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));
        };

        setupScrollAnimations();
    };

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
