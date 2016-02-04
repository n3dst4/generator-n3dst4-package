/*eslint-env node, mocha, es6 */
var helpers = require('yeoman-test')
var assert = require('yeoman-assert');
var path = require("path")

describe("app", function () {

  describe("default everything, empty folder", function () {
    before(function (done) {
      helpers.run(path.join( __dirname, '../generators/app'))
        //.withOptions({ foo: 'bar' })
        //.withArguments(['name-x'])
        .withPrompts({ coffee: false })
        //.on('ready', function (generator) { })
        .inTmpDir(function (dir) {
          this.dir = dir
        }.bind(this))
        .on('end', done);
    })

    it("should set package name to directory name", function () {
      var name = path.basename(this.dir)
      assert.JSONFileContent(path.join(this.dir, "package.json"), {name: name})
    });
  });
})
