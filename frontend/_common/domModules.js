import $ from 'jquery';

let __modules = {};

function initModules(a) {
  let selector = '[data-module]:not(.moduleinited), [data-module-visible]:visible:not(.moduleinited)';

  if (a) {
    if (!a.join) {
      a = [a];
    }

    selector = `[data-module="${a.join('"]:not(.moduleinited), [data-module="')}"]:not(.moduleinited)`;
  }

  $(selector).each(function () {
    let name = $(this).addClass('moduleinited').attr('data-module');
    if (!name) {
      name = $(this).attr('data-module-visible');
    }

    if (!__modules[name]) {
      throw `Data module ${name} is not EXISTS!!`;
    }

    __modules[name].call(this, $(this));
  });
}

function __module(path, fn) {
  if (!__modules) {
    __modules = {};
  }

  __modules[path] = fn;
}

window.initModules = initModules;
module.exports = __module;
