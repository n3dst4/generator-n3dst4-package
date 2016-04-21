/*eslint-env node, mocha */
var fs = require("fs");
var path = require("path")
var assert = require('yeoman-assert')
var runGenerator = require("./run-generator")
var runGulp = require("./run-gulp")
var vm = require("vm")

var gulpTimeout = 10000

describe("spa generator", function () {
  before(runGenerator({}, [], { spa: true }))

  // html
  it("should create an html folder with a template page in it", function () {
    assert.fileContent(
      path.join(this.dir, "pages", "index.html"),
      /^<!DOCTYPE html>/)
  })

  // stylesheets
  it("should create a stylesheets folder with a LESS file in it", function () {
    assert.file(path.join(this.dir, "stylesheets", "main.less"))
  })

  // config
  it("should create config.js", function () {
    assert.file(path.join(this.dir, "config.json"))
  })

  // npm start to run test watch + browser-sync + watchify
  it.skip("should have an npm start command to run in browser", function () {
  });

  it("should add dependencies to package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "dependencies": {
        "@n3dst4/browser-bundle": "^1.0.4",
        "browser-sync": "^2.12.3",
        "gulp-csso": "^2.0.0",
        "gulp-if": "^2.0.0",
        "gulp-less": "^3.0.5",
        "gulp-plumber": "^1.1.0",
        "gulp-rework": "^1.2.0",
        "rework-assets": "^1.1.1",
      }
    })
  })

  // gulp
  describe ("gulpfile", function () {

    // this is kind of a slow operation so, we'll only trigger it once
    before(function () {
      fs.writeFileSync(path.join(this.dir, "stylesheets", "main.less"),
        "foo { &.bar { color: red } }")
      fs.writeFileSync(path.join(this.dir, "src", "lib.js"),
        "export default () => global.done()")
      fs.writeFileSync(path.join(this.dir, "src", "main.js"),
        "import lib from 'lib'; lib()")
      runGulp.bind(this, gulpTimeout)()
    })

    it("should execute \"default\" task without error", function () {
      assert(true)
    })



    // build html
    it("should build html into output folder", function () {
      assert.fileContent(
        path.join(this.dir, "__generated", "index.html"),
        /^<!DOCTYPE html>/)
    })

    // build stylesheets
    it("should build LESS into output folder", function () {
      assert.fileContent(
        path.join(this.dir, "__generated", "css", "main.css"),
        /foo\.bar.[\s\S]*?color: red/)
    })

    // build browserified scripts
    it("should build scripts into output folder", function (done) {
      fs.readFile(path.join(this.dir, "__generated", "js", "main.js"),
        function (err, code) {
          vm.runInNewContext(code, {done: done})
        })
    })

    // * watch mode
    it.skip("should have a watch and serve mode", function () {
    })
  })





  // // these may not be part of the base spa
  //
  // // main component
  // it.skip("should create a main component", function () {
  // });
  //
  // // stores
  // it.skip("should create a store", function () {
  // });
  //
  // // actions
  // it.skip("should create a defaulkt actions library", function () {
  // });

})
