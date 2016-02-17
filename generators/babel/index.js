var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.config.set("babel", true)
  },

  initializing: function () {
  },

  prompting: function () {
  },

  configuring: function () {
    // add babelify to package.json
    if (this.config.get("browser")) {
      this.composeWith("n3dst4-package:babelify",
        {},
        { local: require.resolve("../babelify")}
      )
    }
  },

  default: function () {
  },

  writing: function () {
    // add bin and preferGlobal to package.json
    var package = this.fs.readJSON(this.destinationPath("package.json"));
    package.main = "__build/" + this.config.getAll().name + ".js"
    package.scripts.prepublish = "babel src --out-dir __build"
    package.devDependencies.babel = "^5.8.23"
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },

  conflicts: function () {
  },

  install: function () {
  },

  end: function () {
  },
});
