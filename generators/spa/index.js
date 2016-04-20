var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  configuring: function () {
    this.config.set("babel", true)
    if (!(process.env.CI)) {
      global["console"].log(this.destinationPath())
    }
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
    this.fs.copyTpl(
      this.templatePath("config.json"),
      this.destinationPath("config.json"),
      {name: this.config.get("name")})

    var package = this.fs.readJSON(this.destinationPath("package.json"));
    package.devDependencies = package.devDependencies || {}
    package.devDependencies["browser-sync"] = "^2.12.3"
    package.devDependencies["gulp-csso"] = "^2.0.0"
    package.devDependencies["gulp-if"] = "^2.0.0"
    package.devDependencies["gulp-less"] = "^3.0.5"
    package.devDependencies["gulp-plumber"] = "^1.1.0"
    package.devDependencies["gulp-rework"] = "^1.2.0"
    package.devDependencies["rework-assets"] = "^1.1.1"
    this.fs.writeJSON(this.destinationPath("package.json"), package)

  },

});
