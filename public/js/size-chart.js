// Mobile menu toggle
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


// Size chart data
const sizeChartData = {
    'Tee': {
        title: 'T-Shirts & Tops',
        subtitle: 'Sports T-Shirts, Polo Shirts and Casual Tops',
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        data: [
            ['XS', '36-38', '25', '16.5', '7.5'],
            ['S', '38-40', '26', '17.5', '8'],
            ['M', '40-42', '27', '18.5', '8.5'],
            ['L', '42-44', '28', '19.5', '9'],
            ['XL', '44-46', '29', '20.5', '9.5'],
            ['2XL', '46-48', '30', '21.5', '10']
        ]
    },
    'Upper': {
        title: 'Upper Wear',
        subtitle: 'Jackets, Hoodies and Upper Body Sportswear',
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        data: [
            ['XS', '36-38', '25', '16.5', '24.5'],
            ['S', '38-40', '26', '17.5', '25.5'],
            ['M', '40-42', '27', '18.5', '26.5'],
            ['L', '42-44', '28', '19.5', '27.5'],
            ['XL', '44-46', '29', '20.5', '28.5'],
            ['2XL', '46-48', '30', '21.5', '29.5']
        ]
    },
    'Jacket': {
        title: 'Jackets & Outerwear',
        subtitle: 'Sports Jackets, Windbreakers and Outerwear',
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        data: [
            ['XS', '36-38', '25', '16.5', '24.5'],
            ['S', '38-40', '26', '17.5', '25.5'],
            ['M', '40-42', '27', '18.5', '26.5'],
            ['L', '42-44', '28', '19.5', '27.5'],
            ['XL', '44-46', '29', '20.5', '28.5'],
            ['2XL', '46-48', '30', '21.5', '29.5']
        ]
    },
    'Shorts': {
        title: 'Shorts & Bottoms',
        subtitle: 'Sports Shorts and Training Bottoms',
        headers: ['Size', 'Waist (inches)', 'Length (inches)', 'Hip (inches)', 'Thigh (inches)'],
        data: [
            ['XS', '28-30', '18', '36-38', '20-22'],
            ['S', '30-32', '19', '38-40', '22-24'],
            ['M', '32-34', '20', '40-42', '24-26'],
            ['L', '34-36', '21', '42-44', '26-28'],
            ['XL', '36-38', '22', '44-46', '28-30'],
            ['2XL', '38-40', '23', '46-48', '30-32']
        ]
    },
    'Lower': {
        title: 'Lower Wear',
        subtitle: 'Track Pants, Joggers and Lower Body Sportswear',
        headers: ['Size', 'Waist (inches)', 'Length (inches)', 'Hip (inches)', 'Thigh (inches)'],
        data: [
            ['XS', '28-30', '38', '36-38', '22-24'],
            ['S', '30-32', '40', '38-40', '24-26'],
            ['M', '32-34', '42', '40-42', '26-28'],
            ['L', '34-36', '44', '42-44', '28-30'],
            ['XL', '36-38', '46', '44-46', '30-32'],
            ['2XL', '38-40', '48', '46-48', '32-34']
        ]
    },
    'Track Pant': {
        title: 'Track Pants',
        subtitle: 'Athletic Track Pants and Training Bottoms',
        headers: ['Size', 'Waist (inches)', 'Length (inches)', 'Hip (inches)', 'Thigh (inches)'],
        data: [
            ['XS', '28-30', '38', '36-38', '22-24'],
            ['S', '30-32', '40', '38-40', '24-26'],
            ['M', '32-34', '42', '40-42', '26-28'],
            ['L', '34-36', '44', '42-44', '28-30'],
            ['XL', '36-38', '46', '44-46', '30-32'],
            ['2XL', '38-40', '48', '46-48', '32-34']
        ]
    },
    'Track Suit': {
        title: 'Track Suits',
        subtitle: 'Complete Training Sets and Coordinated Outfits',
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Waist (inches)', 'Inseam (inches)'],
        data: [
            ['XS', '36-38', '25', '28-30', '28'],
            ['S', '38-40', '26', '30-32', '29'],
            ['M', '40-42', '27', '32-34', '30'],
            ['L', '42-44', '28', '34-36', '31'],
            ['XL', '44-46', '29', '36-38', '32'],
            ['2XL', '46-48', '30', '38-40', '33']
        ]
    }
};

