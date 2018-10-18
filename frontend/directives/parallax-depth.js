// import TweenMax from 'TweenMax';
import getViewport from 'getviewport';
import TweenLite from 'TweenLite';
import { Power2 } from 'EasePack';
import 'CSSPlugin';

module.exports = ($timeout) => {
  'ngInject';

  return {
    restrict: 'A',
    link(scope, element) {
      if (getViewport().width > 1024) {
        const child = element.find('.gallerypage__blogger');

        function cardStyle(x, y) {
          const rX = (x / element.width()) * 5;
          const rY = (y / element.height()) * -5;
          return [rX, rY];
        }

        element.on('mousemove', (e) => {
          const mouseX = e.pageX - element[0].offsetLeft - (element.width() / 2);
          const mouseY = e.pageY - element[0].offsetTop - (element.height() / 2);

          TweenLite.to(child, 0.6, { rotationX: cardStyle(mouseX, mouseY)[1], rotationY: cardStyle(mouseX, mouseY)[0], ease: Power2.easeOut }, 0);
        });

        element.on('mouseout', () => {
          $timeout(() => {
            TweenLite.to(child, 1, { rotationX: 0, rotationY: 0, ease: Power2.easeOut }, 0);
          }, 800);
        });

      }
    },
  };
};
