var generators = require('yeoman-generator')
var _ = require("lodash")
var yaml = require('js-yaml')

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
  },

  writing: function () {
    var pkg = this.fs.readJSON(this.destinationPath("package.json"))
    pkg.devDependencies = pkg.devDependencies || {}
    pkg.devDependencies["browserify"] = "^13.0.0"
    pkg.devDependencies["envify"] = "^3.4.0"
    pkg.devDependencies["karma"] = "^0.13.21"
    pkg.devDependencies["karma-browserify"] = "^5.0.1"
    pkg.devDependencies["karma-firefox-launcher"] = "^0.1.7"
    pkg.devDependencies["karma-mocha"] = "^0.2.2"
    pkg.devDependencies["karma-notify-reporter"] = "^0.1.1"
    pkg.devDependencies["karma-teamcity-reporter"] = "^0.2.1"
    pkg.devDependencies["watchify"] = "^3.7.0"
    if (this.config.get("babel")) {
      pkg.devDependencies["babelify"] = "^7.2.0"
    }
    pkg.scripts = pkg.scripts || {}
    pkg.scripts.test = "karma start --single-run"
    pkg.scripts.watch = "karma start"
    this.fs.writeJSON(this.destinationPath("package.json"), pkg)

    // add xvfb magic to Travis config to allow Karma to run Firefox, if needed
    var travisPath = this.destinationPath(".travis.yml")
    if (this.fs.exists(travisPath)) {
      // STRICTLY SPEAKING, we don't need to do this unless we're also going to
      // use karma or some other browser-based test runner.
      var travisConfig = yaml.safeLoad(this.fs.read(travisPath))
      travisConfig.before_script = _.concat(travisConfig.before_script || [],
        [
          "export DISPLAY=:99.0",
          "sh -e /etc/init.d/xvfb start"
        ]
      )
      this.fs.write(travisPath, yaml.safeDump(travisConfig))
    }
    else {
      this.log.warn(".travis.yml didn't exist, so it hasn't been updated")
    }

    // create karma config
    this.fs.copyTpl(
      this.templatePath("karma.conf.js"),
      this.destinationPath("karma.conf.js"),
      {babel: this.config.get("babel")})
  },
})
