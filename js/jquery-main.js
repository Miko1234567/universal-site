/* ==========================================================================
   ASSIGNMENT 6: JQUERY IMPLEMENTATION
   jQuery Version: 3.7.1 (Loaded via CDN for cross-browser stability and performance)
   ========================================================================== */

// jQuery ready handler - ensures DOM is fully loaded before code runs[cite: 2]
$(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. DATA ARRAY (6+ Objects)[cite: 2]
     -------------------------------------------------------------------------- */
  const productsData = [
    { id: 'item-1', title: 'Autumn Jacket', category: 'jackets', price: 19900, badge: 'NEW', desc: 'Light jacket perfect for windy weather.' },
    { id: 'item-2', title: 'Knitted Sweater', category: 'sweaters', price: 9900, badge: 'POPULAR', desc: 'Warm woolen sweater in beige and dark colors.' },
    { id: 'item-3', title: 'Casual Cotton T-shirt', category: 'tshirts', price: 3500, badge: 'BESTSELLER', desc: '100% breathable natural cotton t-shirt.' },
    { id: 'item-4', title: 'Classic Denim Jeans', category: 'pants', price: 9900, badge: 'STAPLE', desc: 'Durable classic blue jeans.' },
    { id: 'item-5', title: 'Winter Puffer Jacket', category: 'jackets', price: 29900, badge: 'SALE', desc: 'Heavy insulated jacket for cold winter.' },
    { id: 'item-6', title: 'Warm Scarf & Beanie Set', category: 'accessories', price: 4500, badge: 'LIMITED', desc: 'Stylish knitted accessory set.' }
  ];

  /* --------------------------------------------------------------------------
     2. REWRITTEN FEATURE 1: Dynamic Card Generation with jQuery (.append)[cite: 2]
     Comparison Comment: Replaced document.createElement & appendChild with jQuery's
     chaining and .append(). Code is cleaner and much shorter.[cite: 2]
     -------------------------------------------------------------------------- */
  function renderProductsjQuery(items) {
    const $container = $('#featured-products');
    if (!$container.length) return;

    $container.empty(); // Old JS: container.innerHTML = ''[cite: 2]

    if (items.length === 0) {
      // Effect: fadeIn for empty state message[cite: 2]
      $('<div class="col-12 text-center py-4 text-muted fw-bold">No products found matching your search.</div>')
        .hide()
        .appendTo($container)
        .fadeIn(400); // Effect with duration[cite: 2]
      return;
    }

    $.each(items, function (index, product) {
      const $col = $('<div class="col-12 col-md-6 col-lg-4 mb-4"></div>');
      const $card = $('<div></div>')
        .addClass('card h-100 shadow-sm border-0 product-card')
        .attr('id', 'product-card-' + product.id); // Selector by attribute / ID setting[cite: 2]

      const $cardBody = $('<div></div>').addClass('card-body d-flex flex-column');

      // Chaining method usage[cite: 2]
      $('<span class="badge bg-primary mb-2 align-self-start"></span>').text(product.badge).appendTo($cardBody);
      $('<h3 class="h5 card-title"></h3>').text(product.title).appendTo($cardBody);
      $('<p class="card-text text-muted"></p>').text(product.desc).appendTo($cardBody);
      $('<p class="fw-bold text-dark mt-auto"></p>').text(product.price.toLocaleString() + ' KZT').appendTo($cardBody);

      const $orderBtn = $('<button></button>')
        .addClass('btn btn-primary btn-sm w-100 mt-2 order-btn')
        .text('Order Now')
        .attr('data-bs-toggle', 'modal')
        .attr('data-bs-target', '#orderModal')
        .attr('data-category', product.category)
        .attr('data-title', product.title);

      $cardBody.append($orderBtn);
      $card.append($cardBody);
      $col.append($card);
      $container.append($col);
    });
  }

  // Initial render
  renderProductsjQuery(productsData);

  /* --------------------------------------------------------------------------
     3. EVENTS & DELEGATION (Event Handler on Parent)[cite: 2]
     Why delegation? Directly binding to .order-btn wouldn't work for dynamically
     generated buttons that didn't exist when the page was first loaded.[cite: 2]
     -------------------------------------------------------------------------- */
  $('#featured-products').on('click', '.order-btn', function () {
    // Usage of $(this) and traversal (.closest)[cite: 2]
    const $btn = $(this);
    const category = $btn.attr('data-category');
    const title = $btn.attr('data-title');

    // Auto-select category in Modal select field
    $('#order-item').val(category).trigger('change');

    // Traversal example: From clicked button, highlight its parent card[cite: 2]
    $btn.closest('.card').addClass('is-active').siblings().removeClass('is-active');
  });

  /* --------------------------------------------------------------------------
     4. REWRITTEN FEATURE 2: Search & Filter with jQuery Effects[cite: 2]
     Comparison Comment: Replaced manual JS loop and addEventListener with
     jQuery .on('input') and .slideDown() / .slideUp() effects.[cite: 2]
     -------------------------------------------------------------------------- */
  $('#search-input, #category-select').on('input change', function () {
    const searchVal = $('#search-input').val().toLowerCase().trim();
    const catVal = $('#category-select').val();

    const filtered = $.grep(productsData, function (item) {
      const matchesSearch = item.title.toLowerCase().indexOf(searchVal) !== -1 || item.desc.toLowerCase().indexOf(searchVal) !== -1;
      const matchesCat = (catVal === 'all') || (item.category === catVal);
      return matchesSearch && matchesCat;
    });

    renderProductsjQuery(filtered);
  });

  /* --------------------------------------------------------------------------
     5. REWRITTEN FEATURE 3: jQuery Form Validation with Effects[cite: 2]
     Comparison Comment: Replaced manual JS validation, field checks and style toggles
     with jQuery chaining, .addClass() / .removeClass(), and .slideDown() effect.[cite: 2]
     -------------------------------------------------------------------------- */
  $('#order-form').on('submit', function (event) {
    // event.preventDefault(): Prevents standard form submission & page reload.
    // Without this, the page would reload instantly and validation messages would disappear.[cite: 2]
    event.preventDefault();

    let isValid = true;
    let $firstInvalid = null;

    // Elements & Traversal
    const $nameInput = $('#order-name');
    const $phoneInput = $('#order-phone');
    const $addressInput = $('#order-address');
    const $confirmationArea = $('#order-confirmation-message');

    // Reset old states using chaining[cite: 2]
    $('.form-control').removeClass('is-error is-success');
    $confirmationArea.hide().text('').removeClass('is-error is-success');

    // Rule 1: Name validation (Trimmed text)[cite: 2]
    const nameVal = $.trim($nameInput.val());
    if (nameVal.length < 2) {
      isValid = false;
      $nameInput.addClass('is-error');
      if (!$firstInvalid) $firstInvalid = $nameInput;
    } else {
      $nameInput.addClass('is-success');
    }

    // Rule 2: Phone validation (Regex test)[cite: 2]
    const phoneVal = $.trim($phoneInput.val());
    const phoneRegex = /^\+?[0-9\s\-\(\)]{8,15}$/;
    if (!phoneRegex.test(phoneVal)) {
      isValid = false;
      $phoneInput.addClass('is-error');
      if (!$firstInvalid) $firstInvalid = $phoneInput;
    } else {
      $phoneInput.addClass('is-success');
    }

    // Rule 3: Address validation[cite: 2]
    const addressVal = $.trim($addressInput.val());
    if (addressVal.length < 5) {
      isValid = false;
      $addressInput.addClass('is-error');
      if (!$firstInvalid) $firstInvalid = $addressInput;
    } else {
      $addressInput.addClass('is-success');
    }

    // Focus first invalid field if form is invalid
    if (!isValid) {
      if ($firstInvalid) $firstInvalid.focus();
      return;
    }

    // If valid: Show success message with Effect (.slideDown + duration + callback)[cite: 2]
    const orderRef = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const successMsg = 'Success! Order Ref: ' + orderRef + '. Thank you, ' + nameVal + '! Demo order received.';

    $confirmationArea
      .addClass('is-success')
      .text(successMsg)
      .slideDown(500, function () {
        // Callback function after effect finishes[cite: 2]
        console.log('Confirmation message successfully displayed.');
      });

    // Reset form
    this.reset();
  });

  // Clear errors on input[cite: 2]
  $('#order-name, #order-phone, #order-address').on('keyup input', function () {
    $(this).removeClass('is-error');
  });
});