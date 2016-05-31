/*eslint-env node, mocha */
var assert = require('yeoman-assert')
var path = require("path")
var fs = require("fs")
var yaml = require('js-yaml')
var runGenerator = require("./run-generator")

describe("karma prompt", function () {
  before(runGenerator({}, [], {mocha: true, karma: true}))

  it("should create karma conf", function () {
    assert.file(path.join(this.dir, "karma.conf.js"))
  });

  it("should add various devDependencies", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      devDependencies: {
        "browserify": "^13.0.0",
        "karma": "^0.13.21",
        "karma-browserify": "^5.0.1",
        "karma-firefox-launcher": "^0.1.7",
        "karma-mocha": "^0.2.2",
        "karma-notify-reporter": "^0.1.1",
        "karma-teamcity-reporter": "^0.2.1",
        "watchify": "^3.7.0",
      }
    })
  });

  it("should change the test command", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      scripts: {
        test: "karma start --single-run",
        watch: "karma start"
      }
    })
  });

  it("should add xvfb magic to travis config", function () {
    var travisConfigText = fs.readFileSync(path.join(this.dir, ".travis.yml"), "utf-8")
    var travisConfig = yaml.safeLoad(travisConfigText);
    assert.objectContent(travisConfig, {
      before_script: [
        "export DISPLAY=:99.0",
        "sh -e /etc/init.d/xvfb start"
      ]
    })
  })


})
