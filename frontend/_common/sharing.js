const Share = {
  // Шаринг ссылок
  vk(purl) {
    Share._link('http://vkontakte.ru/share.php?url=', purl);
  },

  ok(purl) {
    Share._link('http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=', purl);
  },

  fb(purl) {
    Share._link('http://www.facebook.com/sharer.php?s=100&u=', purl);
  },

  mailru(purl) {
    Share._link('http://connect.mail.ru/share?url=', purl);
  },

  tw(text) {
    Share._popup(`http://twitter.com/share?text=${encodeURIComponent(text)}`);
  },

  // Общие функции
  _link(prefix, purl) {
    let url;
    if (purl && (purl.indexOf('http') !== 0)) {
      const name = purl.replace(/\?.*/, '');
      const suffix = purl.replace(/^.*\?/, '');
      url = `${CONFIG.baseurl}/share/${name}.html?${suffix}`; // jshint ignore:line
    } else {
      url = purl || document.location.href;
    }
    console.log('Шаринг', prefix, url);
    Share._popup(prefix + encodeURIComponent(url));
  },
  _popup(url) {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  },
};

$(() => {
  $(document).on('click', '[data-share]', function () {
    const self = $(this);
    Share[self.data('share')](self.data('share-url'));
  });
});

module.exports = Share;
