module.exports = (ngDialogProvider) => {
  'ngInject';

  ngDialogProvider.setDefaults({
    plain: true,
    showClose: true,
    closeByDocument: true,
    closeByEscape: true,
    ariaAuto: false,
    trapFocus: false,
  });
};
