var generators = require('yeoman-generator');
var _ = require("lodash");
var yaml = require('js-yaml');


module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments)
    this.config.set("browser", true)
  },

  initializing: function () {

  },

  prompting: function () {

  },

  configuring: function () {
    // add babelify to package.json
    if (this.config.get("babel")) {
      this.composeWith("n3dst4-package:babelify",
        {},
        { local: require.resolve("../babelify")}
      )
    }
  },

  default: function () {

  },

  writing: function () {

    // add xvfb magic to Travis config to allow Karma to run Firefox, if needed
    var travisPath = this.destinationPath(".travis.yml")
    if (this.fs.exists(travisPath)) {
      var travisConfig = yaml.safeLoad(this.fs.read(travisPath));
      travisConfig.before_script = _.concat(travisConfig.before_script || [],
        [
          "export DISPLAY=:99.0",
          "sh -e /etc/init.d/xvfb start"
        ]
      );
      this.fs.write(travisPath, yaml.safeDump(travisConfig))
    }
    else {
      this.log.warn(".travis.yml didn't exist, so it hasn't been updated");
    }
  },

  conflicts: function () {

  },

  install: function () {

  },

  end: function () {

  },
});
