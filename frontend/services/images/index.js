module.exports = function ($q) {
  'ngInject';

  const storage = {};
  const service = {
    create(url) {
      if (!storage[url]) {
        const deferred = $q.defer();
        const img = new Image();

        img.onload = () => deferred.resolve();
        img.src = url;

        if (img.complete) {
          deferred.resolve();
        }

        storage[url] = deferred.promise
          .catch((err) => {
            console.log(err);
          });
      }

      return storage[url];
    },

    parseUrl(url) {
      const _cachebuster = url.substring(url.lastIndexOf('?') + 1);
      url = url.substring(0, url.lastIndexOf('?'));

      let path = url.substring(0, url.lastIndexOf('.'));
      const ext = url.substring(url.lastIndexOf('.') + 1);

      const hdpi = path.indexOf('@2x') !== -1;
      const hhdpi = path.indexOf('@3x') !== -1;
      const ldpi = !hdpi && !hhdpi;

      path = path.replace(/(@2x|@3x)/, '');
      const id = `${path}.${ext}`;

      const ldpi_cachebuster = ldpi ? _cachebuster : '';
      const hdpi_cachebuster = hdpi ? _cachebuster : '';
      const hhdpi_cachebuster = hhdpi ? _cachebuster : '';

      return {
        id, path, ext, ldpi, hdpi, hhdpi,
        ldpi_cachebuster, hdpi_cachebuster, hhdpi_cachebuster,
      };
    },
    preload(urls) {
      const deferred = $q.defer();
      const map = {};

      urls.forEach((url) => {
        const data = service.parseUrl(url);
        if (!map[data.id]) {
          map[data.id] = data;
        }

        [
          'ldpi', 'hdpi', 'hhdpi',
          'ldpi_cachebuster', 'hdpi_cachebuster', 'hhdpi_cachebuster',
        ].forEach((key) => {
          if (data[key]) {
            map[data.id][key] = data[key];
          }
        });
      });

      const displayRatio = window.devicePixelRatio;
      const imageUrls = [];

      Object.keys(map).forEach((id) => {
        const {
          path, ext, ldpi, hdpi, hhdpi,
          ldpi_cachebuster, hdpi_cachebuster, hhdpi_cachebuster,
        } = map[id];

        let cachebuster = ldpi_cachebuster;
        let ratio = '';

        if (displayRatio > 1.5 && hdpi) {
          cachebuster = hdpi_cachebuster;
          ratio = '@2x';
        }

        if (displayRatio > 2.5 && hhdpi) {
          cachebuster = hhdpi_cachebuster;
          ratio = '@3x';
        }

        imageUrls.push(`${path}${ratio}.${ext}?${cachebuster}`);
      });

      const all = imageUrls.map(url => service.create(url));

      $q.all(all).then(() => {
        deferred.resolve();
      }).catch((err) => {
        console.log(err);
      });

      return deferred.promise
        .catch((err) => {
          console.log(err);
        });
    },
  };

  return service;
};
