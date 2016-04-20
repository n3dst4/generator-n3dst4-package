var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  configuring: function () {
    this.config.set("babel", true)
    console.log(this.destinationPath())
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath("pages/index.html"),
      this.destinationPath("pages/index.html"),
      {name: this.config.get("name")});
    this.fs.copyTpl(
      this.templatePath("stylesheets/main.less"),
      this.destinationPath("stylesheets/main.less"),
      {name: this.config.get("name")});
    this.fs.copyTpl(
      this.templatePath("gulpfile.babel.js"),
      this.destinationPath("gulpfile.babel.js"),
      {name: this.config.get("name")})
  },

});
