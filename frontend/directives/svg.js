import $ from 'jquery';
import { name, version } from 'detect-browser';

module.exports = ($timeout) => {
  'ngInject';

  return {
    restrict: 'E',
    link: (scope, element) => {
      const styleTags = element.find('style').toArray();

      styleTags.forEach((styleTag) => {
        styleTag.textContent += '';
      });

      const v = parseInt(version, 10);
      if (name === 'ie' && v >= 9 && v <= 11) {
        if (element.attr('height')) {
          return;
        }

        const parent = element.parent();

        const handler = () => {
          const w = parent.width();
          const { width, height } = element.get(0).viewBox.baseVal;
          const factor = height / width;
          element.height(w * factor);
        };

        $(window).on('resize', handler);
        scope.$on('$destroy', () => {
          $(window).off('resize', handler);
        });

        handler();
        $timeout(handler, 100);
      }
    },
  };
};
