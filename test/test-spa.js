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
  it("should have an npm start command to run in browser", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "scripts": {
        "start": "gulp develop"
      }
    })
  });

  // npm start to run test watch + browser-sync + watchify
  it("should have an npm build command", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "scripts": {
        "build": "gulp build"
      }
    })
  });

  // * watch mode
  it("should have a \"watch and serve\" gulp task", function () {
    assert.fileContent(
      path.join(this.dir, "gulpfile.babel.js"),
      /gulp\.task\("develop",/
    )
  })

  it("should add dependencies to package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "devDependencies": {
      },
      "dependencies": {
        "@n3dst4/browser-bundle": "^1.0.5",
        "@n3dst4/build-stylesheets": "^1.0.1",
        "browser-sync": "^2.12.3",
        "gulp": "^3.9.1",
        "gulp-csso": "^2.0.0",
        "gulp-if": "^2.0.0",
        "gulp-less": "^3.0.5",
        "gulp-plumber": "^1.1.0",
        "gulp-rework": "^1.2.0",
        "rework-assets": "^1.1.1",
      }
    })
  })

  it("should remove prepublish script from package.json", function () {
    assert.noJsonFileContent(path.join(this.dir, "package.json"), {
      "scripts": {
        "prepublish": "babel src --out-dir __build --source-maps inline"
      }
    })
  })

  it("should not have a <name>.js file", function () {
    assert.noFile(`src/${this.name}.js`)
  });

  it("should have a main.js file", function () {
    assert.file("src/main.js")
  });

  // gulp
  describe("gulpfile", function () {

    // this is kind of a slow operation so, we'll only trigger it once
    before(function () {
      fs.writeFileSync(path.join(this.dir, "stylesheets", "main.less"),
        "foo { &.bar { color: red } }")
      fs.writeFileSync(path.join(this.dir, "src", "lib.js"),
        "export default () => done()")
      fs.writeFileSync(path.join(this.dir, "src", "main.js"),
        "import lib from './lib'; lib()")
      this.gulpErr = runGulp.bind(this, gulpTimeout)()
    })

    it("should execute \"default\" task without error", function () {
      assert.equal(this.gulpErr, null)
    })

    describe("html", function () {
      // build html
      it("should have a doctype", function () {
        assert.fileContent(
          path.join(this.dir, "__generated", "index.html"),
          /^<!DOCTYPE html>/)
        })

      it("should link to main.js", function () {
        assert.fileContent(
          path.join(this.dir, "__generated", "index.html"),
          /<script\s*src="js\/main\.js"\s*><\/script>/)
      })

      it("should link to main.css", function () {
        assert.fileContent(
          path.join(this.dir, "__generated", "index.html"),
          /<link rel="stylesheet" href="css\/main\.css"\/>/)
      })
    })


    // build stylesheets
    it("should build stylesheets into output folder", function () {
      assert.fileContent(
        path.join(this.dir, "__generated", "css", "main.css"),
        /foo\.bar.[\s\S]*?color: red/)
    })

    // build browserified scripts
    // skipping for now until we can get gulpfile to laod @n3dst4/browser-bundle
    // when node_modules is symlinked to generator
    it("should build scripts into output folder", function (done) {
      fs.readFile(path.join(this.dir, "__generated", "js", "main.js"),
        function (err, code) {
          vm.runInNewContext(code, {done: done})
        })
    })

    // after testing the gulpfile, if anything went wrong, and we're not in CI
    // mode,l print out the folder name to make it easy to go and see what
    // occurred
    after("print out the directory name if appropriate", function () {
      var anyTestsFailed = this.test.parent.tests.some(
        function(t) { return t.state === "failed" }
      )
      var isCI = !!(process.env.CI)
      if (anyTestsFailed && !isCI) {
        global["console"].log(this.dir)
      }
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
