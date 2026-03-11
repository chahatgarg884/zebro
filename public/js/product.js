// Mobile Menu Functionality
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

// Optimized Automatic Image Carousel
let currentImageIndex = 0;
let productImages = [];
let carouselInterval;
let isUserInteracting = false;

function setupImageCarousel() {
    const mainImage = document.getElementById('mainProductImage');
    
    if (!mainImage || !currentProduct || !currentProduct.images || currentProduct.images.length <= 1) {
        return; // No carousel needed for single image
    }
    
    productImages = currentProduct.images;
    
    function changeImage() {
        if (isUserInteracting) return; // Don't change if user is interacting
        
        currentImageIndex = (currentImageIndex + 1) % productImages.length;
        
        // Update main image
        const imagePath = `${currentProduct.folderPath}/${productImages[currentImageIndex]}`;
        mainImage.src = imagePath;
        mainImage.alt = `${currentProduct.name} - Image ${currentImageIndex + 1}`;
        
        // Update thumbnail active state - optimized
        const allThumbnails = document.querySelectorAll('.thumbnail');
        allThumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        const activeThumbnail = document.querySelector(`.thumbnail[data-index="${currentImageIndex}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
            // Smooth scroll to thumbnail - targeted scroll only
            const thumbnailsContainer = document.getElementById('productThumbnails');
            if (thumbnailsContainer) {
                const containerRect = thumbnailsContainer.getBoundingClientRect();
                const thumbnailRect = activeThumbnail.getBoundingClientRect();
                const scrollLeft = thumbnailRect.left - containerRect.left + thumbnailsContainer.scrollLeft;
                
                // Only scroll the thumbnail container, not the whole page
                thumbnailsContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    function startCarousel() {
        stopCarousel(); // Clear any existing interval
        carouselInterval = setInterval(changeImage, 2000); // Change every 2 seconds (faster)
    }
    
    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    
    // User interaction tracking
    mainImage.addEventListener('mouseenter', () => {
        isUserInteracting = true;
        stopCarousel();
    });
    
    mainImage.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startCarousel();
    });
    
    // Pause when user clicks thumbnails or uses arrows
    document.addEventListener('click', (e) => {
        if (e.target.closest('.thumbnail') || e.target.closest('.image-arrow')) {
            isUserInteracting = true;
            stopCarousel();
            setTimeout(() => {
                isUserInteracting = false;
                startCarousel();
            }, 3000); // Resume after 3 seconds of inactivity
        }
    });
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCarousel();
        } else if (!isUserInteracting) {
            startCarousel();
        }
    });
    
    // Start carousel after a delay
    setTimeout(() => {
        if (!isUserInteracting) {
            startCarousel();
        }
    }, 1000); // Start after 1 second
}

// Global data storage
let currentProduct = null;
let allProducts = [];

// Image loading - DISABLED Intersection Observer for performance
let imageObserver;

function setupImageObserver() {
    // Observer disabled - using eager loading for better performance
    // All images load immediately, no need for intersection observation
    return;
    
    /* Original observer code disabled:
    if ('IntersectionObserver' in window) {
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    if (src) {
                        img.src = src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        
                        // Hide loading placeholder if this is the main product image
                        const loadingPlaceholder = document.getElementById('imageLoadingPlaceholder');
                        if (loadingPlaceholder && img.id === 'mainProductImage') {
                            loadingPlaceholder.classList.add('hidden');
                        }
                        
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
    }
    */
}

// Create lazy loaded image element
function createLazyImage(src, alt, className = '') {
    const img = document.createElement('img');
    img.dataset.src = src;
    img.alt = alt;
    img.className = `lazy ${className}`;
    
    // Add placeholder
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Mb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==';
    
    if (imageObserver) {
        imageObserver.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        img.src = src;
        img.classList.add('loaded');
    }
    
    return img;
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Add product info to message if viewing a product
    let messageBody = data.message;
    if (currentProduct) {
        messageBody = `Product Inquiry: ${currentProduct.name}\n\n${data.message}`;
    }
    
    // Create mailto link with form data
    const subject = encodeURIComponent(`${data.subject}${currentProduct ? ` - ${currentProduct.name}` : ''}`);
    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || 'Not provided'}\n` +
        `Subject: ${data.subject}\n\n` +
        `Message:\n${messageBody}`
    );
    
    window.location.href = `mailto:info@headstrongcommerce.com?subject=${subject}&body=${body}`;
    event.target.reset();
}

// Initialize product page
document.addEventListener('DOMContentLoaded', function() {
    setupImageObserver();
    loadProductDetails();
    
    // Add arrow key navigation for product image
    setupImageArrowKeys();
    
    // Check for stored search term after page loads
    setTimeout(() => {
        checkStoredSearch();
    }, 200);
});

// Setup arrow key navigation for main product image
function setupImageArrowKeys() {
    const mainImageContainer = document.querySelector('.main-image-container');
    if (!mainImageContainer) return;
    
    // Make image container focusable
    mainImageContainer.setAttribute('tabindex', '0');
    
    // Add click handlers to arrow indicators
    const leftArrow = document.getElementById('imageArrowLeft');
    const rightArrow = document.getElementById('imageArrowRight');
    
    if (leftArrow) {
        leftArrow.addEventListener('click', function() {
            navigateImage(-1);
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            navigateImage(1);
        });
    }
    
    mainImageContainer.addEventListener('keydown', function(e) {
        const thumbnailsContainer = document.getElementById('productThumbnails');
        if (!thumbnailsContainer) return;
        
        const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
        if (thumbnails.length <= 1) return;
        
        let currentThumbnail = thumbnailsContainer.querySelector('.thumbnail.active');
        let currentIndex = 0;
        
        if (currentThumbnail) {
            currentIndex = parseInt(currentThumbnail.dataset.index);
        }
        
        let newIndex = currentIndex;
        
        // Handle arrow keys
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateImage(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateImage(1);
                break;
            default:
                return; // Exit if not arrow key
        }
    });
    
    // Add global arrow key listener for better accessibility
    document.addEventListener('keydown', function(e) {
        // Only handle arrow keys when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Only handle on product page
        if (!document.getElementById('productThumbnails')) {
            return;
        }
        
        const thumbnailsContainer = document.getElementById('productThumbnails');
        const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
        if (thumbnails.length <= 1) return;
        
        let currentThumbnail = thumbnailsContainer.querySelector('.thumbnail.active');
        let currentIndex = 0;
        
        if (currentThumbnail) {
            currentIndex = parseInt(currentThumbnail.dataset.index);
        }
        
        // Handle arrow keys globally
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                navigateImage(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                navigateImage(1);
                break;
            default:
                return;
        }
    });
}

// Navigate to previous/next image
function navigateImage(direction) {
    const thumbnailsContainer = document.getElementById('productThumbnails');
    if (!thumbnailsContainer) return;
    
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumbnail');
    if (thumbnails.length <= 1) return;
    
    let currentThumbnail = thumbnailsContainer.querySelector('.thumbnail.active');
    let currentIndex = 0;
    
    if (currentThumbnail) {
        currentIndex = parseInt(currentThumbnail.dataset.index);
    }
    
    const newIndex = direction === -1 
        ? Math.max(0, currentIndex - 1)
        : Math.min(thumbnails.length - 1, currentIndex + 1);
    
    // If index changed, activate new thumbnail
    if (newIndex !== currentIndex) {
        const newThumbnail = thumbnails[newIndex];
        if (newThumbnail) {
            // Update carousel index
            currentImageIndex = newIndex;
            
            // Update active state - optimized
            const allThumbnails = document.querySelectorAll('.thumbnail');
            allThumbnails.forEach(t => {
                t.classList.remove('active');
            });
            newThumbnail.classList.add('active');
            
            // Change main image
            const img = newThumbnail.querySelector('img');
            if (img) {
                changeMainImage(img.src, newThumbnail, true); // true = manual click
            }
            
            // Smooth scroll to thumbnail - targeted scroll only
            const thumbnailsContainer = document.getElementById('productThumbnails');
            if (thumbnailsContainer) {
                const containerRect = thumbnailsContainer.getBoundingClientRect();
                const thumbnailRect = newThumbnail.getBoundingClientRect();
                const scrollLeft = thumbnailRect.left - containerRect.left + thumbnailsContainer.scrollLeft;
                
                // Only scroll the thumbnail container, not the whole page
                thumbnailsContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
            
            // Prevent automatic scroll to top
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }
}

// Load product details from URL parameters or localStorage
function loadProductDetails() {
    // Try to get product from URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        // Load all products to find the specific one
        loadAllProducts().then(() => {
            currentProduct = allProducts.find(p => p.id === productId);
            if (currentProduct) {
                renderProductDetails();
                loadRelatedProducts();
            } else {
                showProductNotFound();
            }
        });
    } else {
        // Fallback to localStorage
        const storedProduct = localStorage.getItem('selectedProduct');
        if (storedProduct) {
            currentProduct = JSON.parse(storedProduct);
            renderProductDetails();
            loadRelatedProducts();
        } else {
            showProductNotFound();
        }
    }
}

// Load all products from the combined products JSON file
async function loadAllProducts() {
    try {
        // Fetch from combined products file
        const response = await fetch('combined_products.json');
        if (!response.ok) {
            throw new Error('Failed to load combined products data');
        }
        
        const products = await response.json();
        
        // Process products and add folder paths
        allProducts = products.map(product => {
            // Use exact product name for folder path (preserve spaces)
            const folderPath = `extracted_images_0/${product.name}`;
            
            return {
                ...product,
                folderPath: folderPath
            };
        });
        
    } catch (error) {
        console.error('Error loading products:', error);
        allProducts = [];
    }
}

// Render product details
function renderProductDetails() {
    if (!currentProduct) return;

    // Update page title
    document.getElementById('productPageTitle').textContent = `${currentProduct.name} | Sportswear Collection`;
    
    // Update basic product info
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productCategory').textContent = currentProduct.category;
    
    // Set main image with lazy loading
    const mainImage = document.getElementById('mainProductImage');
    const imageUrl = getProductImage(currentProduct);
    const loadingPlaceholder = document.getElementById('imageLoadingPlaceholder');
    
    // Set data-src for lazy loading
    mainImage.dataset.src = imageUrl;
    mainImage.alt = currentProduct.name;
    
    // Add to lazy loading observer
    if (window.imageObserver) {
        window.imageObserver.observe(mainImage);
    } else {
        // Fallback if observer not ready
        mainImage.src = imageUrl;
        mainImage.classList.add('loaded');
        loadingPlaceholder.classList.add('hidden');
    }
    
    // Handle image load
    mainImage.onload = () => {
        mainImage.classList.add('loaded');
        loadingPlaceholder.classList.add('hidden');
    };
    
    // Create thumbnails if multiple images
    createProductThumbnails();
    
    // Extract and set fabric composition
    const fabricComposition = extractFabricComposition(currentProduct);
    const fabricList = document.getElementById('fabricComposition');
    fabricList.innerHTML = fabricComposition.map(item => `<li>${item}</li>`).join('');
    
    // Extract and set key benefits (focused on retail and durability)
    const keyBenefits = extractRetailBenefits(currentProduct);
    const benefitsList = document.getElementById('keyBenefits');
    benefitsList.innerHTML = keyBenefits.map(item => `<li>${item}</li>`).join('');
    
    // Set care instructions
    const careContainer = document.getElementById('productCare');
    if (currentProduct.care) {
        careContainer.innerHTML = `
            <h3>Care Instructions</h3>
            <p>${currentProduct.care}</p>
        `;
    } else {
        careContainer.innerHTML = `
            <h3>Care Instructions</h3>
            <p>Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.</p>
        `;
    }
    
    // Setup automatic image carousel
    setTimeout(setupImageCarousel, 100);
}

// Create product thumbnails
function createProductThumbnails() {
    const thumbnailsContainer = document.getElementById('productThumbnails');
    thumbnailsContainer.innerHTML = '';
    
    if (!currentProduct.images || currentProduct.images.length <= 1) {
        // Hide navigation if no thumbnails needed
        const navContainer = document.querySelector('.thumbnail-navigation');
        if (navContainer) navContainer.style.display = 'none';
        return;
    }
    
    // Show navigation but hide arrows
    const navContainer = document.querySelector('.thumbnail-navigation');
    if (navContainer) navContainer.style.display = 'flex';
    
    currentProduct.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active visible' : ''}`;
        thumbnail.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = `${currentProduct.folderPath}/${image}`;
        img.alt = `${currentProduct.name} - Image ${index + 1}`;
        img.loading = 'eager'; // Load immediately to prevent reloading on scroll
        
        // Click handler with instant image change
        img.onclick = () => {
            // Update active state
            document.querySelectorAll('.thumbnail').forEach(t => {
                t.classList.remove('active');
            });
            thumbnail.classList.add('active');
            
            // Change main image instantly
            changeMainImage(`${currentProduct.folderPath}/${image}`, thumbnail, true); // true = manual click
            
            // Smooth scroll to thumbnail - targeted scroll only
            const thumbnailsContainer = document.getElementById('productThumbnails');
            if (thumbnailsContainer) {
                const containerRect = thumbnailsContainer.getBoundingClientRect();
                const thumbnailRect = thumbnail.getBoundingClientRect();
                const scrollLeft = thumbnailRect.left - containerRect.left + thumbnailsContainer.scrollLeft;
                
                // Only scroll the thumbnail container, not the whole page
                thumbnailsContainer.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
            
            // Prevent automatic scroll to top
            event.preventDefault();
            event.stopPropagation();
        };
        
        thumbnail.appendChild(img);
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Make all thumbnails visible for horizontal scroll
    setTimeout(() => {
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.add('visible');
        });
    }, 100);
}

// Update thumbnail visibility based on current index
function updateThumbnailVisibility() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.getElementById('prevThumbnail');
    const nextBtn = document.getElementById('nextThumbnail');
    
    if (thumbnails.length <= window.maxVisibleThumbnails) {
        // Show all thumbnails if less than or equal to max
        thumbnails.forEach(thumb => {
            thumb.classList.add('visible');
        });
        // Hide arrows if not needed
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }
    
    // Show arrows if needed
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
    
    // Hide all thumbnails first
    thumbnails.forEach(thumb => {
        thumb.classList.remove('visible');
    });
    
    // Calculate visible range
    const startIndex = window.currentThumbnailIndex;
    const endIndex = Math.min(startIndex + window.maxVisibleThumbnails, thumbnails.length);
    
    // Show visible thumbnails
    for (let i = startIndex; i < endIndex; i++) {
        thumbnails[i].classList.add('visible');
    }
    
    // Update arrow states
    if (prevBtn) {
        prevBtn.disabled = startIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = endIndex >= thumbnails.length;
    }
}

