var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },
  writing: function () {
    this.fs.copy(
      this.templatePath(`test/mocha-${this.config.get("babel")? "babel":"normal"}.opts`),
      this.destinationPath("test/mocha.opts"))

    this.fs.copyTpl(
      this.templatePath(`test/test-${this.config.get("babel")? "babel":"normal"}.js`),
      this.destinationPath(`test/test-${this.config.get("shortName")}.js`),
      {
        name: this.config.get("shortName"),
        camelName: this.config.get("camelName")
      })

    var package = this.fs.readJSON(this.destinationPath("package.json"))
    package.devDependencies = package.devDependencies || {}
    package.devDependencies.chai = "^3.5.0"
    package.devDependencies.mocha = "^2.4.5"
    if (this.config.get("babel")) {
      package.devDependencies["babel-register"] = "^6.7.2"
    }
    package.scripts = package.scripts || {}
    package.scripts.test = "mocha"
    package.scripts.watch = "mocha --watch"
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },
})
