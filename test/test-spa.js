/*eslint-env node, mocha */
var runGenerator = require("./run-generator")
var assert = require('yeoman-assert')
var path = require("path")
var execSync = require("child_process").execSync
var symlinkSync = require("fs").symlinkSync

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

  // npm start to run test watch + browser-sync + watchify
  it.skip("should have an npm start command to run in browser", function () {
  });


  // gulp
  describe ("gulpfile", function () {
    before(runGenerator({}, [], { spa: true }))

    before(function () {

      this.timeout(10000)

      // https://github.com/substack/node-resolve/issues/39
      this.gulpExecutedOkay = true
      try {

        console.log("BEFORE")

        symlinkSync(
          path.join(__dirname, "..", "node_modules"),
          path.join(this.dir, "node_modules")
        )

        console.log("AFTER")

        execSync(path.join(__dirname, "..", "node_modules", ".bin", "gulp.cmd"), {
          cwd: this.dir,
          env: {
            //NODE_PATH: path.join(__dirname, "..", "node_modules")
          },
          timeout: 10000
        })
      }
      catch (error) {
        console.error(error.stdout? error.stdout.toString(): error)
        this.gulpExecutedOkay = false
      }
    })

    it.only("should execute \"default\" task without error", function () {
      assert(this.gulpExecutedOkay)
    })

    // build html
    it.skip("should build html into output folder", function () {
    })

    // build stylesheets
    it.skip("should build LESS into output folder", function () {
    })

    // build browserified scripts
    it.skip("should build scripts into output folder", function () {
    })

    // * watch mode
    it.skip("should have a watch and serve mode", function () {
    })
  })





  // these may not be part of the base spa

  // main component
  it.skip("should create a main component", function () {
  });

  // stores
  it.skip("should create a store", function () {
  });

  // actions
  it.skip("should create a defaulkt actions library", function () {
  });

})