// Navigate thumbnails
function navigateThumbnails(direction) {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const totalThumbnails = thumbnails.length;
    
    if (totalThumbnails <= window.maxVisibleThumbnails) return;
    
    const newIndex = window.currentThumbnailIndex + direction;
    
    // Ensure we don't go out of bounds
    if (newIndex < 0 || newIndex > totalThumbnails - window.maxVisibleThumbnails) {
        return;
    }
    
    window.currentThumbnailIndex = newIndex;
    updateThumbnailVisibility();
}

// Change main image when thumbnail is clicked
function changeMainImage(imageSrc, thumbnailElement, isManual = false) {
    const mainImage = document.getElementById('mainProductImage');
    const loadingPlaceholder = document.getElementById('imageLoadingPlaceholder');
    
    if (isManual) {
        // Instant change for manual clicks
        mainImage.style.transition = 'none';
        mainImage.src = imageSrc;
        mainImage.alt = thumbnailElement.querySelector('img').alt;
        mainImage.classList.add('loaded');
        if (loadingPlaceholder) {
            loadingPlaceholder.classList.add('hidden');
        }
        
        // Restore transition after a brief delay
        setTimeout(() => {
            mainImage.style.transition = '';
        }, 50);
    } else {
        // Normal change for carousel
        mainImage.src = imageSrc;
        mainImage.alt = thumbnailElement.querySelector('img').alt;
        
        mainImage.onload = () => {
            mainImage.classList.add('loaded');
            if (loadingPlaceholder) {
                loadingPlaceholder.classList.add('hidden');
            }
        };
        
        mainImage.onerror = () => {
            console.error('Failed to load image:', imageSrc);
            if (loadingPlaceholder) {
                loadingPlaceholder.classList.add('hidden');
            }
        };
    }
}

