// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Go to category page with all products
function goToCategory(category) {
    // Store category data in localStorage
    localStorage.setItem('selectedCategory', category);

    // Navigate directly to category page - products will load there
    window.location.href = 'category.html';
}

// Load all products for a specific category
async function loadAllProductsForCategory(category) {
    try {
        // Fetch from combined products file
        const response = await fetch('combined_products.json');
        if (!response.ok) {
            throw new Error('Failed to load combined products data');
        }

        const allProducts = await response.json();

        // Process products and add folder paths
        const processedProducts = allProducts.map(product => {
            // Use exact product name for folder path (preserve spaces)
            const folderPath = `extracted_images_0/${product.name}`;

            return {
                ...product,
                folderPath: folderPath
            };
        });

        // Filter products by category
        const filteredProducts = processedProducts.filter(product => product.category === category);

        // Store filtered products in localStorage
        localStorage.setItem('categoryProducts', JSON.stringify(filteredProducts));

    } catch (error) {
        console.error('Error loading products:', error);
        localStorage.setItem('categoryProducts', JSON.stringify([]));
    }
}

// Multi-step form functions
let currentStep = 1;

function nextStep() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const formTitle = document.getElementById('form-title');
    const backBtn = document.querySelector('.back-btn-small');
    
    // Validate step 1
    const requiredFields = step1.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            
            // Remove error class after user starts typing
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                }
            }, { once: true });
        }
    });
    
    if (!isValid) {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please fill in all required fields';
        errorMsg.style.cssText = 'color: #dc2626; font-size: 14px; margin-top: 10px; text-align: center;';
        
        // Remove existing error message if any
        const existingMsg = step1.querySelector('.error-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        step1.appendChild(errorMsg);
        
        // Auto-remove error message after 5 seconds
        setTimeout(() => {
            if (errorMsg.parentNode) {
                errorMsg.remove();
            }
        }, 5000);
        
        return;
    }
    
    // Hide step 1, show step 2
    step1.style.display = 'none';
    step2.style.display = 'block';
    
    // Update form title
    formTitle.textContent = 'Product Requirements';
    
    // Show back button
    if (backBtn) {
        backBtn.style.display = 'flex';
    }
    
    currentStep = 2;
}

function previousStep() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const formTitle = document.getElementById('form-title');
    const backBtn = document.querySelector('.back-btn-small');
    
    // Hide step 2, show step 1
    step2.style.display = 'none';
    step1.style.display = 'block';
    
    // Update form title
    formTitle.textContent = 'Business Details';
    
    // Hide back button
    if (backBtn) {
        backBtn.style.display = 'none';
    }
    
    currentStep = 1;
}

// Handle wholesale enquiry form submission
function handleWholesaleEnquiry(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Get selected products
    const productCheckboxes = document.querySelectorAll('input[name="products"]:checked');
    const selectedProducts = Array.from(productCheckboxes).map(cb => cb.value);
    
    // Validate at least one product is selected
    if (selectedProducts.length === 0) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Please select at least one product category';
        errorMsg.style.cssText = 'color: #dc2626; font-size: 14px; margin-top: 10px; text-align: center;';
        
        const step2 = document.getElementById('step2');
        const existingMsg = step2.querySelector('.error-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        step2.appendChild(errorMsg);
        
        setTimeout(() => {
            if (errorMsg.parentNode) {
                errorMsg.remove();
            }
        }, 5000);
        
        return;
    }
    
    // Create comprehensive email body
    const emailBody = encodeURIComponent(
        `BUSINESS DETAILS\n` +
        `================\n` +
        `Business Name: ${data.company}\n` +
        `Contact Person: ${data.contact}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'Not provided'}\n` +
        `Business Type: ${data['business-type']}\n\n` +
        
        `PRODUCT REQUIREMENTS\n` +
        `====================\n` +
        `Interested Categories: ${selectedProducts.join(', ')}\n` +
        `Estimated Order Size: ${data['order-size']}\n` +
        `Additional Requirements: ${data.message || 'None specified'}\n\n` +
        
        `ENQUIRY TYPE\n` +
        `===========\n` +
        `Wholesale Partnership Enquiry from ZEBRO Sportswear Website\n` +
        `Source: Wholesale Enquiry Form\n` +
        `Date: ${new Date().toLocaleString()}`
    );
    
    const subject = encodeURIComponent(`Wholesale Enquiry - ${data.company} - ZEBRO Sportswear`);
    
    // Open email client
    window.location.href = `mailto:info@headstrongcommerce.com?subject=${subject}&body=${emailBody}`;
    
    // Reset form after a short delay
    setTimeout(() => {
        event.target.reset();
        previousStep(); // Go back to step 1
    }, 1000);
}

// Handle contact form submission (for the contact section)
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`${data.subject}`);
    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'Not provided'}\n` +
        `Subject: ${data.subject}\n\n` +
        `Message:\n${data.message}`
    );
    
    window.location.href = `mailto:info@headstrongcommerce.com?subject=${subject}&body=${body}`;
    event.target.reset();
}

// WhatsApp integration
function openWhatsApp() {
    const phoneNumber = '918888888888'; // Replace with actual WhatsApp number
    const message = encodeURIComponent('Hi! I\'m interested in ZEBRO Sportswear wholesale partnership. Could you please provide more information?');
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    nav.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('mobileNav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Form validation enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add input validation styling
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('focus', function() {
            this.classList.remove('error');
        });
    });
    
    // Add checkbox validation
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const errorMsg = document.querySelector('.error-message');
            if (errorMsg && document.querySelectorAll('input[name="products"]:checked').length > 0) {
                errorMsg.remove();
            }
        });
    });
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add form progress indicator
    const formSteps = document.querySelectorAll('.form-step');
    const totalSteps = formSteps.length;
    
    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        // You can add a progress bar here if needed
    }
    
    // Initialize progress
    updateProgress();
});

// Add CSS for error states dynamically
const errorStyles = `
    <style>
        input.error, select.error, textarea.error {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 1px #dc2626 !important;
        }
        
        .error-message {
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .form-step {
            transition: all 0.3s ease-in-out;
        }
        
        .back-btn-small {
            transition: all 0.2s ease;
        }
        
        .back-btn-small:hover {
            transform: translateX(-2px);
        }
    </style>
`;

// Inject error styles
document.head.insertAdjacentHTML('beforeend', errorStyles);

// Analytics and tracking (optional)
function trackFormStep(step) {
    // Add your analytics tracking here
    console.log(`Form step ${step} reached`);
}

function trackFormSubmission(formData) {
    // Add your analytics tracking here
    console.log('Form submitted with data:', formData);
}

// Add step tracking
const originalNextStep = nextStep;
const originalPreviousStep = previousStep;

nextStep = function() {
    trackFormStep(2);
    originalNextStep();
};

previousStep = function() {
    trackFormStep(1);
    originalPreviousStep();
};

// Enhanced form submission tracking
const originalHandleWholesaleEnquiry = handleWholesaleEnquiry;
handleWholesaleEnquiry = function(event) {
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    trackFormSubmission(data);
    originalHandleWholesaleEnquiry(event);
};
