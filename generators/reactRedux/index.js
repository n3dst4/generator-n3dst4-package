// react + redux generator

var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },
  writing: function () {
    this.fs.copy(
      this.templatePath("src/main.js"),
      this.destinationPath("src/main.js"))

    var package = this.fs.readJSON(this.destinationPath("package.json"))
    package.devDependencies = package.devDependencies || {}
    package.dependencies["immutable"] = "^3.8.1"
    package.dependencies["radium"] = "^0.17.1"
    package.dependencies["react"] = "^15.1.0"
    package.dependencies["react-addons-pure-render-mixin"] = "^15.1.0"
    package.dependencies["react-dom"] = "^15.1.0"
    package.dependencies["react-redux"] = "^4.4.5"
    package.dependencies["react-router"] = "^2.4.1"
    package.dependencies["redux"] = "^3.5.2"
    package.dependencies["redux-logger"] = "^2.6.1"
    package.dependencies["redux-thunk"] = "^2.1.0"
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },
})
