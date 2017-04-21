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
    pkg.devDependencies["enzyme"] = "^2.8.2"
    pkg.devDependencies["react"] = "^15.5.3"
    pkg.devDependencies["react-dom"] = "^15.5.3"
    pkg.devDependencies["react-test-renderer"] = "^15.5.4"
    pkg.dependencies["prop-types"] = "^15.5.6"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)

    var templateConfig = {
      camelCase: this.config.get("camelName"),
      pascalCase: pascalCase(this.config.get("shortName")),
      kebabCase: this.config.get("shortName"),
    }

    var templatePath = this.templatePath("src/main.js")
    var destinationPath = this.destinationPath(`src/${this.config.get("shortName")}.js`)
    this.fs.copyTpl(templatePath, destinationPath, templateConfig)
    templatePath = this.templatePath("test/test.js")
    destinationPath = this.destinationPath(`test/test-${this.config.get("shortName")}.js`)
    this.fs.copyTpl(templatePath, destinationPath, templateConfig)
  },
})
