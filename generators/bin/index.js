var generators = require('yeoman-generator');
var _ = require("lodash");

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
    this.option("name", {type: "string"})
    this.option("babel")
  },

  initializing: function () {

  },

  prompting: function () {
    var done = this.async();
    this.prompt([{
        type: "input",
        name: "name",
        message: "Executable script name (without extension)",
        default: this.options.name || this.appname
      },
    ], function (answers) {
      answers.name = answers.name || this.options.name
      answers.babel = answers.babel || this.options.babel
      this.answers = answers
      done()
    }.bind(this));
  },

  configuring: function () {
    this.answers.camelCaseName = _.camelCase(this.answers.name)
  },

  default: function () {

  },

  writing: function () {
    // shebang script
    this.fs.copyTpl(
      this.templatePath("src/bin/bin.js"),
      this.destinationPath("src/bin/" + this.answers.name + ".js"),
      this.answers
    );

    // add bin and preferGlobal to package.json
    var package = this.fs.readJSON(this.destinationPath("package.json"));
    package.bin = package.bin || {};
    var rootPath = this.answers.babel ? "__build" : "src";
    package.bin[this.answers.name] = `${rootPath}/bin/${this.answers.name}.js`;
    package.preferGlobal = true;
    this.fs.writeJSON(this.destinationPath("package.json"), package)

  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },



});