// Extract fabric composition from product data
function extractFabricComposition(product) {
    // Check if product has custom fabric composition
    if (product.fabricComposition && Array.isArray(product.fabricComposition) && product.fabricComposition.length > 0) {
        return product.fabricComposition;
    }
    
    // Try to extract from description
    if (product.description) {
        const fabricKeywords = ['polyester', 'cotton', 'spandex', 'nylon', 'mesh', 'fabric', 'material', 'blend', 'stretch'];
        const sentences = product.description.split('.');
        
        for (let sentence of sentences) {
            if (fabricKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
                const cleaned = sentence.trim();
                if (cleaned.length > 10 && cleaned.length < 100) {
                    return [cleaned];
                }
            }
        }
    }
    
    // Try to extract from features
    if (product.features && Array.isArray(product.features)) {
        const fabricKeywords = ['polyester', 'cotton', 'spandex', 'nylon', 'mesh', 'fabric', 'material', 'blend', 'stretch'];
        const fabricFeatures = product.features.filter(feature => 
            fabricKeywords.some(keyword => feature.toLowerCase().includes(keyword))
        );
        if (fabricFeatures.length > 0) {
            return fabricFeatures.slice(0, 3);
        }
    }
    
    // Use category defaults
    return getDefaultFabricComposition(product.category);
}

