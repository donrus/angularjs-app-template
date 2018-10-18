module.exports = function ($urlRouterProvider, $httpProvider, $locationProvider, $stateProvider, $urlMatcherFactoryProvider) {
  'ngInject';

  $stateProvider.state('app', {
    url: '/',
    abstract: true,
    template: `
      <div ui-view="pages"></div>`,
  });


  $stateProvider.state('app.pages', {
    url: '',
    views: {
      pages: {
        template: `<div ui-view=""
        class="
        angular-timelines-animation"
        trigger-animation
        timelines></div>`,
      },
    },
    abstract: true,
    sticky: true,
  });

  // for trailing slash
  $urlMatcherFactoryProvider.strictMode(false);

  $urlRouterProvider.otherwise(($injector) => {
    const $state = $injector.get('$state');
    $state.go('app.pages.main');
  });

  // патчим обьявление роутов, чтобы все последующие роуты поддерживали utm метки
  const prevState = $stateProvider.state.bind($stateProvider);
  $stateProvider.state = (name, opts) => {
    if (!opts.abstract) {
      opts.url += '?utm_source&utm_medium&utm_campaign&utm_term&utm_content';
    }

    prevState(name, opts);
  };

  $locationProvider.html5Mode({
   enabled: true,
   requireBase: false,
  });
};
