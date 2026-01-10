/**
 * Main JS for Synapse BGMI Website
 * Cleaned and Consolidated Version
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
    
    // 2. Preloader
    if (preloader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                    // Trigger scroll animation check on load after preloader
                    if (typeof handleScrollAnimations === "function") handleScrollAnimations();
                }, 500);
            }, 1000);
        });
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
        
        // Trap focus to close button
        if (navClose) {
            setTimeout(() => navClose.focus(), 100);
        }
    };

    const closeMobileNav = () => {
        if (!mainNav) return;
        mainNav.classList.remove("active");
        mainNav.setAttribute("aria-hidden", "true");
        
        if (navOverlay) navOverlay.classList.remove("active");
        if (menuToggle) {
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
        
        body.classList.remove("nav-open");
    };

    const toggleMobileNav = () => {
        if (!mainNav) return;
        if (mainNav.classList.contains("active")) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    };

    // 4. Navigation Event Listeners
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

    // Handle internal nav link clicks (close menu)
    const navLinks = document.querySelectorAll(".nav-link, .nav-item a, .nav-list a");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mainNav && mainNav.classList.contains("active")) {
                closeMobileNav();
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
    handleHeaderScroll(); // Call once on load

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
