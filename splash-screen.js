/**
 * Manages the splash screen's display and dismissal logic.
 * Ensures a smooth transition and optimal user experience.
 */
class SplashScreen {
    // ✨ NEW: Configuration is moved to the top for easy changes.
    MIN_DISPLAY_TIME = 1500; // Minimum time in ms to display the splash screen.

    constructor(elementId = 'splash-screen') {
        this.splashScreen = document.getElementById(elementId);

        // Handle cases where the element might not exist.
        if (!this.splashScreen) {
            console.error(`Splash screen element with ID "${elementId}" not found.`);
            return;
        }

        this.init();
    }

    /**
     * Initializes the splash screen logic.
     */
    async init() {
        // ✨ NEW: Uses Promise.all for a smarter loading experience.
        // The splash screen will hide only after BOTH the page is fully loaded
        // AND the minimum display time has passed.
        const pageLoadPromise = new Promise(resolve => {
            window.addEventListener('load', resolve, { once: true });
        });

        const minTimePromise = new Promise(resolve => {
            setTimeout(resolve, this.MIN_DISPLAY_TIME);
        });

        await Promise.all([pageLoadPromise, minTimePromise]);

        this.hide();
    }

    /**
     * Hides the splash screen and removes it from the DOM after the transition ends.
     */
    hide() {
        // Add the class to trigger the CSS fade-out transition.
        this.splashScreen.classList.add('hidden');

        // ✨ REFINED: Instead of a fixed setTimeout, we listen for the 'transitionend' event.
        // This ensures the element is removed only after the CSS transition is complete,
        // making the code resilient to changes in CSS animation duration.
        this.splashScreen.addEventListener('transitionend', () => {
            this.splashScreen.remove();
        }, { once: true }); // The listener will automatically remove itself after firing once.
    }
}

// Instantiate the class once the basic document structure is ready.
document.addEventListener('DOMContentLoaded', () => {
    new SplashScreen();
});