module.exports = () => {
  return {
    restrict: 'A',
    link(scope, element) {
      element.attr('href', element.attr('replace-href'));
      element.removeAttr('replace-href');
    },
  };
};