// Extract retail-focused benefits from product data
function extractRetailBenefits(product) {
    // Check if product has custom key benefits
    if (product.keyBenefits && Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
        return product.keyBenefits;
    }
    
    // Extract from features, focusing on retail and durability
    if (product.features && Array.isArray(product.features) && product.features.length > 0) {
        const retailKeywords = ['durable', 'retail', 'commercial', 'heavy-duty', 'long-lasting', 'quality', 'professional', 'bulk'];
        const durabilityKeywords = ['reinforced', 'strong', 'sturdy', 'resistant', 'robust', 'premium'];
        
        const retailBenefits = product.features.filter(feature => 
            retailKeywords.some(keyword => feature.toLowerCase().includes(keyword)) ||
            durabilityKeywords.some(keyword => feature.toLowerCase().includes(keyword))
        );
        
        if (retailBenefits.length > 0) {
            return retailBenefits.slice(0, 4);
        }
        
        // Use first few features as benefits
        return product.features.slice(0, 4).map(feature => 
            feature.replace(/premium|excellent|amazing|fantastic|great/gi, 'Quality')
        );
    }
    
    // Extract from description, focusing on retail and durability
    if (product.description) {
        const retailKeywords = ['durable', 'retail', 'commercial', 'heavy-duty', 'long-lasting', 'quality', 'professional', 'bulk'];
        const durabilityKeywords = ['reinforced', 'strong', 'sturdy', 'resistant', 'robust', 'premium'];
        
        const sentences = product.description.split('.');
        const benefitSentences = sentences.filter(sentence => 
            retailKeywords.some(keyword => sentence.toLowerCase().includes(keyword)) ||
            durabilityKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
        );
        
        if (benefitSentences.length > 0) {
            return benefitSentences.slice(0, 4).map(s => s.trim());
        }
    }
    
    // Use category defaults
    return getDefaultRetailBenefits(product.category);
}

