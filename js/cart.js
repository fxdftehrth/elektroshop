// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];
console.log('Загруженная корзина:', cart);

// Функция добавления товара в корзину
function addToCart(product) {
    console.log('Добавление товара:', product);
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification('Товар добавлен в корзину');
}

// Функция сохранения корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Корзина сохранена:', cart);
}

// Функция отображения уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Функция обновления количества товара
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
            updateTotal();
            showNotification('Количество товара обновлено');
        } else {
            removeItem(productId);
        }
    }
}

// Функция удаления товара
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateTotal();
    showNotification('Товар удален из корзины');
}

// Функция очистки корзины
function clearCart() {
    cart = [];
    saveCart();
    renderCart();
    updateTotal();
    showNotification('Корзина очищена');
}

// Функция обновления общей суммы
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = `${total.toLocaleString()} ₽`;
    }

    const itemsCountElement = document.getElementById('itemsCount');
    if (itemsCountElement) {
        itemsCountElement.textContent = `${itemsCount} товаров`;
    }

    const finalTotalElement = document.getElementById('finalTotal');
    if (finalTotalElement) {
        finalTotalElement.textContent = `${total.toLocaleString()} ₽`;
    }
}

// Функция отрисовки корзины
function renderCart() {
    console.log('Начало отрисовки корзины');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.querySelector('.cart-content');

    console.log('Элементы корзины:', {
        cartItems: cartItems,
        emptyCart: emptyCart,
        cartContent: cartContent
    });

    if (!cartItems || !emptyCart || !cartContent) {
        console.error('Не найдены необходимые элементы корзины');
        return;
    }

    if (cart.length === 0) {
        console.log('Корзина пуста');
        cartContent.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }

    console.log('Отрисовка товаров:', cart);
    cartContent.style.display = 'grid';
    emptyCart.style.display = 'none';

    // Отрисовка товаров
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">Цена: ${item.price.toLocaleString()} ₽</p>
                    <p class="item-quantity">Количество: ${item.quantity || 1}</p>
                    <p class="item-total">Сумма: ${itemTotal.toLocaleString()} ₽</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');

    // Обновление итогов
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('cartTotal').textContent = `${total.toLocaleString()} ₽`;
    document.getElementById('itemsCount').textContent = `${itemsCount} товаров`;
    document.getElementById('finalTotal').textContent = `${total.toLocaleString()} ₽`;
    
    console.log('Корзина отрисована');
}

// Обработчик клика по кнопке "В корзину" в каталоге
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        console.log('Клик по кнопке "В корзину"');
        const productCard = e.target.closest('.product-card');
        console.log('Карточка товара:', productCard);
        
        const product = {
            id: productCard.querySelector('h4').textContent,
            name: productCard.querySelector('h4').textContent,
            price: parseInt(productCard.querySelector('.product-price strong').textContent.replace(/[^\d]/g, '')),
            image: productCard.querySelector('img').src
        };
        
        console.log('Данные товара:', product);
        addToCart(product);
    }
});

// Обработчики событий в корзине
document.addEventListener('click', (e) => {
    const cartItem = e.target.closest('.cart-item');
    if (!cartItem) return;

    const productId = cartItem.dataset.id;
    const item = cart.find(item => item.id === productId);

    if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        renderCart();
        showNotification('Товар удален из корзины');
    } else if (e.target.classList.contains('minus')) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart();
            renderCart();
        }
    } else if (e.target.classList.contains('plus')) {
        item.quantity += 1;
        saveCart();
        renderCart();
    }
});

// Обработчик для кнопки очистки корзины
const clearCartBtn = document.getElementById('clearCart');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            cart = [];
            saveCart();
            renderCart();
            showNotification('Корзина очищена');
        }
    });
}

// Обработчик для кнопки оформления заказа
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Корзина пуста');
            return;
        }
        showNotification('Переход к оформлению заказа');
    });
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, инициализация корзины');
    renderCart();
}); 