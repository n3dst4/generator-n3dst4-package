// react + redux generator
var glob = require("glob")

var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  writing: function () {
    var context = {name: this.config.get("shortName")}

    this.fs.copyTpl(
      glob.sync(this.templatePath('src/**'), {dot: true}),
      this.destinationPath("src"),
      context)

    this.fs.copyTpl(
      this.templatePath('pages/index.html'),
      this.destinationPath("pages/index.html"),
      context)

    var package = this.fs.readJSON(this.destinationPath("package.json"))
    package.devDependencies = package.devDependencies || {}
    package.dependencies["immutable"] = "^3.8.1"
    package.dependencies["radium"] = "^0.17.1"
    package.dependencies["react"] = "^15.1.0"
    package.dependencies["react-addons-pure-render-mixin"] = "^15.1.0"
    package.dependencies["react-dom"] = "^15.1.0"
    package.dependencies["react-immutable-proptypes"] = "^1.7.1",
    package.dependencies["react-redux"] = "^4.4.5"
    package.dependencies["react-router"] = "^2.4.1"
    package.dependencies["redux"] = "^3.5.2"
    package.dependencies["redux-logger"] = "^2.6.1"
    package.dependencies["redux-storage"] = "^4.0.1"
    package.dependencies["redux-storage-decorator-debounce"] = "^1.0.1"
    package.dependencies["redux-storage-engine-localstorage"] = "^1.1.1"
    package.dependencies["redux-thunk"] = "^2.1.0"
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },
})
