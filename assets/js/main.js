/**
 * Main JS for Synapse BGMI Website - Optimized for Mobile
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Elements
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const navOverlay = document.getElementById("navOverlay");
    const navClose = document.getElementById("navClose");
    const header = document.querySelector(".site-header") || document.getElementById("header");
    
    // 2. Preloader - Robust Handling (hide after 3s max)
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = "0";
            setTimeout(() => {
                preloader.style.display = "none";
                if (typeof handleScrollAnimations === "function") handleScrollAnimations();
            }, 500);
        }
    };

    if (preloader) {
        // Hide when window loads or after 3 seconds max
        window.addEventListener("load", hidePreloader);
        setTimeout(hidePreloader, 3000); 
    }

    // 3. Navigation Controls
    const openMobileNav = () => {
        if (!mainNav) return;
        mainNav.classList.add("active");
        mainNav.setAttribute("aria-hidden", "false");
        
        if (navOverlay) navOverlay.classList.add("active");
        if (menuToggle) {
            menuToggle.classList.add("active");
            menuToggle.setAttribute("aria-expanded", "true");
        }
        
        body.classList.add("nav-open");
    };

    const closeMobileNav = (options = {}) => {
        if (!mainNav) return;
        // Remove all potential 'open'/'active' classes used across files
        mainNav.classList.remove("active", "show", "open");
        mainNav.setAttribute("aria-hidden", "true");

        if (navOverlay) {
            navOverlay.classList.remove("active", "show", "visible", "open");
            // reset inline styles if any were used to lock pointer events
            navOverlay.style.pointerEvents = "";
        }

        if (menuToggle) {
            menuToggle.classList.remove("active", "open");
            menuToggle.setAttribute("aria-expanded", "false");
        }

        // Remove known body classes that can cause blur or no-scroll issues
        body.classList.remove("nav-open", "menu-open", "no-scroll", "blur-active", "no-scroll-lock");

        // Re-enable page scrolling explicitly
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
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
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
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

    // 7. Reveal Animations on Scroll
    const handleScrollAnimations = () => {
        const revealElements = document.querySelectorAll(".fade-in, .slide-up");
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", handleScrollAnimations);
});
