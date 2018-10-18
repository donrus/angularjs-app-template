import $ from 'jquery';
import TimelineMax from 'TimelineMax';

module.exports = ($rootScope) => {
  'ngInject';

  require('./style.styl');
  return {
    restrict: 'E',
    scope: { },
    // replace: true,
    template: require('./tpl.jade'),

    controller($scope, $state, $rootScope, $stateParams) {
      'ngInject';

    },
  };
};
