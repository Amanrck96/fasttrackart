// Cart functionality
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const subtotal = document.getElementById('cart-subtotal');
    let total = 0;

    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
            </div>
            <div class="item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity || 1}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(itemElement);
        
        total += item.price * (item.quantity || 1);
    });

    subtotal.textContent = `₹${total}`;
    updateCartCount();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save cart to session storage
    sessionStorage.setItem('cart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// Initialize cart display
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});
