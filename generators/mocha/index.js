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

    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.devDependencies = pkg.devDependencies || {}
    pkg.devDependencies.chai = "^3.5.0"
    pkg.devDependencies.mocha = "^2.4.5"
    if (this.config.get("babel")) {
      pkg.devDependencies["babel-register"] = "^6.7.2"
    }
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.test = "mocha"
    pkg.scripts.watch = "mocha --watch"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)
  },
})
