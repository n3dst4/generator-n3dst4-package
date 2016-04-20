/*eslint-env node, mocha */
var path = require("path")
var os = require("os")
var symlinkSync = require("fs").symlinkSync
var execSync = require("child_process").execSync
var assert = require('yeoman-assert')
var runGenerator = require("./run-generator")

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


  // gulp
  // this is kind of a slow suite so, we'll only trigger it once
  describe ("gulpfile", function () {
    //before(runGenerator({}, [], { spa: true }))

    before(function () {
      this.timeout(gulpTimeout)

      // symlink node_modules in the generated folder to node_modules in the
      // generator so save time on "npm install"
      // http://superuser.com/questions/104845/permission-to-make-symbolic-links-in-windows-7
      // https://github.com/nodejs/node-v0.x-archive/issues/6342
      try {
        symlinkSync(
          path.join(__dirname, "..", "node_modules"),
          path.join(this.dir, "node_modules")
        )
      }
      catch (err) {
        throw new Error(
          "symlinking node_module failed. If you are on Windows, you may " +
          "need to re-run these tests with elevated (administrator) " +
          "permissions. See " +
          "https://github.com/nodejs/node-v0.x-archive/issues/6342 " +
          "(it's a Windows \"feature\".)")
      }

      // run gulp!
      try {
        var scriptName = os.platform() === "win32" ? "gulp.cmd" : "gulp"
        execSync(path.join(__dirname, "..", "node_modules", ".bin", scriptName), {
          cwd: this.dir,
          timeout: gulpTimeout
        })
      }
      catch (err) {
        global["console"].error("vvv ERROR  vvv")
        global["console"].error(err.stdout? err.stdout.toString(): err)
        global["console"].error("^^^ ERROR  ^^^")
        throw err
      }
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
