import $ from 'jquery';

// basic detects
function isIpad() { return navigator.userAgent.match(/iPad/i) !== null; }

function isIphone() { return navigator.platform.indexOf('iPhone') !== -1; }

function isIpod() { return navigator.platform.indexOf('iPod') !== -1; }

function isAndroid() { return /Android/i.test(navigator.userAgent); }

function isIEMobile() { return /IEMobile/i.test(navigator.userAgent); }

function isTouch() {
  return 'ontouchstart' in window // works on most browsers
    || 'onmsgesturechange' in window; // works on ie10
}

function runDetects() {
  const html = $('html');
  const w = window;

  w._isTouch = isTouch();
  w._isIpad = isIpad();
  w._isIphone = isIphone();
  w._isIpod = isIpod();
  w._isAndroid = isAndroid();
  w._isIEMobile = isIEMobile();

  // w.scrollBarWidth = scrollSize();
  w.isAppleMobile = w._isIpad || w._isIphone || w._isIpod || false;

  w._isTouch ? html.addClass('touch') : html.addClass('notouch');
  w._isIpad ? html.addClass('ipad') : 0;
  w._isIphone ? html.addClass('iphone') : 0;
  w._isIpod ? html.addClass('ipod') : 0;
  w._isAndroid ? html.addClass('android') : 0;

  w._isMobile = _isAndroid || _isIEMobile || isAppleMobile || false;
}

function getIEversion() {
  let rv = 0; // Return value assumes failure.
  if (navigator.appName === 'Microsoft Internet Explorer') {
    const ua = navigator.userAgent;
    const re = new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})');
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1);
    }
  }

  return rv;
}

function initDetects() {
  if (getIEversion() === 8) {
    $('html').addClass('ie8');
    window._isIE8 = true;
  }

  if (getIEversion() === 9) {
    $('html').addClass('ie9');
    window._isIE9 = true;
  }

  if (document.body.style.msTouchAction !== undefined) {
    $('html').addClass('ie10');
    window._isIE10 = true;
  }

  if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    $('html').addClass('firefox');
  }
}

module.exports = {
  initDetects,
  runDetects,
};
