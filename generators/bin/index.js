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
        name: "name",
        message: "Executable script name (without extension)",
        default: config.shortName || this.appname
      },
    ], function (answers) {
      answers.babel = config.babel
      answers.shortName = config.shortName
      answers.camelName = config.camelName
      this.answers = answers
      done()
    }.bind(this))
  },

  writing: function () {
    // shebang script
    var templatePath = this.answers.babel? "src/bin/bin-es6.js" : "src/bin/bin-es5.js"
    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath("src/bin/" + this.answers.shortName + ".js"),
      this.answers
    )

    // add bin and preferGlobal to package.json
    var package = this.fs.readJSON(this.destinationPath("package.json"))
    package.bin = package.bin || {}
    var rootPath = this.answers.babel ? "__build" : "src"
    package.bin[this.answers.shortName] = `${rootPath}/bin/${this.answers.shortName}.js`
    package.preferGlobal = true
    this.fs.writeJSON(this.destinationPath("package.json"), package)
  },
})
