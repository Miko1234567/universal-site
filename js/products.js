'use strict';

/**
 * Assignment 4 & 5 - Universal Store Products Logic
 * Real Project Logic & Features:
 * - Dynamic generation of catalog with 6 items
 * - Search, category filtering, and price sorting via JS DOM
 * - Counter and Empty state handling
 * - Like/Wishlist toggle feature
 * - Field-level validation and safe textContent dynamic output
 */

// ==========================================
// 1. DATA ARRAY (6 Detailed Products)
// ==========================================
const productsData = [
  {
    id: 'prod-1',
    title: 'Autumn Jacket',
    category: 'jackets',
    price: 19900,
    badge: 'NEW',
    desc: 'Light jacket perfect for windy weather in Aktau. High durability and comfortable fit.',
    image: 'images/autumn-jacket.jpg',
    stock: 3
  },
  {
    id: 'prod-2',
    title: 'Knitted Sweater',
    category: 'sweaters',
    price: 9900,
    badge: 'POPULAR',
    desc: 'Warm woolen sweater available in dark and beige colors. Easy to wash and maintain.',
    image: 'images/knitted-sweater.jpg',
    stock: 7
  },
  {
    id: 'prod-3',
    title: 'Casual Cotton T-Shirt',
    category: 'tshirts',
    price: 3500,
    badge: 'BESTSELLER',
    desc: '100% breathable natural cotton t-shirt for daily comfort during warmer days.',
    image: 'images/cotton-tshirt.jpg',
    stock: 12
  },
  {
    id: 'prod-4',
    title: 'Classic Denim Jeans',
    category: 'pants',
    price: 12900,
    badge: 'STAPLE',
    desc: 'Durable blue denim jeans with classic fit suitable for modern casual wear.',
    image: 'images/denim-jeans.jpg',
    stock: 2
  },
  {
    id: 'prod-5',
    title: 'Winter Puffer Coat',
    category: 'jackets',
    price: 29900,
    badge: 'SALE',
    desc: 'Heavy insulated water-resistant winter coat designed for severe cold.',
    image: 'images/winter-coat.jpg',
    stock: 5
  },
  {
    id: 'prod-6',
    title: 'Woolen Scarf & Beanie',
    category: 'accessories',
    price: 4500,
    badge: 'LIMITED',
    desc: 'Stylish knitted accessory set matching autumn and winter outfits.',
    image: 'images/scarf-beanie.jpg',
    stock: 4
  }
];

// Active State Variables
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';
let wishlistCount = 0;

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function generateOrderReference() {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `DEMO-ORD-${randomNum}`;
}

// ==========================================
// 3. FILTER CONTROLS & DOM CREATION
// ==========================================

const productsSection = document.getElementById('featured-products');
const orderItemSelect = document.getElementById('order-item');

function setupFilterControls() {
  if (!productsSection) return;

  const filterContainer = document.createElement('div');
  filterContainer.className = 'col-12 mb-4';

  const card = document.createElement('div');
  card.className = 'card shadow-sm border-0 p-3 bg-white';

  const row = document.createElement('div');
  row.className = 'row g-3 align-items-center';

  // Search Input
  const searchCol = document.createElement('div');
  searchCol.className = 'col-12 col-md-4';
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'form-control';
  searchInput.placeholder = 'Search products...';
  searchInput.id = 'catalog-search-input';
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase();
    updateCatalog();
  });
  searchCol.appendChild(searchInput);

  // Category Filter
  const catCol = document.createElement('div');
  catCol.className = 'col-12 col-sm-6 col-md-3';
  const catSelect = document.createElement('select');
  catSelect.className = 'form-select';
  catSelect.id = 'catalog-category-select';
  
  const categories = [
    { value: 'all', text: 'All Categories' },
    { value: 'jackets', text: 'Jackets' },
    { value: 'sweaters', text: 'Sweaters' },
    { value: 'tshirts', text: 'T-Shirts' },
    { value: 'pants', text: 'Pants' },
    { value: 'accessories', text: 'Accessories' }
  ];

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.value;
    opt.textContent = cat.text;
    catSelect.appendChild(opt);
  });

  catSelect.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    updateCatalog();
  });
  catCol.appendChild(catSelect);

  // Sort Filter
  const sortCol = document.createElement('div');
  sortCol.className = 'col-12 col-sm-6 col-md-3';
  const sortSelect = document.createElement('select');
  sortSelect.className = 'form-select';
  sortSelect.id = 'catalog-sort-select';

  const sortOptions = [
    { value: 'default', text: 'Sort by: Featured' },
    { value: 'low-high', text: 'Price: Low to High' },
    { value: 'high-low', text: 'Price: High to Low' }
  ];

  sortOptions.forEach(optData => {
    const opt = document.createElement('option');
    opt.value = optData.value;
    opt.textContent = optData.text;
    sortSelect.appendChild(opt);
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    updateCatalog();
  });
  sortCol.appendChild(sortSelect);

  // Counter & Reset
  const infoCol = document.createElement('div');
  infoCol.className = 'col-12 col-md-2 text-md-end';
  
  const countBadge = document.createElement('span');
  countBadge.className = 'badge bg-secondary p-2 me-2';
  countBadge.id = 'product-count-badge';
  countBadge.textContent = 'Items: 6';

  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn btn-outline-secondary btn-sm';
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    currentFilter = 'all';
    currentSearch = '';
    currentSort = 'default';
    searchInput.value = '';
    catSelect.value = 'all';
    sortSelect.value = 'default';
    updateCatalog();
  });

  infoCol.appendChild(countBadge);
  infoCol.appendChild(resetBtn);

  row.appendChild(searchCol);
  row.appendChild(catCol);
  row.appendChild(sortCol);
  row.appendChild(infoCol);

  card.appendChild(row);
  filterContainer.appendChild(card);

  // Insert before products list
  productsSection.parentNode.insertBefore(filterContainer, productsSection);
}

