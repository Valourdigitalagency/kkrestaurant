document.addEventListener("DOMContentLoaded", function () {

    console.log("KK Restaurant JS loaded successfully");

    document.documentElement.classList.add("js-ready");


    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (e) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Close mobile menu
            const navLinks = document.querySelector(".nav-links");

            if (navLinks) {
                navLinks.classList.remove("mobile-open");
            }

        });

    });


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("mobile-open");
        });

    }


    /* =====================================================
       MENU TABS
    ===================================================== */

    const menuTabs = document.querySelectorAll(".menu-tab");
    const menuPanels = document.querySelectorAll(".menu-panel");

    menuTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const target = this.dataset.menu;

            menuTabs.forEach(function (item) {
                item.classList.remove("active");
            });

            menuPanels.forEach(function (panel) {
                panel.classList.remove("active");
            });

            this.classList.add("active");

            const targetPanel =
                document.querySelector(
                    '.menu-panel[data-panel="' + target + '"]'
                );

            if (targetPanel) {
                targetPanel.classList.add("active");
            }

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
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealItems.forEach(function (item) {
            revealObserver.observe(item);
        });

    } else {

        // Browser fallback
        revealItems.forEach(function (item) {
            item.classList.add("show");
        });

    }


    /* =====================================================
       OFFER POPUP
    ===================================================== */

    const offerModal = document.getElementById("offerModal");
    const offerClose = document.getElementById("offerClose");
    const offerBackdrop = document.getElementById("offerBackdrop");
    const offerBook = document.getElementById("offerBook");

    function openOfferPopup() {

        if (!offerModal) return;

        offerModal.classList.add("active");

        console.log("Offer popup opened");
    }

    function closeOfferPopup() {

        if (!offerModal) return;

        offerModal.classList.remove("active");
    }


    /* OPEN AFTER 2 SECONDS */

    if (offerModal) {

        setTimeout(function () {

            openOfferPopup();

        }, 2000);
    }


    /* CLOSE BUTTON */

    if (offerClose) {

        offerClose.addEventListener("click", function () {

            closeOfferPopup();

        });
    }


    /* CLICK BACKDROP */

    if (offerBackdrop) {

        offerBackdrop.addEventListener("click", function () {

            closeOfferPopup();

        });
    }


    /* EXPLORE MENU */

    if (offerBook) {

        offerBook.addEventListener("click", function () {

            closeOfferPopup();

        });
    }


    /* ESCAPE KEY */

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            closeOfferPopup();

        }

    });
    /* =====================================================
       CUSTOM CURSOR
    ===================================================== */

    const cursor = document.getElementById("cursor");

    if (cursor && window.innerWidth > 768) {

        document.addEventListener("mousemove", function (e) {

            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";

        });

        const interactiveElements =
            document.querySelectorAll(
                "a, button, .menu-tab, .special-card, .gallery-card"
            );

        interactiveElements.forEach(function (element) {

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

    const magneticElements =
        document.querySelectorAll(".magnetic");

    magneticElements.forEach(function (element) {

        element.addEventListener("mousemove", function (e) {

            const rect = element.getBoundingClientRect();

            const x =
                e.clientX -
                rect.left -
                rect.width / 2;

            const y =
                e.clientY -
                rect.top -
                rect.height / 2;

            element.style.transform =
                "translate(" +
                x * 0.15 +
                "px, " +
                y * 0.15 +
                "px)";

        });

        element.addEventListener("mouseleave", function () {

            element.style.transform = "";

        });

    });


    /* =====================================================
       CARD TILT
    ===================================================== */

    const cards =
        document.querySelectorAll(".special-card");

    cards.forEach(function (card) {

        card.addEventListener("mousemove", function (e) {

            const rect = card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 8;

            const rotateX =
                ((y / rect.height) - 0.5) * -8;

            card.style.transform =
                "perspective(800px) rotateX(" +
                rotateX +
                "deg) rotateY(" +
                rotateY +
                "deg) translateY(-5px)";

        });

        card.addEventListener("mouseleave", function () {

            card.style.transform = "";

        });

    });


    /* =====================================================
       PARALLAX
    ===================================================== */

    const hero = document.querySelector(".hero");

    if (hero) {

        window.addEventListener("scroll", function () {

            const scrollY = window.scrollY;

            if (scrollY < window.innerHeight) {

                const heroVisual =
                    document.querySelector(".hero-visual");

                if (heroVisual) {

                    heroVisual.style.transform =
                        "translateY(" +
                        scrollY * 0.08 +
                        "px)";

                }

            }

        }, { passive: true });

    }


    /* =====================================================
       NAVBAR SCROLL EFFECT
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    function updateNavbar() {

        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    }

    window.addEventListener(
        "scroll",
        updateNavbar,
        { passive: true }
    );

    updateNavbar();


    /* =====================================================
       IMAGE FALLBACK
    ===================================================== */

    document.querySelectorAll("img").forEach(function (img) {

        img.addEventListener("error", function () {

            this.style.visibility = "hidden";

        });

    });

});
document.addEventListener("DOMContentLoaded", () => {

    const tabs = document.querySelectorAll(".tab");
    const panels = document.querySelectorAll(".panel");

    const menuImage = document.getElementById("menuImage");
    const photoKicker = document.getElementById("photoKicker");
    const photoTitle = document.getElementById("photoTitle");

    tabs.forEach(tab => {

        tab.addEventListener("click", () => {

            const category = tab.dataset.cat;

            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove("active"));

            // Activate clicked tab
            tab.classList.add("active");

            // Hide all panels
            panels.forEach(panel => {
                panel.classList.remove("active");
            });

            // Find selected panel
            const selectedPanel = document.querySelector(
                `.panel[data-panel="${category}"]`
            );

            if (!selectedPanel) {
                console.warn("No menu panel found for:", category);
                return;
            }

            // Show selected panel
            selectedPanel.classList.add("active");

            // Update image
            const image = selectedPanel.dataset.image;
            const kicker = selectedPanel.dataset.kicker;
            const title = selectedPanel.dataset.title;

            if (menuImage && image) {
                menuImage.src = image;
            }

            if (photoKicker && kicker) {
                photoKicker.textContent = kicker;
            }

            if (photoTitle && title) {
                photoTitle.textContent = title;
            }

        });

    });

});