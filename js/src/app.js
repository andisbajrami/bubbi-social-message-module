import { onReady, queryFirst, findByText, isProductPage } from './helpers';
import SocialWidget from './widget';

// anchor selectors grouped by priority
var PRICE_SELECTORS = [
  '.product__info-wrapper .price', '.product-single__price', '.product__price',
  '.summary .price', '.woocommerce-Price-amount',
  '[class*="product-price"]', '[class*="product__price"]',
  '[data-price]', '[itemprop="price"]'
];

var FORM_SELECTORS = [
  '.product-form', 'form[action*="/cart"]', 'form.cart',
  '.product-form__buttons', '#product-add-to-cart', '.add-to-cart'
];

var TITLE_SELECTORS = [
  '.product__title', '.product_title', '.product-single__title',
  'h1[class*="product"]', '.product-detail h1',
  '.product-info h1', 'h1[itemprop="name"]'
];

var INFO_SELECTORS = [
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

  // text-based fallback in case class names change
  var btn = findByText('button', 'add to cart') || findByText('button', 'buy now');
  if (btn) return { el: btn, pos: 'beforebegin' };

  var info = queryFirst(INFO_SELECTORS);
  if (info) return { el: info, pos: 'afterbegin' };

  return null;
}

function init() {
  if (window.__bubbiSM) return; // already loaded

  if (!isProductPage()) {
    console.log('[Bubbi] Not a product page, skip');
    return;
  }

  var target = findAnchor();
  if (!target) {
    console.log('[Bubbi] No anchor found');
    return;
  }

  window.__bubbiSM = new SocialWidget();
  if (window.__bubbiSM.mount(target.el, target.pos)) {
    console.log('[Bubbi] Widget mounted');
  }
}

// small delay for pages that render content dynamically
onReady(function () {
  setTimeout(init, 600);
});
