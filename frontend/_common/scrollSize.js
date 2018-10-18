
function scrollSize() {
  if (window._scrollbarWidth) {
    return window._scrollbarWidth;
  }

  const scrollDiv = $('<div><div>').css({
    width: 100,
    height: 100,
    overflow: 'scroll',
    position: 'absolute',
    top: -9999,
  }).appendTo($('body'));
  const scrollbarWidth = scrollDiv[0].offsetWidth - scrollDiv[0].clientWidth;
  scrollDiv.remove();

  return window._scrollbarWidth = scrollbarWidth;
}

module.exports = scrollSize;
