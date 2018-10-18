import $ from 'jquery';
import getViewport from 'getviewport';

module.exports = ($rootScope) => {
  'ngInject';


  const root = $('html');
  // console.log(device());

  function onResize() {
    const baseWidth = 1024;
    const baseHeight = 700;
    const baseFontSize = 20;
    const ratio = baseWidth / baseHeight;

    const maxWidth = 2540;
    const maxFontSize = 40;

    const viewportWidth = getViewport().width;
    const viewportHeight = getViewport().height;

    let height = viewportHeight;
    let width = height * ratio;

    if (width > viewportWidth) {
      width = viewportWidth;
      height = width / ratio;
    }

    const fontSizeDiff = maxFontSize - baseFontSize;
    let fontSize = baseFontSize + (fontSizeDiff * (width - baseWidth) / (maxWidth - baseWidth));

    if (fontSize < 18) {
      fontSize = 18;
    }

    root.css('font-size', fontSize);
  }

  $(window).resize(onResize);
  onResize();
};
