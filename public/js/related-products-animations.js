// Related Products Scroll Animations
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-animate classes to related products elements
    const relatedProductsHeader = document.querySelector('.related-products h2');
    const relatedProductsGrid = document.querySelector('.related-products .product-grid');
    
    if (relatedProductsHeader) {
        relatedProductsHeader.classList.add('scroll-animate');
    }
    
    if (relatedProductsGrid) {
        relatedProductsGrid.classList.add('scroll-animate');
    }

    // Handle dynamically loaded product cards
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check for product cards
                    if (node.classList && node.classList.contains('product-card')) {
                        node.classList.add('scroll-animate');
                        if (window.scrollAnimations) {
                            window.scrollAnimations.observer.observe(node);
                        }
                    }
                    
                    // Check child elements for product cards
                    const productCards = node.querySelectorAll ? node.querySelectorAll('.product-card') : [];
                    productCards.forEach(card => {
                        card.classList.add('scroll-animate');
                        if (window.scrollAnimations) {
                            window.scrollAnimations.observer.observe(card);
                        }
                    });
                }
            });
        });
    });

    // Observe the related products grid for dynamically loaded content
    if (relatedProductsGrid) {
        observer.observe(relatedProductsGrid, {
            childList: true,
            subtree: true
        });
    }

    // Initialize scroll animations if the main script is available
    if (window.scrollAnimations) {
        window.scrollAnimations.observeElements();
    }
});
