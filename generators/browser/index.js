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

  },

  default: function () {

  },

  writing: function () {
    // add babelify to package.json
    if (this.config.get("babel")) {
      var package = this.fs.readJSON(this.destinationPath("package.json"));
      package.dependencies.babelify = "^7.2.0"
      _.merge(package, {browserify: { transform: [ "babelify" ] }})
      this.fs.writeJSON(this.destinationPath("package.json"), package)
    }

    // add xvfb magic to Travis config to allow Karma to run Firefox, if needed
    var travisPath = this.destinationPath(".travis.yml")
    if (this.fs.exists(travisPath)) {
      // STRICTLY SPEAKING, we don't need to do this unless we're also going to
      // use karma or some other browser-based test runner.
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
