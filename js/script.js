window.onload = function () {
  const dateEl = document.createElement("div");
  dateEl.style.textAlign = "center";
  dateEl.innerText = new Date().toLocaleString();
  document.body.appendChild(dateEl);
};

// Обработка поиска
const searchInput = document.getElementById('search');
const searchButton = searchInput.nextElementSibling;

searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
        // Здесь можно добавить логику поиска
        console.log('Поиск:', searchTerm);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Обработка добавления в корзину
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('h4').textContent;
        
        // Анимация добавления в корзину
        this.textContent = 'Добавлено!';
        this.classList.add('added');
        
        setTimeout(() => {
            this.textContent = 'В корзину';
            this.classList.remove('added');
        }, 2000);
        
        // Здесь можно добавить логику добавления в корзину
        console.log('Добавлено в корзину:', productName);
    });
});

// Анимация при прокрутке
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.product-card, .category-card, .feature');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Мобильное меню
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-button';
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    nav.parentElement.insertBefore(menuButton, nav);
    
    menuButton.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuButton.classList.toggle('active');
    });
};

// Проверяем, мобильное ли устройство
if (window.innerWidth <= 768) {
    createMobileMenu();
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-button')) {
            createMobileMenu();
        }
    } else {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.remove();
            document.querySelector('nav').classList.remove('active');
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице каталога
    const isCatalogPage = document.querySelector('.catalog-container') !== null;
    
    // Инициализируем компоненты в зависимости от страницы
    if (isCatalogPage) {
        initFilters();
        initSorting();
        initViewOptions();
        initPagination();
    }
    
    // Эти функции работают на всех страницах
    initAddToCart();
    initSearch();
});

// Функционал фильтров
function initFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
    const priceRange = document.querySelector('.price-range input[type="range"]');
    const priceInputs = document.querySelectorAll('.price-inputs input');
    const applyFiltersBtn = document.querySelector('.apply-filters');

    // Обработка чекбоксов
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            console.log('Фильтр изменен:', this.parentElement.textContent.trim());
        });
    });

    // Обработка ползунка цены
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            const value = this.value;
            priceInputs[1].value = value;
        });
    }

    // Обработка полей ввода цены
    priceInputs.forEach(input => {
        input.addEventListener('change', function() {
            const minPrice = parseInt(priceInputs[0].value) || 0;
            const maxPrice = parseInt(priceInputs[1].value) || 200000;
            
            if (minPrice > maxPrice) {
                alert('Минимальная цена не может быть больше максимальной');
                this.value = '';
            }
        });
    });

    // Применение фильтров
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const selectedCategories = Array.from(document.querySelectorAll('.filter-section:nth-child(1) input:checked'))
                .map(cb => cb.parentElement.textContent.trim());
            const selectedBrands = Array.from(document.querySelectorAll('.filter-section:nth-child(2) input:checked'))
                .map(cb => cb.parentElement.textContent.trim());
            const minPrice = parseInt(priceInputs[0].value) || 0;
            const maxPrice = parseInt(priceInputs[1].value) || 200000;

            console.log('Применены фильтры:', {
                categories: selectedCategories,
                brands: selectedBrands,
                priceRange: [minPrice, maxPrice]
            });

            filterProducts(selectedCategories, selectedBrands, minPrice, maxPrice);
        });
    }
}

// Функционал сортировки
function initSorting() {
    const sortSelect = document.querySelector('.sort-options select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            console.log('Сортировка изменена:', sortValue);
            sortProducts(sortValue);
        });
    }
}

// Функционал переключения вида отображения
function initViewOptions() {
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const productGrid = document.querySelector('.product-grid');

    if (gridViewBtn && listViewBtn && productGrid) {
        gridViewBtn.addEventListener('click', function() {
            productGrid.classList.remove('list-view-active');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', function() {
            productGrid.classList.add('list-view-active');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });
    }
}

// Функционал пагинации
function initPagination() {
    const pageButtons = document.querySelectorAll('.page-numbers button');
    const prevButton = document.querySelector('.prev-page');
    const nextButton = document.querySelector('.next-page');

    if (pageButtons.length) {
        pageButtons.forEach(button => {
            button.addEventListener('click', function() {
                pageButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const page = this.textContent;
                console.log('Переход на страницу:', page);
            });
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-numbers button.active');
            if (currentPage && currentPage.previousElementSibling) {
                currentPage.previousElementSibling.click();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-numbers button.active');
            if (currentPage && currentPage.nextElementSibling) {
                currentPage.nextElementSibling.click();
            }
        });
    }
}

// Функционал добавления в корзину
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('.product-price strong').textContent;
            
            // Анимация добавления в корзину
            this.textContent = 'Добавлено ✓';
            this.classList.add('added');
            
            setTimeout(() => {
                this.textContent = 'В корзину';
                this.classList.remove('added');
            }, 2000);

            console.log('Товар добавлен в корзину:', {
                name: productName,
                price: productPrice
            });

            addToCart(productName, productPrice);
        });
    });
}

