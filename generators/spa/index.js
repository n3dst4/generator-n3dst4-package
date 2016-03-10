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
    // this.fs.copy(
    //   this.templatePath(`test/mocha-${this.config.get("babel")? "babel":"normal"}.opts`),
    //   this.destinationPath("test/mocha.opts"))
    //
    // this.fs.copyTpl(
    //   this.templatePath("test/test-.js"),
    //   this.destinationPath(`test/test-${this.config.get("name")}.js`),
    //   {name: this.config.get("name")})
    //
    // var package = this.fs.readJSON(this.destinationPath("package.json"));
    // package.devDependencies = package.devDependencies || {}
    // package.devDependencies.chai = "^3.5.0"
    // package.devDependencies.mocha = "^2.4.5"
    // package.scripts = package.scripts || {}
    // package.scripts.test = "mocha"
    // this.fs.writeJSON(this.destinationPath("package.json"), package)
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },
});
