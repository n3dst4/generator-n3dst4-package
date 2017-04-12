// react + redux generator
var glob = require("glob")
var Generator = require('yeoman-generator')
var jsdom = require("jsdom")

module.exports = Generator.extend({
  constructor: function () {
    Generator.apply(this, arguments)
  },

  writing: function () {
    var context = {name: this.config.get("shortName")}

    this.fs.copyTpl(
      glob.sync(this.templatePath('src/**'), {dot: true}),
      this.destinationPath("src"),
      context)

    var html = this.fs.read(this.destinationPath("pages/index.html"))

    var done = this.async();

    jsdom.env(html, (error, window) => {
      var body = window.document.getElementsByTagName("body")[0]
      body.innerHTML =
        '<div id="app" \/>\n' +
        body.innerHTML

      var html = jsdom.serializeDocument(window.document)

      this.fs.write(
        this.destinationPath("pages/index.html"),
        html)

      done()
    })

    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.devDependencies = pkg.devDependencies || {}
    pkg.dependencies["immutable"] = "^3.8.1"
    pkg.dependencies["radium"] = "^0.17.1"
    pkg.dependencies["react"] = "^15.1.0"
    pkg.dependencies["react-addons-pure-render-mixin"] = "^15.1.0"
    pkg.dependencies["react-dom"] = "^15.1.0"
    pkg.dependencies["react-immutable-proptypes"] = "^1.7.1",
    pkg.dependencies["react-redux"] = "^4.4.5"
    pkg.dependencies["react-router"] = "^2.4.1"
    pkg.dependencies["redux"] = "^3.5.2"
    pkg.dependencies["redux-logger"] = "^2.6.1"
    pkg.dependencies["redux-storage"] = "^4.0.1"
    pkg.dependencies["redux-storage-decorator-debounce"] = "^1.0.1"
    pkg.dependencies["redux-storage-engine-localstorage"] = "^1.1.1"
    pkg.dependencies["redux-thunk"] = "^2.1.0"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)
  },
})