// Функционал поиска
function initSearch() {
    const searchInput = document.querySelector('#search');
    const searchButton = searchInput?.nextElementSibling;

    if (searchInput && searchButton) {
        const performSearch = () => {
            const searchQuery = searchInput.value.trim();
            if (searchQuery) {
                console.log('Поиск:', searchQuery);
                // Если мы на странице каталога, используем фильтрацию
                if (document.querySelector('.catalog-container')) {
                    searchProducts(searchQuery);
                } else {
                    // На главной странице просто логируем поиск
                    console.log('Поиск на главной странице:', searchQuery);
                }
            }
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Вспомогательные функции
function filterProducts(categories, brands, minPrice, maxPrice) {
    const products = document.querySelectorAll('.catalog-container .product-card');
    let visibleCount = 0;
    
    products.forEach(product => {
        const price = parseInt(product.querySelector('.product-price strong').textContent.replace(/[^\d]/g, ''));
        const productName = product.querySelector('h4').textContent.toLowerCase();
        
        let showProduct = true;

        // Фильтрация по цене
        if (price < minPrice || price > maxPrice) {
            showProduct = false;
        }

        // Фильтрация по категориям и брендам
        if (categories.length > 0 || brands.length > 0) {
            const matchesCategory = categories.length === 0 || categories.some(cat => 
                productName.includes(cat.toLowerCase())
            );
            const matchesBrand = brands.length === 0 || brands.some(brand => 
                productName.includes(brand.toLowerCase())
            );
            
            showProduct = showProduct && (matchesCategory || matchesBrand);
        }

        // Используем opacity и visibility вместо display
        if (showProduct) {
            product.style.opacity = '1';
            product.style.visibility = 'visible';
            product.style.position = 'relative';
            visibleCount++;
        } else {
            product.style.opacity = '0';
            product.style.visibility = 'hidden';
            product.style.position = 'absolute';
        }
    });

    // Показываем сообщение, если нет результатов
    const noResultsMessage = document.querySelector('.no-results-message');
    if (visibleCount === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = '<p>Товары не найдены</p><button class="reset-filters">Сбросить фильтры</button>';
            document.querySelector('.product-grid').appendChild(message);

            // Добавляем обработчик для кнопки сброса
            message.querySelector('.reset-filters').addEventListener('click', function() {
                resetFilters();
            });
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function resetFilters() {
    // Сбрасываем все чекбоксы
    document.querySelectorAll('.filter-section input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Сбрасываем поля цены
    const priceInputs = document.querySelectorAll('.price-inputs input');
    priceInputs[0].value = '';
    priceInputs[1].value = '';

    // Сбрасываем ползунок цены
    const priceRange = document.querySelector('.price-range input[type="range"]');
    if (priceRange) {
        priceRange.value = priceRange.max;
    }

    // Показываем все товары
    document.querySelectorAll('.catalog-container .product-card').forEach(product => {
        product.style.opacity = '1';
        product.style.visibility = 'visible';
        product.style.position = 'relative';
    });

    // Удаляем сообщение об отсутствии результатов
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function sortProducts(sortValue) {
    const productGrid = document.querySelector('.catalog-container .product-grid');
    const products = Array.from(productGrid.children);

    products.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.product-price strong').textContent.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.querySelector('.product-price strong').textContent.replace(/[^\d]/g, ''));
        const ratingA = a.querySelector('.product-rating').textContent.match(/\d+/)[0];
        const ratingB = b.querySelector('.product-rating').textContent.match(/\d+/)[0];

        switch(sortValue) {
            case 'Цене (по возрастанию)':
                return priceA - priceB;
            case 'Цене (по убыванию)':
                return priceB - priceA;
            case 'Популярности':
                return ratingB - ratingA;
            default:
                return 0;
        }
    });

    products.forEach(product => productGrid.appendChild(product));
}

// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция добавления товара в корзину
function addToCart(product) {
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
    
    saveCart();
    showNotification('Товар добавлен в корзину');
}

// Функция сохранения корзины
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
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

// Обработчик клика по кнопке "В корзину"
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const product = {
            id: productCard.querySelector('h4').textContent,
            name: productCard.querySelector('h4').textContent,
            price: parseInt(productCard.querySelector('.product-price strong').textContent.replace(/[^\d]/g, '')),
            image: productCard.querySelector('img').src
        };
        
        addToCart(product);
    }
});

function searchProducts(query) {
    const products = document.querySelectorAll('.catalog-container .product-card');
    const searchQuery = query.toLowerCase();

    products.forEach(product => {
        const productName = product.querySelector('h4').textContent.toLowerCase();
        const productDescription = product.querySelector('.product-description').textContent.toLowerCase();
        
        const matches = productName.includes(searchQuery) || productDescription.includes(searchQuery);
        product.style.display = matches ? 'block' : 'none';
    });
}
