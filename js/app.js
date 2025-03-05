// Sample product data (replace with your actual products)
const products = [
    {
        id: 1,
        name: "Abstract Canvas Art",
        price: 1999,
        image: "images/product1.jpg",
        description: "Beautiful abstract art piece perfect for modern homes"
    },
    // Add more products here
];

// Cart functionality
let cart = [];

// Location checking
function checkLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                // Cooch Behar coordinates (exact center)
                const coochBehar = {
                    lat: 26.3452,
                    lng: 89.4482
                };

                // Calculate distance between current location and Cooch Behar
                const distance = calculateDistance(
                    position.coords.latitude,
                    position.coords.longitude,
                    coochBehar.lat,
                    coochBehar.lng
                );

                // If within 5km of Cooch Behar center (more precise)
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

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
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

// Load products
function loadProducts() {
    const container = document.getElementById('product-container');
    products.forEach(product => {
        const productElement = createProductElement(product);
        container.appendChild(productElement);
    });
}

// Create product element
function createProductElement(product) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
        </div>
    `;
    return div;
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
    }
}

function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if location is already verified
    if (!localStorage.getItem('locationVerified')) {
        document.getElementById('locationModal').style.display = 'block';
    }
    
    loadProducts();
});
