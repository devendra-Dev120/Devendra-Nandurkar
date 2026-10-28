
/* =========================
   MOBILE MENU
========================= */

function initializeMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) {
        console.error("Mobile menu elements not found:", {
            menuToggle,
            navMenu
        });
        return;
    }

    function setMenuOpen(open) {
        navMenu.classList.toggle("active", open);

        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute(
            "aria-label",
            open ? "Close menu" : "Open menu"
        );

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !open);
            icon.classList.toggle("fa-xmark", open);
        }

        console.log("Mobile menu open:", open);
    }

    // Avoid registering duplicate handlers if initialization runs again.
    if (menuToggle.dataset.menuInitialized === "true") return;
    menuToggle.dataset.menuInitialized = "true";

    menuToggle.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = navMenu.classList.contains("active");
        setMenuOpen(!isOpen);
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", function () {
            setMenuOpen(false);
        });
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) {
            setMenuOpen(false);
        }
    });

    setMenuOpen(false);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMobileMenu);
} else {
    initializeMobileMenu();
}

/* =========================
   SHARED DARK/LIGHT MODE
========================= */

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.body.classList.toggle("light-mode", theme === "light");

    if (themeToggle) {
        const icon = themeToggle.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-sun", theme === "light");
            icon.classList.toggle("fa-moon", theme !== "light");
        }
    }
}

// Use the same key as the main portfolio and Sales project
const savedTheme = localStorage.getItem("sujal-theme") || "dark";
applyTheme(savedTheme);

// Save the theme when the toggle is clicked
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const theme = document.body.classList.contains("light-mode")
            ? "dark"
            : "light";

        localStorage.setItem("sujal-theme", theme);
        applyTheme(theme);
    });
}

// Keep theme synchronized if another page changes it
window.addEventListener("storage", (event) => {
    if (event.key === "sujal-theme") {
        applyTheme(event.newValue || "dark");
    }
});


/* =========================
   ACTIVE NAVIGATION FIX
========================= */

const navLinks = document.querySelectorAll(".nav-link");

function getSkillsSection() {
    if (window.innerWidth <= 768) {
        return document.getElementById("skills-mobile") ||
               document.getElementById("skills");
    }

    return document.getElementById("skills");
}

function updateActiveNavigation() {
    let current = "home";

    const sectionIds = [
        "home",
        "about",
        "skills",
        "projects",
        "certificates",
        "contact"
    ];

    for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (!section) continue;

        if (section.getBoundingClientRect().top <= 180) {
            current = id;
        }
    }

    navLinks.forEach(link => {
        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (
            href === "#" + current ||
            (current === "skills-mobile" && href === "#skills")
        ) {
            link.classList.add("active");
        }
    });
}

/* Navigate to the correct Skills section */
navLinks.forEach(link => {
    if (link.getAttribute("href") === "#skills") {
        link.addEventListener("click", function (event) {
            const target = getSkillsSection();

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                history.replaceState(
                    null,
                    "",
                    "#skills"
                );

                updateActiveNavigation();
            }
        });
    }
});

window.addEventListener("scroll", updateActiveNavigation);
window.addEventListener("resize", updateActiveNavigation);
window.addEventListener("load", updateActiveNavigation);

/* =========================
   VIEW MORE CERTIFICATES
========================= */

const viewMoreBtn = document.getElementById("viewMoreCertificatesBtn");
const moreCertificates = document.getElementById("moreCertificates");

if (viewMoreBtn && moreCertificates) {
    viewMoreBtn.addEventListener("click", function () {
        const isExpanded =
            viewMoreBtn.getAttribute("aria-expanded") === "true";

        moreCertificates.hidden = isExpanded;
        viewMoreBtn.setAttribute("aria-expanded", String(!isExpanded));

        const label = viewMoreBtn.querySelector("span");
        if (label) {
            label.textContent = isExpanded
                ? "View More Certificates"
                : "Show Less";
        }

        const icon = viewMoreBtn.querySelector("i");
        if (icon) {
            icon.classList.toggle("fa-chevron-down", isExpanded);
            icon.classList.toggle("fa-chevron-up", !isExpanded);
        }
    });
}


/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        const recipient = "devendranandurkar12@gmail.com";
        const body = `Name: ${name}\n\n${message}`;

        const isAndroid = /Android/i.test(navigator.userAgent);
        const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
            const intentUrl =
                "intent://compose?to=" + encodeURIComponent(recipient) +
                "&subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body) +
                "#Intent;scheme=mailto;package=com.google.android.gm;end";

            window.location.href = intentUrl;
        } else if (isAppleMobile) {
            const gmailUrl =
                "googlegmail://co?to=" + encodeURIComponent(recipient) +
                "&subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            window.location.href = gmailUrl;
        } else {
            const params = new URLSearchParams({
                view: "cm",
                fs: "1",
                to: recipient,
                su: subject,
                body: body
            });

            window.location.href =
                "https://mail.google.com/mail/?" + params.toString();
        }
    });
}
