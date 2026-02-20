function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

function queryFirst(selectors) {
  for (var i = 0; i < selectors.length; i++) {
    var el = document.querySelector(selectors[i]);
    if (el) return el;
  }
  return null;
}

function findByText(tag, text) {
  var els = document.querySelectorAll(tag);
  var lower = text.toLowerCase();
  for (var i = 0; i < els.length; i++) {
    if ((els[i].textContent || '').toLowerCase().indexOf(lower) !== -1) {
      return els[i];
    }
  }
  return null;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isProductPage() {
  // amazon has /dp/ in url
  if (/\/dp\/[A-Z0-9]+/i.test(window.location.pathname)) return true;

  var ldScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (var i = 0; i < ldScripts.length; i++) {
    try {
      var json = JSON.parse(ldScripts[i].textContent);
      if (json['@type'] === 'Product') return true;
      if (Array.isArray(json['@graph'])) {
        for (var j = 0; j < json['@graph'].length; j++) {
          if (json['@graph'][j]['@type'] === 'Product') return true;
        }
      }
    } catch (e) {
      // malformed json, skip
    }
  }

  var ogType = document.querySelector('meta[property="og:type"]');
  if (ogType && /product/i.test(ogType.getAttribute('content') || '')) return true;

  if (/\/(product|products|item|p|dp)(\/|$)/i.test(window.location.pathname)) return true;

  // amazon dom checks
  if (document.getElementById('productTitle') || document.getElementById('add-to-cart-button')) return true;

  var hasProduct = queryFirst([
    '[data-product-id]', '[data-product]',
    '[itemtype*="schema.org/Product"]',
    '.product-single', '.product-detail', '.product-info',
    '.product__info-wrapper', '#product-detail', '.pdp-main'
  ]);
  var hasCart = queryFirst([
    'form[action*="cart"]', 'button[name="add"]',
    '[data-action="add-to-cart"]', '.add-to-cart', '#add-to-cart',
    '.product-form__submit', 'button.single_add_to_cart_button',
    '[class*="addToCart"]', '[class*="add-to-cart"]'
  ]);
  if (hasProduct && hasCart) return true;

  return !!queryFirst(['.product-page', '.product__info-wrapper', '.product_detail']);
}

export { onReady, queryFirst, findByText, randomInt, isProductPage };
