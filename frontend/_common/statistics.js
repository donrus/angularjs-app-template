import $ from 'jquery';

function SS() { // Send Statistic
  let args = Array.prototype.slice.call(arguments);
  const yd = args.join('_');

  const debug = function () {
    // console.log('stat:',arguments);
  };

  // Google Analytics
  if (typeof ga === 'function') {
    args = ['send', 'event'].concat(args).concat([{ nonInteraction: 1 }]);
    ga(...args); // jshint ignore:line
    debug.apply('ga()', args);
  } else if (typeof _gaq !== 'undefined') {
    args = ['_trackEvent'].concat(args);
    _gaq.push(args); // jshint ignore:line
    debug.apply('_gaq()', args);
  } else {
    debug('Гугл Аналитикс не подключен:', args);
  }

  // Yandex Metrika
  if (typeof yaCounter !== 'undefined') {
    yaCounter.reachGoal(yd); // jshint ignore:line
    debug.apply('yaCounter()', args);
  }
}

$(() => {
  $(document).on('click', '[data-ss-category]', function () {
    const self = $(this);
    if (!self.data('ss-action')) {
      console.log('У объекта нет обязательного параметра data-ss-action', this);
      return true;
    }

    let args = [],
      it,
      keys = ['category', 'action', 'label', 'value'];
    for (const i in keys) {
      it = self.data(`ss-${keys[i]}`);
      if (it) {
        args.push(it);
      }
    }

    SS(...args);
  });

  $(document).on('click', '[data-ss]', function (e) {
    if (e.hasOwnProperty('originalEvent')) {
      // is user
      SS(...$(this).data('ss').split(','));
    }
  });
});

window.SS = SS;
module.exprorts = SS;
