// Admin functionality
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'fasttrackart2025'; // Change this in production

// Authentication
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
        document.getElementById('admin-auth').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
    } else {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'block';
        loadAdminData();
    }
}

document.getElementById('admin-login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        checkAuth();
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('logout-btn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('adminAuthenticated');
    checkAuth();
});

// Product Management
function showAddProductForm() {
    document.getElementById('product-form').style.display = 'block';
}

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value
    };
    
    // Add to products
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form and refresh display
    e.target.reset();
    document.getElementById('product-form').style.display = 'none';
    loadAdminData();
});

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const updatedProducts = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        loadAdminData();
    }
}

// Order Management
function updateOrderStatus(orderId, status) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.timestamp === orderId);
    if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadAdminData();
    }
}

// Load admin dashboard data
function loadAdminData() {
    // Load products
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productContainer = document.getElementById('admin-product-container');
    
    productContainer.innerHTML = products.map(product => `
        <div class="admin-product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p>₹${product.price}</p>
                <p>${product.description}</p>
            </div>
            <button onclick="deleteProduct(${product.id})" class="btn-danger">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderList = document.getElementById('order-list');
    
    orderList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h4>Order #${order.timestamp.slice(0,10)}</h4>
                <span class="status ${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customer.name}</p>
                <p><strong>Phone:</strong> ${order.customer.phone}</p>
                <p><strong>Address:</strong> ${order.customer.address}</p>
                <p><strong>Payment:</strong> ${order.payment.method.toUpperCase()}</p>
                <p><strong>Total:</strong> ₹${order.total}</p>
            </div>
            <div class="order-actions">
                <select onchange="updateOrderStatus('${order.timestamp}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </div>
        </div>
    `).join('');
}

// Initialize admin page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});
