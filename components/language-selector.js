/**
 * Language Selector Popup
 * Manages the language selection popup and redirect functionality.
 */
class LanguageSelector {
    constructor() {
        // Language data with Japanese and local language names, and external links
        this.languages = [
            { code: 'en', name: '英語', localName: 'English', link: 'https://chronie-shizutoki.github.io/self-info-en' },
            { code: 'ja', name: '日本語', localName: '日本語', link: 'https://self-info-ja.netlify.app/' },
            { code: 'zh-CN', name: '中国語（簡体字）', localName: '简体中文（中国大陆）', link: 'https://chronie-shizutoki-self-info-zh-cn.netlify.app/' },
            { code: 'zh-MY', name: '中国語（マレーシア）', localName: '华语（马来西亚）', link: 'https://chronie-shizutoki.github.io/self-info-zh-myY/' },
            { code: 'zh-SG', name: '中国語（シンガポール）', localName: '华语（新加坡）', link: 'https://chronie-shizutoki.github.io/self-info-zh-sg/' },
            { code: 'zh-TW', name: '中国語（繁体字）', localName: '繁體中文（台灣）', link: 'https://chronie-shizutoki.github.io/self-info-zh-tw/' },
        ];
        
        // Initialize the language selector
        this.init();
    }
    
    /**
     * Initializes the language selector by creating the button and popup elements.
     */
    init() {
        // Create language selector button
        this.createLanguageButton();
        
        // Create language popup
        this.createLanguagePopup();
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    /**
     * Creates the language selector button and adds it to the DOM.
     */
    createLanguageButton() {
        const button = document.createElement('button');
        button.id = 'language-button';
        button.className = 'language-button';
        button.innerHTML = '🌐 あ/A';
        
        // Style the button to match the glass effect theme
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '20px';
        button.style.background = 'rgba(255, 255, 255, 0.2)';
        button.style.backdropFilter = 'blur(10px)';
        button.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        button.style.color = '#ffffff';
        button.style.fontFamily = 'KleeOne-Regular, system-ui, sans-serif';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.transition = 'all 0.3s ease';
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        
        // Add touch feedback for mobile devices
        button.style.touchAction = 'manipulation';
        button.style.webkitTapHighlightColor = 'transparent';
        
        // Add media query for mobile devices
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 600px) {
                #language-button {
                    padding: 8px 16px !important;
                    font-size: 14px !important;
                    top: 15px !important;
                    right: 15px !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(button);
        this.button = button;
    }
    
    /**
     * Creates the language selection popup and adds it to the DOM.
     */
    createLanguagePopup() {
        const popup = document.createElement('div');
        popup.id = 'language-popup';
        popup.className = 'language-popup hidden';
        
        // Style the popup with glass effect
        popup.style.position = 'fixed';
        popup.style.top = '70px';
        popup.style.right = '20px';
        popup.style.width = '200px';
        popup.style.maxWidth = '90vw';
        popup.style.maxHeight = '80vh'; // Limit height for mobile devices
        popup.style.padding = '20px';
        popup.style.borderRadius = '24px';
        popup.style.background = 'rgba(255, 255, 255, 0.15)';
        popup.style.backdropFilter = 'blur(25px) saturate(180%)';
        popup.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        popup.style.zIndex = '1001';
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        popup.style.transform = 'translateY(-10px)';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.gap = '15px';
        popup.style.overflowY = 'auto'; // Enable vertical scrolling
        
        // Customize scrollbar for the popup
        popup.style.scrollbarWidth = 'thin';
        popup.style.scrollbarColor = 'rgba(255, 255, 255, 0.3) transparent';
        
        // Add languages to the popup
        this.languages.forEach(lang => {
            const languageItem = document.createElement('a');
            languageItem.href = lang.link;
            languageItem.target = '_blank';
            languageItem.className = 'language-item';
            
            // Style the language item
            languageItem.style.display = 'block';
            languageItem.style.padding = '12px 15px';
            languageItem.style.borderRadius = '12px';
            languageItem.style.background = 'rgba(255, 255, 255, 0.1)';
            languageItem.style.color = '#ffffff';
            languageItem.style.textDecoration = 'none';
            languageItem.style.transition = 'all 0.3s ease';
            languageItem.style.whiteSpace = 'nowrap';
            languageItem.style.overflow = 'hidden';
            languageItem.style.textOverflow = 'ellipsis';
            
            // Add hover effect for desktop
            languageItem.addEventListener('mouseenter', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.2)';
                languageItem.style.transform = 'translateX(5px)';
            });
            
            languageItem.addEventListener('mouseleave', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.1)';
                languageItem.style.transform = 'translateX(0)';
            });
            
            // Add touch effect for mobile
            languageItem.addEventListener('touchstart', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.2)';
                languageItem.style.transform = 'translateX(5px)';
            });
            
            languageItem.addEventListener('touchend', () => {
                languageItem.style.background = 'rgba(255, 255, 255, 0.1)';
                languageItem.style.transform = 'translateX(0)';
            });
            
            // Add language names
            languageItem.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 4px; font-size: 16px;">${lang.name}</div>
                <div style="font-size: 14px; opacity: 0.8;">${lang.localName}</div>
            `;
            
            popup.appendChild(languageItem);
        });
        
        document.body.appendChild(popup);
        this.popup = popup;
    }
    
    /**
     * Sets up event listeners for the language selector.
     */
    setupEventListeners() {
        // Toggle popup on button click
        this.button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from closing the popup immediately
            this.togglePopup();
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && e.target !== this.button) {
                this.hidePopup();
            }
        });
        
        // Close popup when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hidePopup();
            }
        });
        
        // Add animation for showing/hiding
        this.popup.addEventListener('transitionend', () => {
            if (this.popup.classList.contains('hidden')) {
                this.popup.style.display = 'none';
            }
        });
        
        // Make popup accessible by keyboard navigation
        this.button.setAttribute('aria-haspopup', 'true');
        this.button.setAttribute('aria-expanded', 'false');
    }
    
    /**
     * Toggles the visibility of the language popup.
     */
    togglePopup() {
        if (this.popup.classList.contains('hidden')) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
    }
    
    /**
     * Shows the language popup with animation.
     */
    showPopup() {
        this.popup.classList.remove('hidden');
        this.popup.style.display = 'flex';
        // Trigger reflow before animating
        void this.popup.offsetWidth;
        this.popup.style.opacity = '1';
        this.popup.style.transform = 'translateY(0)';
        this.button.setAttribute('aria-expanded', 'true');
        
        // Prevent body from scrolling when popup is open
        document.body.style.overflow = 'hidden';
    }
    
    /**
     * Hides the language popup with animation.
     */
    hidePopup() {
        this.popup.style.opacity = '0';
        this.popup.style.transform = 'translateY(-10px)';
        this.popup.classList.add('hidden');
        this.button.setAttribute('aria-expanded', 'false');
        
        // Allow body to scroll again when popup is closed
        document.body.style.overflow = '';
    }
}

// Initialize the language selector when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageSelector();
});