// Initialize size chart
document.addEventListener('DOMContentLoaded', function() {
    initializeSizeChart();
    setupMobileMenu();
    setupWhatsAppFloat();
});

// Initialize size chart functionality
function initializeSizeChart() {
    const tabs = document.querySelectorAll('.size-tab');
    const categoryTitle = document.getElementById('categoryTitle');
    const categorySubtitle = document.querySelector('.size-section-sub');
    const sizeTable = document.getElementById('sizeTable');
    
    // Set initial active tab
    updateSizeChart('Jacket');
    
    // Add click event listeners to tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update size chart
            const category = this.textContent;
            updateSizeChart(category);
        });
    });
}

// Update size chart based on selected category
function updateSizeChart(category) {
    const categoryData = sizeChartData[category];
    if (!categoryData) {
        console.error(`No size data found for category: ${category}`);
        return;
    }
    
    // Update title and subtitle
    document.getElementById('categoryTitle').textContent = categoryData.title;
    const subtitleElement = document.querySelector('.size-section-sub');
    if (subtitleElement) {
        subtitleElement.textContent = categoryData.subtitle;
    }
    
    // Update table
    updateSizeTable(categoryData);
    
    // Update tips if needed
    updateSizeTips(category);
}

// Update size table
function updateSizeTable(categoryData) {
    const table = document.getElementById('sizeTable');
    if (!table) return;
    
    // Clear existing table content
    table.innerHTML = '';
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    categoryData.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    categoryData.data.forEach(rowData => {
        const row = document.createElement('tr');
        
        rowData.forEach((cellData, index) => {
            const td = document.createElement('td');
            td.textContent = cellData;
            
            // Add special styling for size column (first column)
            if (index === 0) {
                td.style.fontWeight = '700';
                td.style.color = '#dcb639';
            }
            
            row.appendChild(td);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
}

// Update size tips based on category
function updateSizeTips(category) {
    const tipsContainer = document.querySelector('.size-tips');
    if (!tipsContainer) return;
    
    const tips = getTipsForCategory(category);
    const tipsList = document.createElement('div');
    
    tips.forEach(tip => {
        const tipElement = document.createElement('p');
        tipElement.innerHTML = `<strong>${tip.label}:</strong> ${tip.description}`;
        tipsList.appendChild(tipElement);
    });
    
    // Clear existing tips and add new ones
    const existingTips = tipsContainer.querySelectorAll('p');
    existingTips.forEach(tip => tip.remove());
    
    tipsContainer.appendChild(tipsList);
}

// Get tips specific to category
function getTipsForCategory(category) {
    const generalTips = [
        {
            label: 'Fit Guide',
            description: 'Choose the size that matches your largest measurement for the best fit.'
        },
        {
            label: 'Size Up',
            description: 'If you\'re between sizes, we recommend sizing up for comfort.'
        }
    ];
    
    const categorySpecificTips = {
        'Tee': [
            {
                label: 'Chest',
                description: 'Measure around the fullest part of your chest, keeping the tape measure horizontal.'
            },
            {
                label: 'Length',
                description: 'For tops, measure from the highest point of the shoulder to the hem.'
            }
        ],
        'Upper': [
            {
                label: 'Chest',
                description: 'Measure around the fullest part of your chest, keeping the tape measure horizontal.'
            },
            {
                label: 'Shoulder',
                description: 'Measure from one shoulder point to the other across the back.'
            },
            {
                label: 'Sleeve',
                description: 'Measure from the shoulder seam to the end of the cuff.'
            }
        ],
        'Jacket': [
            {
                label: 'Chest',
                description: 'Measure around the fullest part of your chest, wearing a light shirt.'
            },
            {
                label: 'Shoulder',
                description: 'Measure from one shoulder point to the other across the back.'
            },
            {
                label: 'Sleeve',
                description: 'Measure from the shoulder seam to the end of the cuff, arm slightly bent.'
            }
        ],
        'Shorts': [
            {
                label: 'Waist',
                description: 'Measure around your natural waistline, keeping the tape comfortably loose.'
            },
            {
                label: 'Hip',
                description: 'Measure around the fullest part of your hips.'
            }
        ],
        'Lower': [
            {
                label: 'Waist',
                description: 'Measure around your natural waistline, keeping the tape comfortably loose.'
            },
            {
                label: 'Length',
                description: 'Measure from the waist to the desired length, standing straight.'
            }
        ],
        'Track Pant': [
            {
                label: 'Waist',
                description: 'Measure around your natural waistline, wearing workout attire.'
            },
            {
                label: 'Inseam',
                description: 'Measure from the crotch to the bottom of the pant leg.'
            }
        ],
        'Track Suit': [
            {
                label: 'Chest',
                description: 'Measure around the fullest part of your chest for the jacket fit.'
            },
            {
                label: 'Waist',
                description: 'Measure around your natural waistline for the pants fit.'
            }
        ]
    };
    
    return [...generalTips, ...(categorySpecificTips[category] || [])];
}

// Setup mobile menu
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking on links
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu();
            });
        });
    }
}

