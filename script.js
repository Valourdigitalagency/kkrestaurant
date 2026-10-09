
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    console.log("KK Restaurant JS loaded successfully");
    document.documentElement.classList.add("js-ready");

    /* =====================================================
       SMOOTH SCROLL + MOBILE NAVIGATION
    ===================================================== */

    const navbar = document.querySelector(".navbar");
    const nav = document.querySelector(".nav-inner nav");
    const menuToggle = document.querySelector(".menu-toggle");

    function closeMobileMenu() {
        if (nav) nav.classList.remove("mobile-open");

        if (menuToggle) {
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    }

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", function () {
            const isOpen = nav.classList.toggle("mobile-open");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.getElementById(href.slice(1));

            if (!target) return;

            event.preventDefault();
            closeMobileMenu();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    function updateNavbar() {
        if (!navbar) return;

        navbar.classList.toggle("scrolled", window.scrollY > 50);
    }

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();

    /* =====================================================
       MENU CATEGORY TABS
       Matches your current HTML: .tab and .panel
    ===================================================== */

    const menuTabs = document.querySelectorAll(".tab");
    const menuPanels = document.querySelectorAll(".panel");
    const menuImage = document.getElementById("menuImage");
    const photoKicker = document.getElementById("photoKicker");
    const photoTitle = document.getElementById("photoTitle");

    function activateMenuTab(tab) {
        const category = tab.dataset.cat;

        const selectedPanel = Array.from(menuPanels).find(function (panel) {
            return panel.dataset.panel === category;
        });

        if (!selectedPanel) {
            console.warn("No menu panel found for:", category);
            return;
        }

        menuTabs.forEach(function (item) {
            const active = item === tab;

            item.classList.toggle("active", active);
            item.setAttribute("aria-selected", String(active));
        });

        menuPanels.forEach(function (panel) {
            panel.classList.toggle("active", panel === selectedPanel);
        });

        if (menuImage && selectedPanel.dataset.image) {
            menuImage.style.opacity = "0";

            const newImage = selectedPanel.dataset.image;

            menuImage.onload = function () {
                menuImage.style.opacity = "1";
            };

            menuImage.onerror = function () {
                menuImage.style.opacity = "1";
                console.warn("Menu image could not load:", newImage);
            };

            menuImage.src = newImage;
            menuImage.alt = selectedPanel.dataset.title || category;
        }

        if (photoKicker && selectedPanel.dataset.kicker) {
            photoKicker.textContent = selectedPanel.dataset.kicker;
        }

        if (photoTitle && selectedPanel.dataset.title) {
            photoTitle.textContent = selectedPanel.dataset.title;
        }
    }

    menuTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            activateMenuTab(tab);
        });
    });

    /* =====================================================
       REVEAL ANIMATIONS
    ===================================================== */

    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("show");
        });
    }

    /* =====================================================
       OPENING OFFER POPUP + CONFETTI
       Matches your HTML: #offerPopup
    ===================================================== */

    const popup = document.getElementById("offerPopup");
    const popupModal = popup
        ? popup.querySelector(".offer-modal")
        : null;
    const closeButton = popup
        ? popup.querySelector(".offer-close")
        : null;
    const confettiContainer = popup
        ? popup.querySelector(".offer-confetti")
        : null;
    const offerAction = popup
        ? popup.querySelector(".offer-action")
        : null;

    let popupTimer = null;
    let popupOpen = false;
    let previousFocus = null;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function createConfetti() {
        if (!confettiContainer || reduceMotion) return;

        // Prevent duplicate pieces if the offer is reopened.
        confettiContainer.replaceChildren();

        const colors = [
            "#c9a45c",
            "#efd49a",
            "#fff0c5",
            "#a51e2a",
            "#f7ecdc"
        ];

        const pieceCount = window.innerWidth < 600 ? 35 : 65;

        for (let i = 0; i < pieceCount; i++) {
            const piece = document.createElement("span");

            piece.className = "offer-confetti-piece";
            piece.setAttribute("aria-hidden", "true");

            piece.style.position = "absolute";
            piece.style.top = "-20px";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.width = (5 + Math.random() * 7) + "px";
            piece.style.height = (8 + Math.random() * 9) + "px";
            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
            piece.style.opacity = String(0.7 + Math.random() * 0.3);
            piece.style.pointerEvents = "none";
            piece.style.willChange = "transform, opacity";
            piece.style.animation =
                "offerConfettiFall " +
                (3 + Math.random() * 3) +
                "s linear " +
                (Math.random() * 1.2) +
                "s forwards";

            confettiContainer.appendChild(piece);
        }
    }

    function openOfferPopup() {
        if (!popup || popupOpen) return;

        popupOpen = true;
        previousFocus = document.activeElement;

        popup.classList.add("is-visible");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("offer-open");

        createConfetti();

        if (closeButton) {
            closeButton.focus({ preventScroll: true });
        }

        console.log("KK Restaurant offer opened");
    }

    function closeOfferPopup() {
        if (!popup || !popupOpen) return;

        popupOpen = false;

        popup.classList.remove("is-visible");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("offer-open");

        if (confettiContainer) {
            confettiContainer.replaceChildren();
        }

        if (previousFocus && typeof previousFocus.focus === "function") {
            previousFocus.focus({ preventScroll: true });
        }
    }

    if (popup) {
        // Show the offer shortly after the website loads.
        popupTimer = window.setTimeout(openOfferPopup, 1800);

        if (closeButton) {
            closeButton.addEventListener("click", closeOfferPopup);
        }

        // Close if the visitor clicks outside the modal.
        popup.addEventListener("click", function (event) {
            if (
                event.target === popup ||
                (confettiContainer && event.target === confettiContainer)
            ) {
                closeOfferPopup();
            }
        });

        // Clicking Explore Menu closes the offer.
        if (offerAction) {
            offerAction.addEventListener("click", function () {
                closeOfferPopup();
            });
        }

        // Escape closes the popup.
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && popupOpen) {
                closeOfferPopup();
            }

            // Keep keyboard focus inside the open dialog.
            if (
                event.key === "Tab" &&
                popupOpen &&
                popupModal
            ) {
                const focusable = popupModal.querySelectorAll(
                    'a[href], button:not([disabled]), ' +
                    'input:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                if (!focusable.length) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                ) {
                    event.preventDefault();
                    first.focus();
                }
            }
        });
    }

    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const cursor = document.getElementById("cursor");

    if (
        cursor &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
        document.addEventListener("mousemove", function (event) {
            cursor.style.left = event.clientX + "px";
            cursor.style.top = event.clientY + "px";
        });

        document.querySelectorAll(
            "a, button, .special-card, .ritual-card"
        ).forEach(function (element) {
            element.addEventListener("mouseenter", function () {
                cursor.classList.add("cursor-hover");
            });

            element.addEventListener("mouseleave", function () {
                cursor.classList.remove("cursor-hover");
            });
        });
    }

    /* =====================================================
       MAGNETIC BUTTONS
    ===================================================== */

    if (!reduceMotion) {
        document.querySelectorAll(".magnetic").forEach(function (element) {
            element.addEventListener("mousemove", function (event) {
                if (window.innerWidth <= 768) return;

                const rect = element.getBoundingClientRect();
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                element.style.transform =
                    "translate(" + x * 0.12 + "px, " +
                    y * 0.12 + "px)";
            });

            element.addEventListener("mouseleave", function () {
                element.style.transform = "";
            });
        });
    }

    /* =====================================================
       SIGNATURE CARD TILT
    ===================================================== */

    if (!reduceMotion && window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches) {
        document.querySelectorAll(".special-card").forEach(function (card) {
            card.addEventListener("mousemove", function (event) {
                const rect = card.getBoundingClientRect();

                if (!rect.width || !rect.height) return;

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY = ((x / rect.width) - 0.5) * 6;
                const rotateX = ((y / rect.height) - 0.5) * -6;

                card.style.transform =
                    "perspective(800px) rotateX(" + rotateX +
                    "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
            });
        });
    }

    /* =====================================================
       IMAGE FALLBACK
       Try data-fallback before hiding a broken image.
    ===================================================== */

    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            const fallback = this.dataset.fallback;

            if (fallback && !this.dataset.fallbackTried) {
                this.dataset.fallbackTried = "true";
                this.src = fallback;
                return;
            }

            this.style.visibility = "hidden";
            console.warn("Image could not load:", this.src);
        });
    });

    /* =====================================================
       CLEANUP
    ===================================================== */

    window.addEventListener("pagehide", function () {
        if (popupTimer !== null) {
            window.clearTimeout(popupTimer);
        }
    });

});