function updateCatalog() {
  let filtered = productsData.filter(item => {
    const matchesCategory = currentFilter === 'all' || item.category === currentFilter;
    const matchesSearch = item.title.toLowerCase().includes(currentSearch) || item.desc.toLowerCase().includes(currentSearch);
    return matchesCategory && matchesSearch;
  });

  if (currentSort === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  const countBadge = document.getElementById('product-count-badge');
  if (countBadge) {
    countBadge.textContent = `Items: ${filtered.length}`;
  }

  renderProducts(filtered);
}

// ==========================================
// 4. RENDER PRODUCTS CARDS
// ==========================================

function renderProducts(items) {
  if (!productsSection) return;

  productsSection.textContent = '';

  if (items.length === 0) {
    const emptyCol = document.createElement('div');
    emptyCol.className = 'col-12 text-center py-5';

    const emptyText = document.createElement('p');
    emptyText.className = 'text-muted fs-5 fw-medium mb-0';
    emptyText.textContent = 'No products match your selected criteria.';

    emptyCol.appendChild(emptyText);
    productsSection.appendChild(emptyCol);
    return;
  }

  items.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm border-0 overflow-hidden';
    card.id = `card-${product.id}`;

    // Image
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.title;
    img.className = 'card-img-top object-fit-cover';
    img.style.height = '200px';

    img.addEventListener('error', () => {
      img.src = 'https://via.placeholder.com/400x200?text=Universal+Store';
    });

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column p-4';

    const topMeta = document.createElement('div');
    topMeta.className = 'd-flex justify-content-between align-items-center mb-2';

    const badge = document.createElement('span');
    badge.className = 'badge bg-primary';
    badge.textContent = product.badge;

    // Like Button
    const likeBtn = document.createElement('button');
    likeBtn.className = 'btn btn-outline-danger btn-sm border-0';
    likeBtn.innerHTML = '&#x2661;'; // Heart icon
    likeBtn.title = 'Add to Wishlist';
    
    likeBtn.addEventListener('click', () => {
      if (likeBtn.classList.contains('active')) {
        likeBtn.classList.remove('active');
        likeBtn.innerHTML = '&#x2661;';
        wishlistCount = Math.max(0, wishlistCount - 1);
      } else {
        likeBtn.classList.add('active');
        likeBtn.innerHTML = '&#x2665;'; // Filled Heart
        wishlistCount++;
      }
    });

    topMeta.appendChild(badge);
    topMeta.appendChild(likeBtn);

    const title = document.createElement('h3');
    title.className = 'h5 card-title fw-bold text-dark';
    title.textContent = product.title;

    const desc = document.createElement('p');
    desc.className = 'card-text text-muted flex-grow-1';
    desc.textContent = product.desc;

    const stockInfo = document.createElement('div');
    stockInfo.className = product.stock < 4 ? 'small text-danger fw-bold mb-2' : 'small text-success fw-bold mb-2';
    stockInfo.textContent = product.stock < 4 ? `Only ${product.stock} left in stock!` : 'In Stock';

    const price = document.createElement('div');
    price.className = 'h5 text-primary fw-bold mb-3';
    price.textContent = `${product.price.toLocaleString()} KZT`;

    const orderBtn = document.createElement('button');
    orderBtn.type = 'button';
    orderBtn.className = 'btn btn-primary w-100 mt-auto';
    orderBtn.textContent = 'Order Now';
    orderBtn.setAttribute('data-bs-toggle', 'modal');
    orderBtn.setAttribute('data-bs-target', '#orderModal');

    orderBtn.addEventListener('click', () => {
      if (orderItemSelect) {
        for (let option of orderItemSelect.options) {
          if (option.text.toLowerCase().includes(product.title.toLowerCase())) {
            orderItemSelect.value = option.value;
            break;
          }
        }
      }
    });

    cardBody.appendChild(topMeta);
    cardBody.appendChild(title);
    cardBody.appendChild(desc);
    cardBody.appendChild(stockInfo);
    cardBody.appendChild(price);
    cardBody.appendChild(orderBtn);

    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);

    productsSection.appendChild(col);
  });
}

