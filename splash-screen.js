/**
/*
 * Manages the privacy consent popup display and user interactions.
 * Handles user consent and ensures compliance with privacy regulations.
 */
class PrivacyConsentPopup {
    constructor(elementId = 'splash-screen') {
        this.popup = document.getElementById(elementId);

        // Handle cases where the element might not exist.
        if (!this.popup) {
            console.error(`Privacy consent popup element with ID "${elementId}" not found.`);
            return;
        }

        // Check if user has already consented
        if (this.hasUserConsented()) {
            this.hide();
            // 显示加载屏幕
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.classList.remove('hidden');
                    // 2秒后隐藏加载屏幕
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                    }, 2000);
                }
            }, 500);
            // Initialize analytics if user has already consented
            if (window.initializeAnalytics) {
                window.initializeAnalytics();
            }
            return;
        }

        this.init();
    }

    /**
     * Checks if user has already given consent.
     * @returns {boolean} True if user has consented, false otherwise.
     */
    hasUserConsented() {
        // Check for consent in localStorage
        return localStorage.getItem('privacyConsent') === 'true';
    }

    /**
     * Sets user consent status.
     * @param {boolean} consented - True if user consents, false otherwise.
     */
    setUserConsent(consented) {
        localStorage.setItem('privacyConsent', consented ? 'true' : 'false');
    }

    /**
     * Initializes the privacy consent popup logic.
     */
    init() {
        // Add event listeners to consent buttons
        const acceptButton = document.getElementById('consent-accept');
        const rejectButton = document.getElementById('consent-reject');

        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.handleAccept());
        } else {
            console.error('Accept button not found');
        }

        if (rejectButton) {
            rejectButton.addEventListener('click', () => this.handleReject());
        } else {
            console.error('Reject button not found');
        }
    }

    /**
     * Handles user acceptance of privacy policy.
     */
    handleAccept() {
        this.setUserConsent(true);
        this.hide();

        // Show loading screen after consent
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.remove('hidden');
                // Hide loading screen after some time
                setTimeout(() => {
                    // 仅隐藏加载屏幕而不删除，以便下次访问时可以重新显示
            loadingScreen.classList.add('hidden');
            // 不使用remove()，而是保留元素
                }, 2000); // Show loading screen for 2 seconds
            }
        }, 500);

        // Initialize analytics after user consents
        if (window.initializeAnalytics) {
            window.initializeAnalytics();
        } else {
            console.error('Analytics initialization function not found');
        }

        console.log('User accepted privacy policy');
    }

    /**
     * Handles user rejection of privacy policy.
     */
    handleReject() {
        this.setUserConsent(false);

        // For rejection, redirect the user or show a different message
        // In this case, we'll show a message and then redirect
        this.popup.innerHTML = `
            <div class="splash-content">
                <h3 class="privacy-title">アクセスが制限されました</h3>
                <p class="privacy-text">プライバシーポリシーに同意しない場合、サイトにアクセスできません。</p>
                <p class="privacy-text">5秒後にトップページにリダイレクトします...</p>
            </div>
        `;

        // Redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'about:blank'; // Replace with actual redirect URL
        }, 5000);

        console.log('User rejected privacy policy');
    }

    /**
     * Hides the privacy consent popup and removes it from the DOM after the transition ends.
     */
    hide() {
        // Add the class to trigger the CSS fade-out transition.
        this.popup.classList.add('hidden');

        // Listen for the 'transitionend' event to remove the element
        this.popup.addEventListener('transitionend', () => {
            this.popup.remove();
        }, { once: true });
    }
}

// Instantiate the class once the basic document structure is ready.
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyConsentPopup();
});