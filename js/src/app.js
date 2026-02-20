import { onReady, queryFirst, findByText, isProductPage } from './helpers';
import SocialWidget from './widget';

var PRICE_SELECTORS = [
  '#priceblock_ourprice', '#priceblock_dealprice', '.a-price-whole',
  '#price', '[data-a-color="price"]', '.a-price .a-offscreen',
  '.product__info-wrapper .price', '.product-single__price', '.product__price',
  '.summary .price', '.woocommerce-Price-amount',
  '[class*="product-price"]', '[class*="product__price"]',
  '[data-price]', '[itemprop="price"]'
];

var FORM_SELECTORS = [
  '#add-to-cart-button', '#buy-now-button', '[name="submit.add-to-cart"]',
  '.product-form', 'form[action*="/cart"]', 'form.cart',
  '.product-form__buttons', '#product-add-to-cart', '.add-to-cart'
];

var TITLE_SELECTORS = [
  '#productTitle', 'h1.a-size-large',
  '.product__title', '.product_title', '.product-single__title',
  'h1[class*="product"]', '.product-detail h1',
  '.product-info h1', 'h1[itemprop="name"]'
];

var INFO_SELECTORS = [
  '#centerCol', '#productDescription_feature_div',
  '.product__info-wrapper', '.product-single__meta',
  '.summary.entry-summary', '.product-detail', '.product-info'
];

function findAnchor() {
  var isAmazon = /amazon\.com/i.test(window.location.hostname);
  
  if (isAmazon) {
    // try to find price container - look for parent with specific classes
    var priceEl = queryFirst(['#priceblock_ourprice', '#priceblock_dealprice', '.a-price-whole', '[data-a-color="price"]']);
    if (priceEl) {
      var container = priceEl.closest('div[class*="price"]') || priceEl.closest('span[class*="price"]') || priceEl.parentElement;
      if (container && container.parentElement) {
        // make sure we're not inserting into the price itself
        var parent = container.parentElement;
        if (parent) return { el: parent, pos: 'afterend' };
      }
    }
    
    // fallback: find add to cart button directly
    var cartBtn = document.getElementById('add-to-cart-button') || document.getElementById('buy-now-button');
    if (cartBtn && cartBtn.parentElement) {
      return { el: cartBtn.parentElement, pos: 'beforebegin' };
    }
  } else {
    var price = queryFirst(PRICE_SELECTORS);
    if (price) return { el: price, pos: 'afterend' };
  }

  var form = queryFirst(FORM_SELECTORS);
  if (form) return { el: form, pos: 'beforebegin' };

  var title = queryFirst(TITLE_SELECTORS);
  if (title) return { el: title, pos: 'afterend' };

  var btn = findByText('button', 'add to cart') || findByText('button', 'buy now');
  if (btn) return { el: btn, pos: 'beforebegin' };

  var info = queryFirst(INFO_SELECTORS);
  if (info) return { el: info, pos: 'afterbegin' };

  return null;
}

function tryInit() {
  if (window.__bubbiSM) return;

  if (!isProductPage()) {
    if (document.readyState === 'loading') {
      setTimeout(tryInit, 1000);
      return;
    }
    return;
  }

  var target = findAnchor();
  if (!target) {
    var retries = 0;
    var maxRetries = 5;
    var retryInterval = setInterval(function() {
      retries++;
      target = findAnchor();
      if (target || retries >= maxRetries) {
        clearInterval(retryInterval);
        if (target) {
          window.__bubbiSM = new SocialWidget();
          window.__bubbiSM.mount(target.el, target.pos);
        }
      }
    }, 500);
    return;
  }

  window.__bubbiSM = new SocialWidget();
  window.__bubbiSM.mount(target.el, target.pos);
}

onReady(function() {
  setTimeout(tryInit, 2000);
});
