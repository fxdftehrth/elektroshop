// Обработка формы отзывов
document.addEventListener('DOMContentLoaded', function() {
  const reviewForm = document.getElementById('reviewForm');

  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('review-name').value;
      const text = document.getElementById('review-text').value;
      
      // Здесь можно добавить код для отправки отзыва на сервер
      alert('Спасибо за ваш отзыв!');
      reviewForm.reset();
    });
  }
});

// Функции для работы с корзиной
function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = count;
  });
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  saveCart(cart);
  updateCartCount();
  
  // Обновляем итоговую сумму на странице корзины
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0));
  
  const totalItemsElement = document.querySelector('.total-items');
  const totalPriceElement = document.querySelector('.total-price');
  
  if (totalItemsElement && totalPriceElement) {
    totalItemsElement.textContent = `${totalItems} шт.`;
    totalPriceElement.textContent = `${totalPrice} ₽`;
  }
  
  showNotification('Товар добавлен в корзину');
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  updateCartCount();
  renderCart();
}

function updateQuantity(productId, quantity) {
  if (quantity < 1) return;
  
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    item.quantity = parseInt(quantity);
    saveCart(cart);
    updateCartCount();
    
    // Обновляем итоговую сумму
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0));
    
    const totalItemsElement = document.querySelector('.total-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (totalItemsElement && totalPriceElement) {
      totalItemsElement.textContent = `${totalItems} шт.`;
      totalPriceElement.textContent = `${totalPrice} ₽`;
    }
    
    // Обновляем отображение корзины
    renderCart();
  }
}

function renderCart() {
  const cartItems = document.querySelector('.cart-items');
  if (!cartItems) return;
  
  const cart = getCart();
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    document.querySelector('.total-items').textContent = '0 шт.';
    document.querySelector('.total-price').textContent = '0 ₽';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <div class="cart-item-price">${Math.round(item.price)} ₽</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" 
                 onchange="updateQuantity('${item.id}', this.value)">
          <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = Math.round(cart.reduce((total, item) => total + (item.price * item.quantity), 0));
  
  document.querySelector('.total-items').textContent = `${totalItems} шт.`;
  document.querySelector('.total-price').textContent = `${totalPrice} ₽`;
}

// Инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  renderCart();
  
  // Обработка оформления заказа
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      const cart = getCart();
      if (cart.length === 0) {
        alert('Корзина пуста');
        return;
      }
      
      // Здесь можно добавить код для оформления заказа
      alert('Заказ оформлен!');
      saveCart([]);
      updateCartCount();
      renderCart();
    });
  }
});

// Функция для показа уведомлений
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.5s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Функция для обработки отправки отзыва
function handleReviewSubmit(event) {
  event.preventDefault();
  
  const nameInput = document.getElementById('review-name');
  const textInput = document.getElementById('review-text');
  
  if (!nameInput.value.trim() || !textInput.value.trim()) {
    showNotification('Пожалуйста, заполните все поля', 'error');
    return;
  }
  
  // Получаем существующие отзывы из localStorage
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  
  // Добавляем новый отзыв
  reviews.push({
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    date: new Date().toLocaleDateString('ru-RU'),
    rating: 5 // По умолчанию 5 звезд
  });
  
  // Сохраняем обновленный список отзывов
  localStorage.setItem('reviews', JSON.stringify(reviews));
  
  // Очищаем форму
  nameInput.value = '';
  textInput.value = '';
  
  // Показываем уведомление об успешной отправке
  showNotification('Спасибо за ваш отзыв!', 'success');
}

// Добавляем обработчик события при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', handleReviewSubmit);
  }
}); 