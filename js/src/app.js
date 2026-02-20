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
  var price = queryFirst(PRICE_SELECTORS);
  if (price) return { el: price, pos: 'afterend' };

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
  console.log('[Bubbi] tryInit called');
  if (window.__bubbiSM) {
    console.log('[Bubbi] Already initialized, skipping');
    return;
  }

  if (!isProductPage()) {
    if (document.readyState === 'loading') {
      setTimeout(tryInit, 1000);
      return;
    }
    console.log('[Bubbi] Not a product page, skip');
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
          console.log('[Bubbi] Anchor found after retry, mounting widget');
          window.__bubbiSM = new SocialWidget();
          if (window.__bubbiSM.mount(target.el, target.pos)) {
            console.log('[Bubbi] Widget mounted');
          }
        } else {
          console.log('[Bubbi] No anchor found after retries');
        }
      }
    }, 500);
    return;
  }

  console.log('[Bubbi] Anchor found, mounting widget');
  window.__bubbiSM = new SocialWidget();
  if (window.__bubbiSM.mount(target.el, target.pos)) {
    console.log('[Bubbi] Widget mounted');
  }
}

onReady(function() {
  setTimeout(tryInit, 2000);
});
