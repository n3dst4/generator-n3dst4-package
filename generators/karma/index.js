var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  initializing: function () {

  },

  prompting: function () {

  },

  configuring: function () {

  },

  default: function () {

  },

  writing: function () {
    var package = this.fs.readJSON(this.destinationPath("package.json"));
    package.devDependencies = package.devDependencies || {}
    package.devDependencies["browserify"] = "^13.0.0";
    package.devDependencies["envify"] = "^3.4.0";
    package.devDependencies["karma"] = "^0.13.21";
    package.devDependencies["karma-browserify"] = "^5.0.1";
    package.devDependencies["karma-firefox-launcher"] = "^0.1.7";
    package.devDependencies["karma-mocha"] = "^0.2.2";
    package.devDependencies["karma-notify-reporter"] = "^0.1.1";
    package.devDependencies["karma-teamcity-reporter"] = "^0.2.1";
    package.devDependencies["watchify"] = "^3.7.0";
    package.scripts = package.scripts || {}
    package.scripts.test = "karma start"
    this.fs.writeJSON(this.destinationPath("package.json"), package)

    // create karma config
    this.fs.copyTpl(
      this.templatePath("karma.conf.js"),
      this.destinationPath("karma.conf.js"),
      {babel: this.config.get("babel")})

  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },
});
