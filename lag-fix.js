// =========================================================
// LAG-FIX.JS - PERFORMANCE OPTIMIZER
// =========================================================

(function () {
    'use strict';

    // 1. Temporarily disable pointer events while scrolling to prevent frame drops
    let isScrolling;
    window.addEventListener('scroll', function () {
        if (!document.body.classList.contains('is-scrolling')) {
            document.body.classList.add('is-scrolling');
        }
        
        clearTimeout(isScrolling);
        
        isScrolling = setTimeout(function () {
            document.body.classList.remove('is-scrolling');
        }, 120);
    }, { passive: true });

    // 2. Pause unnecessary CSS animations when the tab is inactive to save system resources
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            document.body.classList.add('pause-animations');
        } else {
            document.body.classList.remove('pause-animations');
        }
    });
})();