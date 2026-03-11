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

// Global data storage
let categoryProducts = [];
let selectedCategory = '';

// Image lazy loading with Intersection Observer
let imageObserver;

function setupImageObserver() {
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
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
    }
}

// Create eager loaded image element
function createLazyImage(src, alt, className = '') {
    const img = document.createElement('img');
    img.src = src; 
    img.alt = alt;
    img.className = className; 
    img.loading = 'eager'; 
    
    return img;
}

// Handle contact form submission
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

// Fetch products and build categories
async function loadProducts() {
    try {
        // Fetch from combined products file
        const response = await fetch('combined_products.json');
        if (!response.ok) {
            throw new Error('Failed to load combined products data');
        }
        
        const allProducts = await response.json();
        
        // Process products and add folder paths
        productsData = allProducts.map(product => {
            // Use exact product name for folder path (preserve spaces)
            const folderPath = `extracted_images_0/${product.name}`;
            
            return {
                ...product,
                folderPath: folderPath
            };
        });
        
        // Store all products for category page
        localStorage.setItem('categoryProducts', JSON.stringify(productsData));
        categoryProducts = productsData;
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Initialize category page
document.addEventListener('DOMContentLoaded', function() {
    setupImageObserver();
    // Load products first
    loadProducts();
    
    // Load category data from localStorage
    selectedCategory = localStorage.getItem('selectedCategory') || 'Products';
    const storedProducts = localStorage.getItem('categoryProducts');
    
    if (storedProducts) {
        categoryProducts = JSON.parse(storedProducts);
    }
    
    // Update page title and description
    document.getElementById('categoryTitle').textContent = selectedCategory;
    document.getElementById('categoryDescription').textContent = getCategoryDescription(selectedCategory);
    
    // Filter products by selected category
    let filteredProducts;
    if (selectedCategory === 'All Products') {
        // Show all products
        filteredProducts = categoryProducts;
    } else {
        // Filter by specific category
        filteredProducts = categoryProducts.filter(product => product.category === selectedCategory);
    }
    document.getElementById('productsCount').textContent = filteredProducts.length;
    
    // Update category-specific content
    updateCategoryContent(selectedCategory);
    
    // Render products
    renderCategoryProducts();
    
    // Check for stored search term after products are loaded
    setTimeout(() => {
        checkStoredSearch();
    }, 200);
});

// Update category-specific content
function updateCategoryContent(category) {
    // Filter products by category
    let productsInCategory;
    if (category === 'All Products') {
        // Show all products for "All Products" category
        productsInCategory = categoryProducts;
    } else {
        // Filter by specific category
        productsInCategory = categoryProducts.filter(product => product.category === category);
    }
    
    if (productsInCategory.length === 0) {
        console.warn(`No products found for category: ${category}. Using fallback data.`);
        // Use fallback data if no products found
        useFallbackData(category);
        return;
    }
    
    // Select a random product from the filtered list
    const randomProduct = productsInCategory[Math.floor(Math.random() * productsInCategory.length)];
    
    // Update images using the random product's images
    if (randomProduct.images && randomProduct.images.length > 0) {
        const productPath = randomProduct.folderPath || '';
        document.getElementById('lifestyleImage1').src = `${productPath}/${randomProduct.images[0]}`;
        document.getElementById('lifestyleImage2').src = randomProduct.images[1] ? `${productPath}/${randomProduct.images[1]}` : `${productPath}/${randomProduct.images[0]}`;
        document.getElementById('lifestyleImage3').src = randomProduct.images[2] ? `${productPath}/${randomProduct.images[2]}` : `${productPath}/${randomProduct.images[0]}`;
        document.getElementById('flatLayImage').src = randomProduct.images[3] ? `${productPath}/${randomProduct.images[3]}` : `${productPath}/${randomProduct.images[0]}`;
    } else {
        // Fallback to placeholder images if no product images
        useFallbackImages();
    }
    
    // Extract fabric composition and key benefits from product data
    const fabricComposition = extractFabricComposition(randomProduct, category);
    const keyBenefits = extractKeyBenefits(randomProduct, category);
    
    updateSpecLists(fabricComposition, keyBenefits);
}

// Extract fabric composition from product data
function extractFabricComposition(product, category) {
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
                // Clean up and return the sentence as fabric info
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
    return getDefaultFabricComposition(category);
}

// Extract key benefits from product data
function extractKeyBenefits(product, category) {
    // Check if product has custom key benefits
    if (product.keyBenefits && Array.isArray(product.keyBenefits) && product.keyBenefits.length > 0) {
        return product.keyBenefits;
    }
    
    // Extract from features
    if (product.features && Array.isArray(product.features) && product.features.length > 0) {
        // Filter out fabric-related features and keep benefits
        const benefitKeywords = ['durable', 'comfortable', 'breathable', 'lightweight', 'quick-dry', 'moisture', 'performance', 'quality', 'design'];
        const benefits = product.features.filter(feature => 
            benefitKeywords.some(keyword => feature.toLowerCase().includes(keyword))
        );
        
        if (benefits.length > 0) {
            return benefits.slice(0, 4);
        }
        
        // If no specific benefits found, use first few features
        return product.features.slice(0, 4);
    }
    
    // Extract from description
    if (product.description) {
        const benefitKeywords = ['durable', 'comfortable', 'breathable', 'lightweight', 'quick-dry', 'moisture', 'performance', 'quality', 'design'];
        const sentences = product.description.split('.');
        
        const benefitSentences = sentences.filter(sentence => 
            benefitKeywords.some(keyword => sentence.toLowerCase().includes(keyword))
        );
        
        if (benefitSentences.length > 0) {
            return benefitSentences.slice(0, 4).map(s => s.trim());
        }
    }
    
    // Use category defaults
    return getDefaultKeyBenefits(category);
}

// Use fallback data for category
function useFallbackData(category) {
    const fabricComposition = getDefaultFabricComposition(category);
    const keyBenefits = getDefaultKeyBenefits(category);
    
    // Use fallback images
    useFallbackImages();
    
    // Update spec lists with defaults
    updateSpecLists(fabricComposition, keyBenefits);
}

// Use fallback images
function useFallbackImages() {
    document.getElementById('lifestyleImage1').src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop';
    document.getElementById('lifestyleImage2').src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop';
    document.getElementById('lifestyleImage3').src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=300&fit=crop';
    document.getElementById('flatLayImage').src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop';
}

// Get default fabric composition by category
function getDefaultFabricComposition(category) {
    const defaults = {
        'Tee': [
            '65% Polyester, 35% Cotton blend',
            'Moisture-wicking polyester fibers',
            'Reinforced stitching at stress points',
            'Anti-pilling finish'
        ],
        'Track Pant': [
            '80% Polyester, 20% Spandex blend',
            'Four-way stretch technology',
            'Brushed interior for comfort',
            'Quick-dry fabric treatment'
        ],
        'Track Suit': [
            '100% Premium polyester mesh',
            'Breathable mesh panels',
            'Water-resistant outer layer',
            'Thermal lining for warmth'
        ],
        'Shorts': [
            '85% Polyester, 15% Spandex blend',
            'Lightweight breathable fabric',
            'Quick-dry technology',
            'Reinforced seams'
        ],
        'Jacket': [
            '70% Polyester, 30% Nylon blend',
            'Wind-resistant outer shell',
            'Insulated lining',
            'Water-repellent coating'
        ],
        'Upper': [
            '70% Polyester, 30% Nylon blend',
            'Wind-resistant outer shell',
            'Insulated lining',
            'Water-repellent coating'
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
    return defaults[category] || defaults['Tee'];
}

// Get default key benefits by category
function getDefaultKeyBenefits(category) {
    const defaults = {
        'Tee': [
            'Enhanced durability for frequent wear',
            'Superior breathability during activity',
            'Retail-ready premium finish',
            'Color-fast technology for lasting appearance'
        ],
        'Track Pant': [
            'Maximum flexibility and range of motion',
            'Superior moisture management',
            'Retail-ready quality construction',
            'Durable for high-intensity training'
        ],
        'Track Suit': [
            'Complete coordinated outfit system',
            'All-weather versatility and comfort',
            'Retail-ready presentation',
            'Built for team and individual use'
        ],
        'Shorts': [
            'Lightweight comfort for training',
            'Quick-dry moisture management',
            'Retail-ready athletic styling',
            'Durable for repeated washing'
        ],
        'Jacket': [
            'Weather protection for outdoor use',
            'Insulated warmth for cold conditions',
            'Retail-ready professional appearance',
            'Durable construction for daily wear'
        ],
        'Upper': [
            'Weather protection for outdoor use',
            'Insulated warmth for cold conditions',
            'Retail-ready professional appearance',
            'Durable construction for daily wear'
        ],
        'Accessories': [
            'Enhanced durability for outdoor use',
            'Weather-resistant performance',
            'Retail-ready branding options',
            'Ergonomic design for comfort'
        ],
        'Footwear': [
            'Superior cushioning and support',
            'Enhanced durability for daily training',
            'Retail-ready premium aesthetics',
            'Advanced traction technology'
        ],
        'Training': [
            'Professional-grade durability',
            'Enhanced safety features',
            'Retail-ready packaging and display',
            'Ergonomic design for efficiency'
        ]
    };
    return defaults[category] || defaults['Tee'];
}

// Helper function to update spec lists
function updateSpecLists(fabricComposition, keyBenefits) {
    const fabricList = document.getElementById('fabricComposition');
    fabricList.innerHTML = fabricComposition.map(item => `<li>${item}</li>`).join('');
    
    const benefitsList = document.getElementById('keyBenefits');
    benefitsList.innerHTML = keyBenefits.map(item => `<li>${item}</li>`).join('');
}

// Get category description
function getCategoryDescription(category) {
    const descriptions = {
        'All Products': 'Complete collection of all ZEBRO sportswear products',
        'Tee': 'T-Shirts, Polo shirts and more',
        'Track Pant': 'Track pants, shorts, joggers and more',
        'Track Suit': 'Complete training sets and coordinated outfits',
        'Shorts': 'Training shorts and athletic wear',
        'Jacket': 'Jackets, hoodies and outerwear',
        'Upper': 'Jackets, hoodies and upper body wear',
        'Accessories': 'Caps, bags, water bottles and training gear',
        'Footwear': 'Running shoes, trainers and athletic footwear',
        'Training': 'Training equipment and fitness accessories'
    };
    return descriptions[category] || 'Premium sportswear and athletic gear';
}

// Render category products
function renderCategoryProducts() {
    const productGrid = document.getElementById('categoryProductGrid');
    productGrid.innerHTML = '';
    
    // Filter products by selected category
    let filteredProducts;
    if (selectedCategory === 'All Products') {
        // Show all products
        filteredProducts = categoryProducts;
    } else {
        // Filter by specific category
        filteredProducts = categoryProducts.filter(product => product.category === selectedCategory);
    }
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No products found in this category.</p>';
        return;
    }
    
    filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card scroll-animate scale-up';
        
        // Add stagger delay based on index
        const staggerClass = `stagger-${((index % 4) + 1)}`;
        productCard.classList.add(staggerClass);
        
        // Create eager loaded image
        const productImage = createLazyImage(getProductImage(product), product.name);
        // productImage.loading = 'eager'; // Already set in createLazyImage function
        
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
        
        productGrid.appendChild(productCard);
    });
    
    // Initialize scroll animations for the new product cards
    if (window.scrollAnimations) {
        window.scrollAnimations.observeElements();
    }
}

// View individual product
function viewProduct(productId) {
    const product = categoryProducts.find(p => p.id === productId);
    if (!product) return;
    
    showProductModal(product);
}

// Show product modal
function showProductModal(product) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalCategory = document.getElementById('modalProductCategory');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalFeatures = document.getElementById('modalProductFeatures');
    const modalCare = document.getElementById('modalProductCare');
    const thumbnails = document.getElementById('productThumbnails');
    
    // Set basic product info
    modalImage.src = getProductImage(product);
    modalImage.alt = product.name;
    modalName.textContent = product.name;
    modalCategory.textContent = product.category;
    
    // Set description
    if (product.description) {
        modalDescription.innerHTML = `<p>${product.description}</p>`;
    } else {
        modalDescription.innerHTML = '<p>Discover this premium sportswear product designed for athletes who demand excellence in performance and style.</p>';
    }
    
    // Set features
    if (product.features && product.features.length > 0) {
        modalFeatures.innerHTML = `
            <h4>Features</h4>
            <ul>
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
    } else {
        modalFeatures.innerHTML = `
            <h4>Features</h4>
            <ul>
                <li>Premium quality materials</li>
                <li>Advanced moisture-wicking technology</li>
                <li>Ergonomic design for maximum comfort</li>
                <li>Durable construction for long-lasting performance</li>
            </ul>
        `;
    }
    
    // Set care instructions
    if (product.care) {
        modalCare.innerHTML = `
            <h4>Care Instructions</h4>
            <p>${product.care}</p>
        `;
    } else {
        modalCare.innerHTML = `
            <h4>Care Instructions</h4>
            <p>Machine wash cold with like colors. Tumble dry low. Do not bleach. Iron on low heat if needed.</p>
        `;
    }
    
    // Create thumbnails with lazy loading
    if (product.images && product.images.length > 1) {
        thumbnails.innerHTML = '';
        product.images.forEach((img, index) => {
            const thumbnailImg = createLazyImage(`${product.folderPath}/${img}`, `${product.name} - Image ${index + 1}`, 'thumbnail');
            if (index === 0) {
                thumbnailImg.classList.add('active');
            }
            thumbnailImg.onclick = () => changeMainImage(`${product.folderPath}/${img}`);
            thumbnails.appendChild(thumbnailImg);
        });
    } else {
        thumbnails.innerHTML = '';
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Change main image in modal
function changeMainImage(imageSrc) {
    const modalImage = document.getElementById('modalProductImage');
    if (modalImage) {
        modalImage.src = imageSrc;
    }
}

// Get product image URL
function getProductImage(product) {
    if (product.images && product.images.length > 0) {
        return `${product.folderPath}/${product.images[0]}`;
    }
    return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (modal && event.target === modal) {
        closeProductModal();
    }
});

// Search functionality for category page
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        renderCategoryProducts(categoryProducts);
        return;
    }
    
    // Store search term in sessionStorage for cross-page search
    sessionStorage.setItem('searchTerm', searchTerm);
    sessionStorage.setItem('searchTimestamp', Date.now());
    
    // If not on index page, redirect to index with search
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html#featured';
        return;
    }
    
    // If on index page, apply search immediately
    applySearchFilter(searchTerm);
}

// Apply search filter (used after page reload)
function applySearchFilter(searchTerm) {
    if (!searchTerm) {
        renderCategoryProducts(categoryProducts);
        return;
    }
    
    const filteredProducts = categoryProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    renderCategoryProducts(filteredProducts);
    
    // Update search input field
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm;
    }
    
    // Update products header to show search results
    const productsHeader = document.querySelector('.products-header h2');
    if (productsHeader) {
        productsHeader.textContent = `Search Results: "${searchTerm}"`;
    }
    
    // Scroll to products section
    setTimeout(() => {
        const productsSection = document.querySelector('.category-products');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 50);
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
        
        // Apply the search filter
        setTimeout(() => {
            applySearchFilter(storedSearch);
        }, 100);
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProductModal();
    }
});
