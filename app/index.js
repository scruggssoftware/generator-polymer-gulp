'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var PolymerGulpGenerator = yeoman.generators.Base.extend({
  init: function () {

    this.bowerComponentsDir = 'lib/.bower_components';

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(chalk.white('Let me scaffold a', chalk.magenta(' polymer component'), chalk.white(' template for you!'))));

    var defaultName = path.basename(process.cwd());
    var prompts = [{
      name: 'componentName',
      message: 'What is your component\'s name',
      default: defaultName
    },{
      when: function(props){return true;},
      name: 'componentDescription',
      message: 'Please provide a short description for your component',
      default: "Awesome stuff, the modular and interoperable way"
    },{
      when: function(props){return true;},
      name: 'sassOrScss',
      message: 'Sass or Scss, this is the question',
      type: 'rawlist',
      choices: ['sass', 'scss'],
      default: 0
    },{
      when: function(props){return true;},
      type: 'confirm',
      name: 'useGithub',
      message: 'Would you like to use github for this component?',
      default: true
    },{
      when: function(props){return props.useGithub;},
      type: 'input',
      name: 'ghUser',
      message: 'Could you please provide me with your github username ?',
      default: 'aGithubUserName'
    },{
      when: function(props){return !props.useGithub;},
      type: 'input',
      name: 'componentPage',
      message: 'Please provide me with a specific reference page for this component ? (optional)',
      default: ''
    }];

    this.prompt(prompts, function (props) {
      this.componentName = props.componentName;
      this.componentDescription = props.componentDescription;
      this.sassOrScss = props.sassOrScss;
      if(props.useGithub){
        this.componentPage = 'http://' + props.ghUser + '.github.io/' + this._.slugify(this.componentName);
      }else{
        this.componentPage = props.componentPage || "";
      }
      done();
    }.bind(this));
  },

  app: function () {
    // name for core component files (html, css, js)
    var componentFileName = this._.slugify(this.componentName);

    var srcDir = 'app';
    this.mkdir(srcDir);
    var componentRootDir = srcDir + '/';
    this.mkdir(componentRootDir + 'scripts');
    this.mkdir(componentRootDir + 'images');
    this.mkdir(componentRootDir + 'public');
    this.mkdir(componentRootDir + 'styles');

    var copyToComponentRootDir = function(arrayOfArrays){
      var ary = ["", ""];
      for(var i=0;i<arrayOfArrays.length;i++){
        ary = arrayOfArrays[i];
        this.template(ary[0], componentRootDir + ary[1]);
      }
    }.bind(this);

    copyToComponentRootDir([
      ['app/_component.html', componentFileName + '.html'],
      ['app/_index.html', 'index.html'],
      ['app/_demo.html', 'demo.html'],
      ['app/styles/_component.' + this.sassOrScss, 'styles/' + componentFileName + '.' + this.sassOrScss],
      ['app/styles/components/_components.' + this.sassOrScss, 'styles/components/components.' + this.sassOrScss],
      ['app/scripts/_component.js', 'scripts/' + componentFileName + '.js'],
      ['app/scripts/components/_components.js', 'scripts/components/components.js']
    ]);
  },

  projectfiles: function () {
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
    this.template('_bowerrc', '.bowerrc');
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('travis.yml', '.travis.yml');
  }
});

module.exports = PolymerGulpGenerator;
