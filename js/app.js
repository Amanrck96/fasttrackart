// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        displayProducts(data.products);
    } catch (error) {
        // Fallback products if JSON fails to load
        const fallbackProducts = [
            {
                id: 1,
                name: "Beautiful Landscape Painting",
                price: 2999,
                image: "https://picsum.photos/400/300?random=1",
                description: "Stunning landscape painting of Cooch Behar Palace"
            },
            {
                id: 2,
                name: "Traditional Art Piece",
                price: 1999,
                image: "https://picsum.photos/400/300?random=2",
                description: "Beautiful traditional Bengali art piece"
            },
            {
                id: 3,
                name: "Modern Abstract Art",
                price: 3499,
                image: "https://picsum.photos/400/300?random=3",
                description: "Contemporary abstract art with vibrant colors"
            },
            {
                id: 4,
                name: "Handmade Pottery",
                price: 1499,
                image: "https://picsum.photos/400/300?random=4",
                description: "Traditional handmade pottery from local artisans"
            }
        ];
        displayProducts(fallbackProducts);
    }
}

// Display products in the grid
function displayProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = '';
    products.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}

// Create product card element
function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price">₹${product.price}</p>
            <p class="description">${product.description}</p>
            <button onclick="addToCart(${product.id})" class="btn-primary">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
        </div>
    `;
    return div;
}

// Add to cart function
function addToCart(productId) {
    const products = document.querySelectorAll('.product-card');
    const product = Array.from(products).find(p => p.querySelector('button').onclick.toString().includes(productId));
    
    if (product) {
        const name = product.querySelector('h3').textContent;
        const price = parseInt(product.querySelector('.price').textContent.replace('₹', ''));
        const image = product.querySelector('img').src;
        
        cart.push({ id: productId, name, price, image, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // Show success message
        showNotification('Added to cart!');
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'inline' : 'none';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Location checking
function checkLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Cooch Behar coordinates
                const coochBehar = {
                    lat: 26.3452,
                    lng: 89.4482
                };

                // Calculate distance
                const distance = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    coochBehar.lat,
                    coochBehar.lng
                );

                if (distance <= 5) {
                    document.getElementById('locationModal').style.display = 'none';
                    localStorage.setItem('locationVerified', 'true');
                } else {
                    promptPincode();
                }
            },
            error => {
                console.error("Error getting location:", error);
                promptPincode();
            }
        );
    } else {
        promptPincode();
    }
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

function promptPincode() {
    const pincode = prompt("Please enter your pincode to verify delivery availability:");
    if (pincode === '736101') {
        document.getElementById('locationModal').style.display = 'none';
        localStorage.setItem('locationVerified', 'true');
    } else {
        alert('Sorry, we currently only deliver to PIN: 736101 in Cooch Behar. Please contact support if you believe this is an error.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check location
    if (!localStorage.getItem('locationVerified')) {
        document.getElementById('locationModal').style.display = 'block';
    }
    
    // Load products
    loadProducts();
    
    // Update cart count
    updateCartCount();
});
