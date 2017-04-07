var Generator = require('yeoman-generator')

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments)
  },

  prompting: function () {
    var done = this.async()

    return this.prompt([
      {
        name: "reactRedux",
        message: "Do you want your SPA to use React, Radium, & Redux?",
        type: "confirm",
        default: false,
        when: true
      },
    ]).then(function (answers) {
      this.answers = answers
      done()
    }.bind(this))
  },

  configuring: function () {
    this.config.set("babel", true)
    // compose with subgenerators if need be
    if (this.answers.reactRedux) {
      this.composeWith(`n3dst4-package:react-redux`,
        {},
        { local: require.resolve(`../react-redux`)}
      )
    }
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
      this.templatePath("src/main.js"),
      this.destinationPath("src/main.js"),
      {name: this.config.get("name")}
    )
    this.fs.delete(`src/${this.config.get("name")}.js`)

    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.dependencies = pkg.dependencies || {}
    pkg.dependencies["browser-sync"] = "^2.12.3"
    pkg.dependencies["gulp"] = "^3.9.1"
    pkg.dependencies["gulp-csso"] = "^2.0.0"
    pkg.dependencies["gulp-if"] = "^2.0.0"
    pkg.dependencies["gulp-less"] = "^3.0.5"
    pkg.dependencies["gulp-plumber"] = "^1.1.0"
    pkg.dependencies["gulp-rework"] = "^1.2.0"
    pkg.dependencies["rework-assets"] = "^1.1.1"
    pkg.dependencies["@n3dst4/browser-bundle"] = "^1.2.0"
    pkg.dependencies["@n3dst4/build-stylesheets"] = "^1.1.0"
    pkg.dependencies["babel-polyfill"] = "6.9.1"

    delete pkg.scripts.prepublish
    pkg.scripts.start = "gulp develop"
    pkg.scripts.build = "gulp build"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)

  },

})
