var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  configuring: function () {
    this.config.set("babel", true)
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath("pages/index.html"),
      this.destinationPath("pages/index.html"),
      {name: this.config.get("name")}
    )
    this.fs.copyTpl(
      this.templatePath("stylesheets/main.less"),
      this.destinationPath("stylesheets/main.less"),
      {name: this.config.get("name")}
    )
    this.fs.copyTpl(
      this.templatePath("gulpfile.babel.js"),
      this.destinationPath("gulpfile.babel.js"),
      {name: this.config.get("name")}
    )
    this.fs.copyTpl(
      this.templatePath("config.json"),
      this.destinationPath("config.json"),
      {name: this.config.get("name")}
    )
    this.fs.copyTpl(
      this.templatePath("gulp-tasks/build-stylesheets.js"),
      this.destinationPath("gulp-tasks/build-stylesheets.js"),
      {name: this.config.get("name")}
    )
    this.fs.copyTpl(
      this.templatePath("src/main.js"),
      this.destinationPath("src/main.js"),
      {name: this.config.get("name")}
    )
    this.fs.delete(`src/${this.config.get("name")}.js`)

    var package = this.fs.readJSON(this.destinationPath("package.json"));
    package.dependencies = package.dependencies || {}
    package.dependencies["browser-sync"] = "^2.12.3"
    package.dependencies["gulp"] = "^3.9.1"
    package.dependencies["gulp-csso"] = "^2.0.0"
    package.dependencies["gulp-if"] = "^2.0.0"
    package.dependencies["gulp-less"] = "^3.0.5"
    package.dependencies["gulp-plumber"] = "^1.1.0"
    package.dependencies["gulp-rework"] = "^1.2.0"
    package.dependencies["rework-assets"] = "^1.1.1"
    package.dependencies["@n3dst4/browser-bundle"] = "^1.0.5"
    delete package.scripts.prepublish
    package.scripts.start = "gulp develop"
    package.scripts.build = "gulp build"
    this.fs.writeJSON(this.destinationPath("package.json"), package)

  },

});
