/* ==========================================================================
   OLD PLAIN JAVASCRIPT VERSION (For comparison in Assignment 6)
   This file contains previous Vanilla JS code before rewriting to jQuery.
   ========================================================================== */

// 1. Dynamic Product Rendering (Old JS)
function oldRenderProducts(items) {
  const container = document.getElementById('featured-products');
  if (!container) return;
  container.innerHTML = '';

  items.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card h-100 shadow-sm border-0" id="product-card-${product.id}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-primary mb-2 align-self-start">${product.badge}</span>
          <h3 class="h5 card-title">${product.title}</h3>
          <p class="card-text text-muted">${product.desc}</p>
          <p class="fw-bold text-dark mt-auto">${product.price} KZT</p>
          <button class="btn btn-primary btn-sm w-100 mt-2 order-btn" data-bs-toggle="modal" data-bs-target="#orderModal">Order Now</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// 2. Show / Hide Confirmation Area (Old JS)
function oldToggleConfirmation(show) {
  const area = document.getElementById('order-confirmation-message');
  if (area) {
    if (show) {
      area.classList.remove('is-hidden');
    } else {
      area.classList.add('is-hidden');
    }
  }
}

// 3. Form Validation (Old JS)
function oldValidateForm(e) {
  e.preventDefault();
  const name = document.getElementById('order-name').value.trim();
  const phone = document.getElementById('order-phone').value.trim();
  const address = document.getElementById('order-address').value.trim();

  if (name.length < 2 || phone.length < 8 || address.length < 5) {
    alert('Please fill out all fields correctly!');
    return false;
  }
  return true;
}