// Get default fabric composition by category
function getDefaultFabricComposition(category) {
    const defaults = {
        'Upper': [
            '65% Polyester, 35% Cotton blend',
            'Moisture-wicking polyester fibers',
            'Reinforced stitching at stress points',
            'Anti-pilling finish'
        ],
        'Lower': [
            '80% Polyester, 20% Spandex blend',
            'Four-way stretch technology',
            'Brushed interior for comfort',
            'Quick-dry fabric treatment'
        ],
        'Track Suits': [
            '100% Premium polyester mesh',
            'Breathable mesh panels',
            'Water-resistant outer layer',
            'Thermal lining for warmth'
        ],
        'Accessories': [
            'High-density synthetic materials',
            'UV-resistant coatings',
            'Reinforced stress points',
            'Quick-dry synthetic fabrics'
        ],
        'Footwear': [
            'Engineered mesh upper',
            'TPU sole construction',
            'EVA foam midsole',
            'Rubber outsole with traction'
        ],
        'Training': [
            'Industrial-grade synthetic materials',
            'Reinforced steel components',
            'Anti-slip rubber grips',
            'Weather-resistant coatings'
        ]
    };
    return defaults[category] || defaults['Upper'];
}

// Get default retail benefits by category
function getDefaultRetailBenefits(category) {
    const defaults = {
        'Upper': [
            'Commercial-grade durability for retail environments',
            'Reinforced construction for high-traffic use',
            'Retail-ready packaging and presentation',
            'Consistent quality for bulk orders'
        ],
        'Lower': [
            'Heavy-duty fabric for extended wear',
            'Reinforced seams for commercial use',
            'Retail-display ready finish',
            'Durable for frequent washing'
        ],
        'Track Suits': [
            'Built for team and institutional use',
            'Commercial-quality construction',
            'Bulk-order ready packaging',
            'Professional appearance for retail display'
        ],
        'Accessories': [
            'Retail-ready branding opportunities',
            'Durable construction for commercial use',
            'Professional finish for display',
            'Consistent quality across bulk orders'
        ],
        'Footwear': [
            'Commercial-grade construction for retail',
            'Reinforced stress points for durability',
            'Professional appearance for display',
            'Built for high-traffic retail environments'
        ],
        'Training': [
            'Professional-grade durability',
            'Commercial-quality construction',
            'Retail-ready packaging and display',
            'Ergonomic design for efficiency'
        ]
    };
    return defaults[category] || defaults['Upper'];
}

