var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  prompting: function () {
    var done = this.async()
    var config = this.config.getAll()
    this.prompt([{
        type: "input",
        name: "binName",
        message: "Executable script name (without extension)",
        default: config.shortName || this.appname
      },
    ], function (answers) {
      answers.babel = config.babel
      answers.shortName = config.shortName
      answers.camelName = config.camelName
      answers.name = config.name
      answers.description = config.description
      this.answers = answers
      done()
    }.bind(this))
  },

  writing: function () {
    // shebang script
    var templatePath = this.answers.babel? "src/bin/bin-es6.js" : "src/bin/bin-es5.js"
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath("src/bin/" + this.answers.binName + ".js"),
      this.answers
    )

    templatePath = this.answers.babel? "src/main-es6.js" : "src/main-es5.js"
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath("src/" + this.answers.shortName + ".js"),
      this.answers
    )

    this.fs.copyTpl(
      this.templatePath("_README.markdown"),
      this.destinationPath("README.markdown"),
      this.answers
    )

    // add bin and preferGlobal to package.json
    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.bin = pkg.bin || {}
    var rootPath = this.answers.babel ? "__build" : "src"
    pkg.bin[this.answers.binName] = `${rootPath}/bin/${this.answers.binName}.js`
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.start = "node " + rootPath +"/bin/" + this.answers.binName
    pkg.preferGlobal = true
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)
  },
})
