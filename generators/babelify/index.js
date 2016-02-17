var generators = require('yeoman-generator');
var _ = require("lodash")

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
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
    package.dependencies.babelify = "^7.2.0"
    _.merge(package, {browserify: { transform: [ "babelify" ] }})
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },

  conflicts: function () {
  },

  install: function () {
  },

  end: function () {
  },
});