// Load related products
function loadRelatedProducts() {
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (!relatedGrid || !currentProduct) return;
    
    // Find products from the same category
    const relatedProducts = allProducts.filter(product => 
        product.category === currentProduct.category && 
        product.id !== currentProduct.id
    ).slice(0, 6); // Limit to 6 related products
    
    relatedGrid.innerHTML = '';
    
    if (relatedProducts.length === 0) {
        relatedGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No related products found.</p>';
        return;
    }
    
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Create lazy loaded image
        const productImage = createLazyImage(getProductImage(product), product.name);
        
        productCard.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-link">
                <div class="product-image-container">
                    <!-- Image will be inserted here -->
                </div>
            </a>
            <h3>${product.name}</h3>
            <a href="product.html?id=${product.id}" class="link">View Details</a>
        `;
        
        // Insert the lazy image into the container
        const imageContainer = productCard.querySelector('.product-image-container');
        imageContainer.appendChild(productImage);
        
        relatedGrid.appendChild(productCard);
    });
}

// Show product not found message
function showProductNotFound() {
    const container = document.querySelector('.product-detail-container');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h2>Product Not Found</h2>
                <p>The product you're looking for is not available.</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Back to Products</a>
            </div>
        `;
    }
}

// Search functionality for product page
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        return;
    }
    
    // Store search term in sessionStorage for cross-page search
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchTimestamp', Date.now());
    
    // Redirect to index page with search
    window.location.href = 'index.html#featured';
}

// Check for stored search on page load
function checkStoredSearch() {
    const storedSearch = sessionStorage.getItem('searchTerm');
    const searchTimestamp = sessionStorage.getItem('searchTimestamp');
    
    // Only apply if search is recent (within 5 minutes)
    if (storedSearch && searchTimestamp && (Date.now() - parseInt(searchTimestamp)) < 300000) {
        // Clear the stored search after applying
        sessionStorage.removeItem('searchTerm');
        sessionStorage.removeItem('searchTimestamp');
        
        // Redirect to index page to show search results
        setTimeout(() => {
            window.location.href = 'index.html#featured';
        }, 100);
    }
}

// Get product image URL
function getProductImage(product) {
    if (product.images && product.images.length > 0) {
        return `${product.folderPath}/${product.images[0]}`;
    }
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
}
