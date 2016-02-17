var generators = require('yeoman-generator');
var _ = require("lodash");
var yaml = require('js-yaml');


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
    // add babelify to package.json
    var package = this.fs.readJSON(this.destinationPath("package.json"));
    // modify package here
    if (this.config.get("babel")) {
    }
    this.fs.writeJSON(this.destinationPath("package.json"), package)

    // create karma config
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },
});
