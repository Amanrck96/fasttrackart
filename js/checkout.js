// Checkout functionality
let orderTotal = 0;

function loadCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    const total = document.getElementById('checkout-total');
    const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
    
    orderTotal = 0;
    checkoutItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'checkout-item';
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity || 1}</p>
            </div>
            <div class="item-price">₹${item.price * (item.quantity || 1)}</div>
        `;
        checkoutItems.appendChild(itemElement);
        
        orderTotal += item.price * (item.quantity || 1);
    });
    
    total.textContent = `₹${orderTotal}`;
}

// Handle payment method selection
document.querySelectorAll('input[name="payment"]').forEach(input => {
    input.addEventListener('change', (e) => {
        const upiDetails = document.getElementById('upi-details');
        upiDetails.style.display = e.target.value === 'upi' ? 'block' : 'none';
    });
});

// Validate Cooch Behar pincode
function isValidPincode(pincode) {
    // Only allow pincode 736101
    return pincode === '736101';
}

// Handle form submission
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pincode = document.getElementById('pincode').value;
    if (!isValidPincode(pincode)) {
        alert('Sorry, we currently only deliver in Cooch Behar area (PIN: 736101)');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === 'upi') {
        const upiRef = document.getElementById('upi-ref').value;
        if (!upiRef) {
            alert('Please enter UPI reference number');
            return;
        }
    }
    
    // Collect order data
    const orderData = {
        items: JSON.parse(sessionStorage.getItem('cart')),
        total: orderTotal,
        customer: {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            pincode: pincode
        },
        payment: {
            method: paymentMethod,
            upiRef: paymentMethod === 'upi' ? document.getElementById('upi-ref').value : null
        },
        status: 'pending',
        timestamp: new Date().toISOString()
    };
    
    // Store order in localStorage for demo purposes
    // In production, this would be sent to a server
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    sessionStorage.removeItem('cart');
    
    // Show success message and redirect
    alert('Order placed successfully!');
    window.location.href = 'index.html';
});

// Initialize checkout page
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutItems();
});
