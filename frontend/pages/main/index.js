require('./style.styl');

import $ from 'jquery'
import getViewport from 'getviewport';
// import TimelineMax from 'TimelineMax';
import TimelineLite from 'TimelineLite';
import 'CSSPlugin';

module.exports = function ($stateProvider) {
  'ngInject';

  $stateProvider.state('app.pages.main', {
    url: "",
    template: require('./tpl.jade'),
    controller: require('./controller.js'),
    data: {
      timelines: {},
    },
  });
};
