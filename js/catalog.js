class Catalog {
  constructor() {
    this.products = [];
    this.init();
  }

  init() {
    this.loadProducts();
    this.renderProducts();
    this.initEventListeners();
  }

  loadProducts() {
    // Здесь можно загружать товары с сервера
    this.products = [
      {
        id: '1',
        name: 'Смартфон iPhone 13',
        price: 79990,
        image: 'images/iphone13.jpg',
        description: 'Новейший смартфон от Apple с мощным процессором и отличной камерой'
      },
      {
        id: '2',
        name: 'Ноутбук MacBook Pro',
        price: 129990,
        image: 'images/macbook.jpg',
        description: 'Мощный ноутбук для профессиональной работы'
      },
      {
        id: '3',
        name: 'Наушники AirPods Pro',
        price: 19990,
        image: 'images/airpods.jpg',
        description: 'Беспроводные наушники с шумоподавлением'
      }
    ];
  }

  renderProducts() {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;

    productsContainer.innerHTML = this.products.map(product => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${product.price.toLocaleString()} ₽</p>
        <button class="add-to-cart-btn" data-id="${product.id}">
          Добавить в корзину
        </button>
      </div>
    `).join('');
  }

  initEventListeners() {
    const productsContainer = document.getElementById('products');
    if (!productsContainer) return;

    productsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = e.target.dataset.id;
        const product = this.products.find(p => p.id === productId);
        
        if (product) {
          // Добавляем товар в корзину
          if (window.cart) {
            window.cart.addItem(product);
            // Перенаправляем на страницу корзины
            window.location.href = 'cart.html';
          }
        }
      }
    });
  }
}

// Инициализация каталога при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  window.catalog = new Catalog();
}); 