/*global describe, beforeEach, it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('polymer-gulp generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.componentName = 'myTestComponent';
      this.componentSourceDir = 'app/';

      this.app = helpers.createGenerator('polymer-gulp:app', [
        '../../app'
      ]);
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expectedInSrcDir = [
      // add files you expect to exist here.
      this.app._.slugify(this.componentName) + '.html',
      'styles/' + this.app._.slugify(this.componentName) + '.sass',
      'styles/components/components.sass',
      'scripts/' + this.app._.slugify(this.componentName) + '.js',
      'scripts/components/components.js',
      'index.html',
      'demo.html'
    ];

    for(var i=0;i< expectedInSrcDir.length;i++){
      expectedInSrcDir[i] = this.componentSourceDir + expectedInSrcDir[i];
    }

    var exepectedInProjectDir = [
      'gulpfile.js',
      'bower.json',
      'package.json',
      '.bowerrc',
      '.editorconfig',
      '.jshintrc',
      '.gitignore',
      '.gitattributes',
      '.travis.yml'
    ]

    helpers.mockPrompt(this.app, {
      componentName: this.componentName,
      sassOrScss: 'sass',
      useGithub: true,
      ghUser: 'aGithubUserName'
    });

    this.app.options['skip-install'] = true;
    this.app.run({}, function () {
      helpers.assertFile(expectedInSrcDir);
      helpers.assertFile(exepectedInProjectDir)
      done();
    });
  });
});