// ==========================================
// 5. FORM VALIDATION
// ==========================================

const orderForm = document.getElementById('order-form');
const nameInput = document.getElementById('order-name');
const phoneInput = document.getElementById('order-phone');
const addressInput = document.getElementById('order-address');
const confirmationArea = document.getElementById('order-confirmation-message');

const nameError = document.getElementById('name-error');
const phoneError = document.getElementById('phone-error');
const addressError = document.getElementById('address-error');

function handleOrderSubmit(e) {
  e.preventDefault();

  let isValid = true;
  let firstInvalidInput = null;

  // Reset states
  [nameInput, phoneInput, addressInput].forEach(field => {
    if (field) field.classList.remove('is-error', 'is-success');
  });

  [nameError, phoneError, addressError].forEach(err => {
    if (err) err.classList.add('d-none');
  });

  if (confirmationArea) {
    confirmationArea.textContent = '';
    confirmationArea.className = 'mt-3 text-center fw-bold';
  }

  // 1. Name
  const nameVal = nameInput ? nameInput.value.trim() : '';
  if (nameVal.length < 2) {
    isValid = false;
    if (nameInput) nameInput.classList.add('is-error');
    if (nameError) nameError.classList.remove('d-none');
    if (!firstInvalidInput) firstInvalidInput = nameInput;
  } else if (nameInput) {
    nameInput.classList.add('is-success');
  }

  // 2. Phone
  const phoneVal = phoneInput ? phoneInput.value.trim() : '';
  const phoneRegex = /^\+?[0-9\s\-\(\)]{8,15}$/;
  if (!phoneRegex.test(phoneVal)) {
    isValid = false;
    if (phoneInput) phoneInput.classList.add('is-error');
    if (phoneError) phoneError.classList.remove('d-none');
    if (!firstInvalidInput) firstInvalidInput = phoneInput;
  } else if (phoneInput) {
    phoneInput.classList.add('is-success');
  }

  // 3. Address
  const addressVal = addressInput ? addressInput.value.trim() : '';
  if (addressVal.length < 5) {
    isValid = false;
    if (addressInput) addressInput.classList.add('is-error');
    if (addressError) addressError.classList.remove('d-none');
    if (!firstInvalidInput) firstInvalidInput = addressInput;
  } else if (addressInput) {
    addressInput.classList.add('is-success');
  }

  if (!isValid) {
    if (firstInvalidInput) firstInvalidInput.focus();
    return;
  }

  // Success Confirmation
  const refCode = generateOrderReference();
  const selectedItemText = orderItemSelect ? orderItemSelect.options[orderItemSelect.selectedIndex].text : 'Selected Item';

  if (confirmationArea) {
    confirmationArea.classList.add('text-success', 'is-success', 'p-3', 'rounded');
    confirmationArea.textContent = `Order Request Received! Ref: ${refCode}. Customer: ${nameVal}. Item: ${selectedItemText}. Note: This is a front-end demonstration; no real order or payment is processed.`;
  }

  if (orderForm) {
    orderForm.reset();
  }
}

// ==========================================
// 6. INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  setupFilterControls();
  renderProducts(productsData);

  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmit);
  }
});