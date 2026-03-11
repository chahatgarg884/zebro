// Global data storage
let productsData = [];
let categoriesData = [];

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
    img.src = src; // Load immediately instead of lazy
    img.alt = alt;
    img.className = className; // Remove lazy class
    img.loading = 'eager'; // Load immediately to prevent reloading
    
    return img;
}

// Search functionality
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!searchTerm) {
        renderProducts();
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
        renderProducts();
        return;
    }
    
    const filteredProducts = productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    renderFilteredProducts(filteredProducts, `Search Results: "${searchTerm}"`);
    
    // Update search input field
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = searchTerm;
    }
    
    // Scroll to featured section
    setTimeout(() => {
        const featuredSection = document.getElementById('featured');
        if (featuredSection) {
            featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
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

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.getElementById('mainNav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        nav.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// About and Contact modals
function showAbout() {
    alert('Sports Wear - Premium Sportswear Collection\n\nWe offer high-quality sportswear including uppers, lowers, track suits, and training wear designed for athletes who demand excellence in comfort, durability, and style.');
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
        `Message:\n${data.message}`
    );
    
    window.location.href = `mailto:info@headstrongcommerce.com?subject=${subject}&body=${body}`;
    event.target.reset();
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});

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
        
        // Extract unique categories
        const categoryMap = new Map();
        
        productsData.forEach(product => {
            const categoryName = product.category || 'Sportswear';
            
            // Initialize category if not exists
            if (!categoryMap.has(categoryName)) {
                categoryMap.set(categoryName, {
                    name: categoryName,
                    count: 0,
                    description: getCategoryDescription(categoryName)
                });
            }
            
            categoryMap.get(categoryName).count++;
        });
        
        // Convert to Array for easier handling
        categoriesData = Array.from(categoryMap.values());
        
        // Update UI
        renderFilterButtons();
        renderProducts();
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Get category description
function getCategoryDescription(category) {
    const descriptions = {
        'Upper': 'T-Shirts, Jackets, Polo shirts and more',
        'Lower': 'Track pants, shorts, joggers and more',
        'Track Suits': 'Complete training sets and coordinated outfits',
        'Accessories': 'Caps, bags, water bottles and training gear',
        'Footwear': 'Running shoes, trainers and athletic footwear',
        'Training': 'Training equipment and fitness accessories'
    };
    return descriptions[category] || 'Premium sportswear and athletic gear';
}

// Render filter buttons
function renderFilterButtons() {
    const filterButtonsContainer = document.getElementById('filterButtons');
    filterButtonsContainer.innerHTML = '';
    
    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'filter-btn active';
    allButton.textContent = 'All Collections';
    allButton.onclick = () => filterByCategory('all');
    filterButtonsContainer.appendChild(allButton);
    
    // Add category buttons
    categoriesData.forEach(category => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = category.name;
        button.onclick = () => filterByCategory(category.name);
        filterButtonsContainer.appendChild(button);
    });
}

// Filter by category
function filterByCategory(categoryName) {
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (categoryName === 'all') {
        buttons[0].classList.add('active');
        renderProducts();
    } else {
        const targetButton = Array.from(buttons).find(btn => btn.textContent === categoryName);
        if (targetButton) targetButton.classList.add('active');
        
        // Filter products
        const filteredProducts = productsData.filter(product => product.category === categoryName);
        renderFilteredProducts(filteredProducts, categoryName);
    }
}

// Global variables for pagination
let currentProducts = [];
let displayedCount = 6;
const PRODUCTS_PER_PAGE = 6;

// Render all products
function renderProducts() {
    const productGrid = document.getElementById('productGrid');
    const sectionTitle = document.querySelector('.featured h2');
    
    currentProducts = [...productsData];
    displayedCount = PRODUCTS_PER_PAGE;
    
    renderProductsWithPagination();
}

// Render products with pagination
function renderProductsWithPagination() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';
    
    if (currentProducts.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No products found in this collection.</p>';
        return;
    }
    
    // Show only first 6 products
    const productsToShow = currentProducts.slice(0, displayedCount);
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
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
    
    // Add "See All Products" button if there are more products
    if (currentProducts.length > displayedCount) {
        const viewMoreBtn = document.createElement('button');
        viewMoreBtn.className = 'view-more-btn';
        const sectionTitle = document.querySelector('.featured h2').textContent;
        viewMoreBtn.textContent = `See All ${sectionTitle} (${currentProducts.length} total)`;
        viewMoreBtn.onclick = () => {
            // Store all products for the category page (show all products)
            localStorage.setItem('selectedCategory', 'All Products');
            localStorage.setItem('categoryProducts', JSON.stringify(currentProducts));
            // Open category page in same tab
            window.location.href = 'category.html';
        };
        productGrid.appendChild(viewMoreBtn);
    }
}

// Load more products
function loadMoreProducts() {
    displayedCount += PRODUCTS_PER_PAGE;
    renderProductsWithPagination();
}

// Render filtered products
function renderFilteredProducts(products, title) {
    const productGrid = document.getElementById('productGrid');
    const sectionTitle = document.querySelector('.featured h2');
    
    if (title) {
        sectionTitle.textContent = title;
    }
    
    currentProducts = [...products];
    displayedCount = PRODUCTS_PER_PAGE;
    
    renderProductsWithPagination();
}

// View individual product
function viewProduct(productId) {
    const product = productsData.find(p => p.id === productId);
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
    const imageUrl = getProductImage(product);
    modalImage.src = imageUrl;
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

// Explore category from modal
function exploreCategory() {
    closeProductModal();
    // Implementation depends on your navigation structure
    window.location.href = 'category.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupImageObserver();
    loadProducts();
    
    // Check for stored search term after products are loaded
    setTimeout(() => {
        checkStoredSearch();
    }, 200);
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (modal && event.target === modal) {
        closeProductModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeProductModal();
    }
});