// WhatsApp floating button
function setupWhatsAppFloat() {
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function() {
            const phoneNumber = '918888888888'; // Replace with actual number
            const message = encodeURIComponent('Hi! I have a question about ZEBRO Sportswear sizing.');
            
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        });
    }
}

// Print size chart functionality
function printSizeChart() {
    window.print();
}

// Add print button (optional)
function addPrintButton() {
    const header = document.querySelector('.size-chart-header');
    if (header) {
        const printBtn = document.createElement('button');
        printBtn.className = 'print-btn';
        printBtn.textContent = 'Print Size Chart';
        printBtn.onclick = printSizeChart;
        
        // Add print button styles
        printBtn.style.cssText = `
            background: linear-gradient(135deg, #dcb639 0%, #e5c658 100%);
            color: #000;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s ease;
        `;
        
        printBtn.addEventListener('mouseenter', () => {
            printBtn.style.transform = 'translateY(-2px)';
            printBtn.style.boxShadow = '0 4px 15px rgba(220, 182, 57, 0.3)';
        });
        
        printBtn.addEventListener('mouseleave', () => {
            printBtn.style.transform = 'translateY(0)';
            printBtn.style.boxShadow = 'none';
        });
        
        header.appendChild(printBtn);
    }
}

// Initialize print button
addPrintButton();

// Smooth scroll for internal links
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

// Add keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    const tabs = document.querySelectorAll('.size-tab');
    const activeTab = document.querySelector('.size-tab.active');
    
    if (!activeTab) return;
    
    let targetTab = null;
    
    switch(e.key) {
        case 'ArrowLeft':
            targetTab = activeTab.previousElementSibling || tabs[tabs.length - 1];
            break;
        case 'ArrowRight':
            targetTab = activeTab.nextElementSibling || tabs[0];
            break;
        case 'Home':
            targetTab = tabs[0];
            break;
        case 'End':
            targetTab = tabs[tabs.length - 1];
            break;
    }
    
    if (targetTab) {
        e.preventDefault();
        targetTab.click();
        targetTab.focus();
    }
});

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

// Add responsive table handling
function handleResponsiveTable() {
    const table = document.getElementById('sizeTable');
    if (!table) return;
    
    // Check if table needs horizontal scroll on mobile
    function checkTableOverflow() {
        const container = table.parentElement;
        const tableWidth = table.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        if (tableWidth > containerWidth) {
            container.style.overflowX = 'auto';
            container.style.webkitOverflowScrolling = 'touch';
        } else {
            container.style.overflowX = 'visible';
        }
    }
    
    // Check on load and resize
    checkTableOverflow();
    window.addEventListener('resize', checkTableOverflow);
}

// Initialize responsive table handling
handleResponsiveTable();

// Add analytics tracking (optional)
function trackSizeChartView(category) {
    // Add your analytics tracking here
    console.log(`Size chart viewed: ${category}`);
}

// Track tab changes
document.querySelectorAll('.size-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const category = this.textContent;
        trackSizeChartView(category);
    });
});
