var Generator = require('yeoman-generator')
var pascalCase = require("pascal-case")

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments)
  },

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.devDependencies = pkg.devDependencies || {}
    pkg.devDependencies["chai-enzyme"] = "^0.6.1"
    pkg.devDependencies["enzyme"] = "^2.8.0"
    pkg.devDependencies["react"] = "^15.4.2"
    pkg.devDependencies["react-addons-test-utils"] = "^15.4.2"
    pkg.devDependencies["react-dom"] = "^15.4.2"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)

    var templatePath = this.templatePath("src/main.js")
    var destinationPath = this.destinationPath(`src/${this.config.get("shortName")}.js`)
    this.fs.copy(templatePath, destinationPath)

    templatePath = this.templatePath("test/test.js")
    destinationPath = this.destinationPath(`test/test-${this.config.get("shortName")}.js`)
    this.fs.copyTpl(templatePath, destinationPath, {
      camelCase: this.config.get("camelName"),
      pascalCase: pascalCase(this.config.get("shortName")),
    })
  },
})
