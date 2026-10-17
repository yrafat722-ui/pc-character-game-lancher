/* =========================================================
   PC Character Games
   iOS 26 LIQUID GLASS INTERACTIVITY & SETTINGS
   ========================================================= */

// 1. Load and apply initial settings immediately to prevent flickering
function applyInitialSettings() {
    const theme = localStorage.getItem('siteTheme') || 'dark'; //
    const lang = localStorage.getItem('siteLang') || 'ar'; //[cite: 10]
    const accent = localStorage.getItem('siteAccent') || '#00f0ff'; //[cite: 10]

    document.documentElement.setAttribute('data-theme', theme); //[cite: 10]
    document.documentElement.setAttribute('lang', lang); //[cite: 10]
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); //[cite: 10]
    document.documentElement.style.setProperty('--accent-color', accent); //[cite: 10]

    // Toggle body class for Light/Dark Theme CSS rules
    if (theme === 'light') {
        document.body?.classList.add('light-theme');
    } else {
        document.body?.classList.remove('light-theme');
    }
}

// Execute initial settings right away
applyInitialSettings();

// 2. DOM Ready Logic
document.addEventListener('DOMContentLoaded', () => {

    // --- Settings Synchronization ---
    const themeToggle = document.getElementById('themeToggle');
    const langSelect = document.getElementById('langSelect');
    const accentSelect = document.getElementById('accentSelect');

    if (themeToggle) {
        themeToggle.checked = (localStorage.getItem('siteTheme') === 'light'); //[cite: 10]
        themeToggle.addEventListener('change', (e) => {
            const selectedTheme = e.target.checked ? 'light' : 'dark'; //[cite: 10]
            localStorage.setItem('siteTheme', selectedTheme); //[cite: 10]
            document.documentElement.setAttribute('data-theme', selectedTheme); //[cite: 10]
            
            if (selectedTheme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
        });
    }

    if (langSelect) {
        langSelect.value = localStorage.getItem('siteLang') || 'ar'; //[cite: 10]
        langSelect.addEventListener('change', (e) => {
            const selectedLang = e.target.value; //[cite: 10]
            localStorage.setItem('siteLang', selectedLang); //[cite: 10]
            document.documentElement.setAttribute('lang', selectedLang); //[cite: 10]
            document.documentElement.setAttribute('dir', selectedLang === 'ar' ? 'rtl' : 'ltr'); //[cite: 10]
            
            // Recalculate glider position on language/RTL change
            initNavGlider();
        });
    }

    if (accentSelect) {
        accentSelect.value = localStorage.getItem('siteAccent') || '#00f0ff'; //[cite: 10]
        accentSelect.addEventListener('change', (e) => {
            const selectedAccent = e.target.value; //[cite: 10]
            localStorage.setItem('siteAccent', selectedAccent); //[cite: 10]
            document.documentElement.style.setProperty('--accent-color', selectedAccent); //[cite: 10]
        });
    }

    // --- iOS Nav Liquid Glass Glider ---
    initNavGlider();

    // --- Glass Page Transitions ---
    initGlassPageTransitions();
});


/* =========================================================
   NAV GLIDER SLIDING PILL (iOS STYLE)
   ========================================================= */

function initNavGlider() {
    const navLinksContainer = document.querySelector('.nav-links');
    if (!navLinksContainer) return;

    let glider = navLinksContainer.querySelector('.nav-glider');
    
    // Create glider element if missing
    if (!glider) {
        glider = document.createElement('div');
        glider.className = 'nav-glider';
        navLinksContainer.appendChild(glider);
    }

    const links = navLinksContainer.querySelectorAll('a');
    let activeLink = navLinksContainer.querySelector('a.active') || links[0];

    function moveGliderTo(element) {
        if (!element) return;
        const linkRect = element.getBoundingClientRect();
        const containerRect = navLinksContainer.getBoundingClientRect();

        const left = linkRect.left - containerRect.left;
        const top = linkRect.top - containerRect.top;

        glider.style.transform = `translate3d(${left}px, ${top}px, 0)`;
        glider.style.width = `${linkRect.width}px`;
        glider.style.height = `${linkRect.height}px`;
    }

    // Set initial position
    if (activeLink) {
        moveGliderTo(activeLink);
    }

    // Hover events
    links.forEach(link => {
        link.addEventListener('mouseenter', () => moveGliderTo(link));
        link.addEventListener('mouseleave', () => moveGliderTo(activeLink));
        
        link.addEventListener('click', function() {
            links.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            activeLink = this;
            moveGliderTo(this);
        });
    });

    window.addEventListener('resize', () => moveGliderTo(activeLink));
}


/* =========================================================
   GLASS PAGE TRANSITIONS
   ========================================================= */

function initGlassPageTransitions() {
    let transitionOverlay = document.querySelector('.page-glass-transition');
    
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-glass-transition';
        document.body.appendChild(transitionOverlay);
    }

    // Play entrance transition
    transitionOverlay.classList.add('enter');
    setTimeout(() => {
        transitionOverlay.classList.remove('enter');
    }, 750);

    // Intercept local page link clicks
    const pageLinks = document.querySelectorAll('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"])');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.getAttribute('href');
            if (!destination) return;

            e.preventDefault();
            transitionOverlay.classList.add('leave');

            setTimeout(() => {
                window.location.href = destination;
            }, 450);
        });
    });
}