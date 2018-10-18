let $;
window.jQuery = window.$ = $ = require('jquery');
const angular = require('angular');

$('html').on('touchmove', (e) => {
  e.stopPropagation();
});

//импорт сторонних библиотек
require('./style.styl');
require('ng-dialog/js/ngDialog.js');
require('ng-dialog/css/ngDialog.css');
// require('angular-slick-carousel/dist/angular-slick.min.js');
require('ng-dialog/css/ngDialog.css');

const app = angular.module('frontend', [
  require('angular-ui-router'),
  require('angular-animate'),
  'ngDialog', //внедрение сторонних библиотек
  require('ui-router-gsapify'),
]);

app.config(require('./application.routes'));

app.directive('replaceHref', require('./directives/replace-href'));
app.directive('parallaxDepth', require('./directives/parallax-depth'));
app.service('preloadImages', require('./services/images'));
app.config(require('./pages/main'));
app.run(require('./application.run'));
app.config(require('./application.config'));
app.directive('svg', require('./directives/svg.js'));
app.directive('header', require('./directives/header'));


