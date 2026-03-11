// Wholesale Page Contact and Retail Confidence Animations
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll-animate classes to retail confidence section
    const retailConfidenceElements = [
        '.social-proof .section-header',
        '.social-proof .proof-card',
        '.social-proof .proof-header',
        '.social-proof .proof-content',
        '.social-proof .proof-features',
        '.social-proof .feature-item',
        '.social-proof .testimonial',
        '.social-proof .testimonial-content',
        '.social-proof .testimonial-author',
        '.social-proof .instagram-preview',
        '.social-proof .instagram-header',
        '.social-proof .instagram-feed',
        '.social-proof .feed-post',
        '.social-proof .proof-card-link'
    ];

    // Add scroll-animate classes to retail confidence elements
    retailConfidenceElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('scroll-animate');
        });
    });

    // Add scroll-animate classes to contact section elements
    const contactElements = [
        '.wholesale-enquiry-new .section-header',
        '.wholesale-enquiry-new .enquiry-header',
        '.wholesale-enquiry-new .enquiry-features',
        '.wholesale-enquiry-new .feature-item',
        '.wholesale-enquiry-new .quick-contact',
        '.wholesale-enquiry-new .social-links',
        '.wholesale-enquiry-new .enquiry-left',
        '.wholesale-enquiry-new .enquiry-right',
        '.wholesale-enquiry-new .enquiry-form-card',
        '.wholesale-enquiry-new .form-step',
        '.wholesale-enquiry-new .form-group-modern',
        '.wholesale-enquiry-new .checkbox-grid',
        '.wholesale-enquiry-new .checkbox-item',
        '.wholesale-enquiry-new .form-navigation',
        '.wholesale-enquiry-new .next-btn',
        '.wholesale-enquiry-new .submit-btn-modern'
    ];

    // Add scroll-animate classes to contact section elements
    contactElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.classList.add('scroll-animate');
        });
    });

    // Initialize scroll animations if available
    if (window.scrollAnimations) {
        window.scrollAnimations.observeElements();
    }
});
