import TimelineMax from 'TimelineMax';
import angular from 'angular';

const component = angular.module('ui-router-gsapify', [
  require('angular-animate'),
  require('angular-ui-router'),
]);

let animationFirstLoad = true;


component.config(($stateProvider) => {
  'ngInject';

  $stateProvider.state('app.pages.gsapifyRouterBlankState', {});
});

component.run(($rootScope, $state) => {
  'ngInject';

  $state.history = [];
  $state.previous = {};

  $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    $state.previous = fromState;
    $state.previousParams = fromParams;

    $state.history.push({
      name: fromState.name,
      params: fromParams,
    });
  });
});

component.directive('timelines', ($state) => {
  'ngInject';

  return {
    priority: 0,
    restrict: 'A',
    link($scope, $element, $attr) {
      $attr.$set('data-state', $state.current.name);
    },
  };
});

component.directive('triggerAnimation', ($rootScope, $injector, $state, gsapifyRouter) => {
  'ngInject';

  return {
    restrict: 'A',
    link(scope, element) {
      if (!animationFirstLoad) {
        return;
      }

      const state = $state.get($state.current.name);

      gsapifyRouter.element = element;
      gsapifyRouter.target = state;
      gsapifyRouter.previous = $state.previous;
      gsapifyRouter.isFirst = true;

      if (state.data && state.data.timelines && state.data.timelines.enter) {
        const enter = state.data.timelines.enter;

        let timeline = false;

        if (enter.onload) {
          timeline = $injector.invoke(enter.onload);
        } else if (enter.all) {
          timeline = $injector.invoke(enter.all);
        }

        gsapifyRouter.isFirst = false;

        if (timeline) {
          timeline.eventCallback('onComplete', () => {
            $rootScope.$broadcast('gsapifyRouter:enterSuccess', element);
          });
          timeline.play();
        }
      } else {
        $rootScope.$broadcast('gsapifyRouter:enterSuccess', element);
      }

      animationFirstLoad = false;
    },
  };
});

component.provider('gsapifyRouter', function () {
  this.initialTransitionEnabled = true;

  this.$get = function ($rootScope, $state, $document, $injector, $timeout, $q) {
    function getTimeline(state, name, enterLeave) {
      if (!state.data || !state.data.timelines || !state.data.timelines[enterLeave]) {
        // console.log(`У стейта нет таймлайнов на ${enterLeave}`);
        return () => new TimelineMax();
      }
      const timelines = state.data.timelines[enterLeave];

      if (!timelines[name] && !timelines.all) {
        // console.log(`У стейта нет общего и специфического таймлайна`);
        return () => new TimelineMax();
      }

      if (timelines[name]) {
        // console.log(`возвращаем таймлайн ${name}`);
        return timelines[name];
      }

      return timelines.all;
    }

    const router = {
      initialTransitionEnabled: this.initialTransitionEnabled,
      enter(element) {
        const deferred = $q.defer();

        element.css('visibility', 'hidden');
        element.addClass('gsapify-router-in-setup');

        const current = $state.current;
        const previous = $state.previous;
        router.element = element;
        router.target = previous;
        router.previous = $state.previous;
        const tl = $injector.invoke(getTimeline(current, previous.name, 'enter'));

        function onStart() {
          element.css('visibility', 'visible');
          element.removeClass('gsapify-router-in-setup');
          element.addClass('gsapify-router-in');
        }

        function onComplete() {
          element.addClass('gsapify-router-in-end');
          deferred.resolve();
        }

        tl.eventCallback('onComplete', onComplete);
        onStart();

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => tl.play());
        });

        return deferred.promise;
      },
      leave(element) {
        const deferred = $q.defer();

        element.removeClass('gsapify-router-in gsapify-router-in-end');
        element.addClass('gsapify-router-out-setup');

        const current = $state.current;
        const previous = $state.previous;

        router.element = element;
        router.target = current;
        router.next = current;
        const tl = $injector.invoke(getTimeline(previous, current.name, 'leave'));

        function onStart() {
          element.removeClass('gsapify-router-out-setup');
          element.addClass('gsapify-router-out');
        }

        function onComplete() {
          deferred.resolve({});
        }

        tl.eventCallback('onComplete', onComplete);
        onStart();

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => tl.play());
        });

        return deferred.promise;
      },
    };

    return router;
  };
});

component.animation('.angular-timelines-animation', ($rootScope, gsapifyRouter) => {
  'ngInject';

  return {
    enter(element, done) {
      const state = element.attr('data-state');

      if (state !== 'gsapifyRouterBlankState') {
        $rootScope.$broadcast('gsapifyRouter:enterStart', element);

        gsapifyRouter.enter(element).then((obj) => {
          $rootScope.$broadcast('gsapifyRouter:enterSuccess', element, obj);
        });

        done();
      }

      return (cancelled) => {
          // Backwards compatibility with angular 1.3.x and below
        if (angular.version.major === 1 && angular.version.minor <= 3) {
          if (cancelled === true) {
            element.remove();
          }

          return;
        }

        if (cancelled !== false) {
          element.remove();
        }
      };
    },

    leave(element, done) {
      const state = element.attr('data-state');

      if (state !== 'gsapifyRouterBlankState') {
        $rootScope.$broadcast('gsapifyRouter:leaveStart', element);

        gsapifyRouter.leave(element).then((obj) => {
          $rootScope.$broadcast('gsapifyRouter:leaveSuccess', element, obj);
          done();
        });
      }
    },
  };
});

module.exports = 'ui-router-gsapify';
