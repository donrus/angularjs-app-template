/* eslint-disable */
import 'angular';
import { expect } from 'chai';

// define test application
angular.module('test', ['ng']).service('image', require('./index.js'));

describe('ImagePreload Service', () => {
  // init service
  var $injector = angular.injector(['test']);
  var service = $injector.get('image');

  describe('parseUrl method', function () {
    it('parse lpdi', () => {
      var url2x = service.parseUrl('some/path/to/file.jpg');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal(false);
      expect(url2x.hdpi).to.equal(undefined);
      expect(url2x.hhdpi).to.equal(undefined);
    });

    it('parse lpdi with cachebuster', () => {
      var url2x = service.parseUrl('some/path/to/file.jpg?234234234');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal('234234234');
      expect(url2x.hdpi).to.equal(undefined);
      expect(url2x.hhdpi).to.equal(undefined);
    });

    it('parse hdpi with cachebuster', () => {
      var url2x = service.parseUrl('some/path/to/file@2x.jpg?234234234');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal(undefined);
      expect(url2x.hdpi).to.equal('234234234');
      expect(url2x.hhdpi).to.equal(undefined);
    });

    it('parse hdpi', () => {
      var url2x = service.parseUrl('some/path/to/file@2x.jpg');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal(undefined);
      expect(url2x.hdpi).to.equal(false);
      expect(url2x.hhdpi).to.equal(undefined);
    });

    it('parse hhdpi with cachebuster', () => {
      var url2x = service.parseUrl('some/path/to/file@3x.jpg?234234234');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal(undefined);
      expect(url2x.hdpi).to.equal(undefined);
      expect(url2x.hhdpi).to.equal('234234234');
    });

    it('parse hhdpi', () => {
      var url2x = service.parseUrl('some/path/to/file@3x.jpg');

      expect(url2x.id).to.equal('some/path/to/file.jpg');
      expect(url2x.path).to.equal('some/path/to/file');
      expect(url2x.ext).to.equal('jpg');
      expect(url2x.ldpi).to.equal(undefined);
      expect(url2x.hdpi).to.equal(undefined);
      expect(url2x.hhdpi).to.equal(false);
    });
  });

  describe('filterByDensity', () => {
    it('filtrate ldpi images only', () => {
      window.devicePixelRatio = 1;
      var expectation = [
        'foo.jpg',
        'bar.jpg',
      ];

      var results = service.filterByDensity([
        'foo.jpg',
        'foo@2x.jpg',
        'foo@3x.jpg',
        'bar.jpg',
        'bar@2x.jpg',
        'bar@3x.jpg',
      ]);

      expect(results.join(',')).to.equal(expectation.join(','));
    });

    it('filtrate hdpi images only', () => {
      window.devicePixelRatio = 2;
      var expectation = [
        'foo@2x.jpg',
        'bar@2x.jpg',
      ];

      var results = service.filterByDensity([
        'foo.jpg',
        'foo@2x.jpg',
        'foo@3x.jpg',
        'bar.jpg',
        'bar@2x.jpg',
        'bar@3x.jpg',
      ]);

      expect(results.join(',')).to.equal(expectation.join(','));
    });

    it('filtrate hhdpi images only', () => {
      window.devicePixelRatio = 3;
      var expectation = [
        'foo@3x.jpg',
        'bar@3x.jpg',
      ];

      var results = service.filterByDensity([
        'foo.jpg',
        'foo@2x.jpg',
        'foo@3x.jpg',
        'bar.jpg',
        'bar@2x.jpg',
        'bar@3x.jpg',
      ]);

      expect(results.join(',')).to.equal(expectation.join(','));
    });
  });

  describe('Preload', () => {
    it('single image', (done) => {
      service.preload([require('./test-images/1.jpg')]).then(() => {
        done();
      });
    });

    it('single image with cachebuster', (done) => {
      service.preload([require('./test-images/1.jpg') + '?34234']).then(() => {
        done();
      });
    });

    it('multiple images', (done) => {
      service.preload([
        require('./test-images/1.jpg'),
        require('./test-images/2.jpg'),
        require('./test-images/3.jpg'),
      ]).then(() => {
        done();
      });
    });

    it('from all images', (done) => {
      service.preload([
        require('./test-images/1.jpg'),
        require('./test-images/2.jpg'),
        require('./test-images/3.jpg'),
        require('./test-images/1@2x.jpg'),
        require('./test-images/2@2x.jpg'),
        require('./test-images/3@2x.jpg'),
      ]).then(() => {
        done();
      });
    });

    it('from all images again (for cache testing purposes)', (done) => {
      service.preload([
        require('./test-images/1.jpg'),
        require('./test-images/2.jpg'),
        require('./test-images/3.jpg'),
        require('./test-images/1@2x.jpg'),
        require('./test-images/2@2x.jpg'),
        require('./test-images/3@2x.jpg'),
      ]).then(() => {
        done();
      });
    });

    it('from all images and again (for cache testing purposes)', (done) => {
      service.preload([
        require('./test-images/1.jpg'),
        require('./test-images/2.jpg'),
        require('./test-images/3.jpg'),
        require('./test-images/1@2x.jpg'),
        require('./test-images/2@2x.jpg'),
        require('./test-images/3@2x.jpg'),
      ]).then(() => {
        done();
      });
    });
  });
});
