/* globals NProgress */

// NP wrapper
const NP = {
  interval: false,
  count: 0,
  start() {
    NP.stop();
    NProgress.start();
    this.count++;
    if (this.count > 1) {
      return;
    }

    this.interval = setInterval(NProgress.inc.bind(NProgress), 250);
  },

  stop() {
    if (!this.count) {
      return;
    }

    this.count--;
    clearInterval(this.interval);
    NProgress.done();
  },
};

module.exports = NS;
