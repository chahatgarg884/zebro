// Scroll Animations - Elements appear when scrolling into view
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set(); // Track which elements have been animated
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
        this.init();
    }

    init() {
        // Simple scroll-based animation system
        this.checkElementsOnScroll();
        
        // Listen for scroll events with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.checkElementsOnScroll();
            }, 50); // Throttle scroll events
        });

        // Initial check
        setTimeout(() => this.checkElementsOnScroll(), 100);
    }

    checkElementsOnScroll() {
        const currentScrollY = window.scrollY;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';
        this.lastScrollY = currentScrollY;

        const elements = document.querySelectorAll('.scroll-animate');
        const viewportHeight = window.innerHeight;
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const isInViewport = elementCenter > 0 && elementCenter < viewportHeight;
            
            if (isInViewport) {
                // Element is in viewport - add fade-in
                element.classList.add('fade-in');
                this.animatedElements.add(element);
            } else if (this.scrollDirection === 'up' && this.animatedElements.has(element)) {
                // Element scrolled out of view while scrolling up - remove fade-in for re-animation
                element.classList.remove('fade-in');
                this.animatedElements.delete(element);
            }
        });
    }

    // Manual method to trigger animation for specific element
    animateElement(element) {
        if (element && element.classList.contains('scroll-animate')) {
            element.classList.add('fade-in');
            this.animatedElements.add(element);
        }
    }

    // Manual method to reset animation for specific element
    resetElement(element) {
        if (element && element.classList.contains('scroll-animate')) {
            element.classList.remove('fade-in');
            this.animatedElements.delete(element);
        }
    }

    // Refresh all animations
    refresh() {
        this.animatedElements.clear();
        this.checkElementsOnScroll();
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});

// Utility functions for manual control
window.animateOnScroll = {
    animate: (element) => {
        if (window.scrollAnimations) {
            window.scrollAnimations.animateElement(element);
        }
    },
    reset: (element) => {
        if (window.scrollAnimations) {
            window.scrollAnimations.resetElement(element);
        }
    },
    refresh: () => {
        if (window.scrollAnimations) {
            window.scrollAnimations.refresh();
        }
    }
};
