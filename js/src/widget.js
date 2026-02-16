import { randomInt } from './helpers';
import '../styles/widget.scss';

var ROTATE_INTERVAL = 5000;
var FADE_MS = 350;

var TEMPLATES = [
  { icon: '🔥', text: '{viewers} people viewed this today' },
  { icon: '👁️', text: '{active} looking at this right now' },
  { icon: '🛒', text: '{bought} bought this in the last 24h' },
  { icon: '⚡', text: 'High demand — selling fast' }
];

function fillTemplates() {
  var viewers = randomInt(24, 140);
  var active = randomInt(3, 19);
  var bought = randomInt(6, 48);

  return TEMPLATES.map(function (tpl) {
    return {
      icon: tpl.icon,
      text: tpl.text
        .replace('{viewers}', viewers)
        .replace('{active}', active)
        .replace('{bought}', bought)
    };
  });
}

function SocialWidget() {
  this.root = null;
  this.iconEl = null;
  this.textEl = null;
  this.messages = fillTemplates();
  this.idx = 0;
  this._timer = null;
}

SocialWidget.prototype.render = function () {
  this.root = document.createElement('div');
  this.root.className = 'bubbi-sm';

  this.iconEl = document.createElement('span');
  this.iconEl.className = 'bubbi-sm__icon';

  this.textEl = document.createElement('span');
  this.textEl.className = 'bubbi-sm__text';

  this.root.appendChild(this.iconEl);
  this.root.appendChild(this.textEl);
  this._show(0);

  return this.root;
};

SocialWidget.prototype._show = function (i) {
  this.iconEl.textContent = this.messages[i].icon;
  this.textEl.textContent = this.messages[i].text;
  this.idx = i;
};

SocialWidget.prototype.startRotation = function () {
  var self = this;
  this._timer = setInterval(function () {
    self.textEl.classList.add('bubbi-sm__text--out');
    self.iconEl.classList.add('bubbi-sm__icon--out');

    setTimeout(function () {
      self._show((self.idx + 1) % self.messages.length);
      self.textEl.classList.remove('bubbi-sm__text--out');
      self.iconEl.classList.remove('bubbi-sm__icon--out');
    }, FADE_MS);
  }, ROTATE_INTERVAL);
};

SocialWidget.prototype.mount = function (anchor, position) {
  if (!anchor || !anchor.parentNode) return false;

  var el = this.render();
  anchor.insertAdjacentElement(position || 'afterend', el);

  // kick entrance animation
  requestAnimationFrame(function () {
    el.classList.add('bubbi-sm--visible');
  });

  this.startRotation();
  return true;
};

SocialWidget.prototype.destroy = function () {
  if (this._timer) clearInterval(this._timer);
  if (this.root && this.root.parentNode) {
    this.root.parentNode.removeChild(this.root);
  }
};

export default SocialWidget;
