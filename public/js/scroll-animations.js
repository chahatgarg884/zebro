// Scroll Animations - Elements appear when scrolling into view
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        // Create Intersection Observer for scroll animations
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add fade-in class when element comes into view
                    entry.target.classList.add('fade-in');
                    
                    // Optional: Stop observing after animation
                    if (entry.target.dataset.once === 'true') {
                        this.observer.unobserve(entry.target);
                    }
                } else {
                    // Remove fade-in class when element goes out of view (optional)
                    if (entry.target.dataset.once !== 'true') {
                        entry.target.classList.remove('fade-in');
                    }
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element comes into view
        });

        // Start observing all elements with scroll-animate class
        this.observeElements();
        
        // Observe dynamically added elements
        this.observeDynamicElements();
    }

    observeElements() {
        const elements = document.querySelectorAll('.scroll-animate');
        elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    observeDynamicElements() {
        // Watch for new elements being added to the DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the new element or its children have scroll-animate class
                        const scrollElements = node.querySelectorAll ? 
                            node.querySelectorAll('.scroll-animate') : [];
                        
                        if (node.classList && node.classList.contains('scroll-animate')) {
                            scrollElements.push(node);
                        }
                        
                        scrollElements.forEach(element => {
                            this.observer.observe(element);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Manual method to trigger animation for specific element
    animateElement(element) {
        if (element && element.classList.contains('scroll-animate')) {
            element.classList.add('fade-in');
        }
    }

    // Manual method to reset animation for specific element
    resetElement(element) {
        if (element && element.classList.contains('scroll-animate')) {
            element.classList.remove('fade-in');
        }
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
            window.scrollAnimations.observeElements();
        }
    }
};
