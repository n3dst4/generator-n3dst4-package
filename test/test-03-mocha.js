/*eslint-env node, mocha */
var assert = require('yeoman-assert')
var path = require("path")
var runGenerator = require("./run-generator")
var camelName = runGenerator.camelName

describe("mocha prompt", function () {
  before(runGenerator({}, [], {mocha: true}))

  it("should create mocha.opts", function () {
    assert.file(path.join(this.dir, "test", "mocha.opts"))
  })

  it("should create a test suite", function () {
    assert.file(path.join(this.dir, "test", `test-${this.name}.js`))
  })

  it("should import the module under the right name", function () {
    assert.fileContent(
      path.join(this.dir, "test", `test-${this.name}.js`),
      new RegExp('var ' + camelName + ' = require\\("\\.\\./src/' + this.name + '"\\)')
    )
  })

  it("should add chai and mocha devDependencies", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      devDependencies: {
        "chai": "^3.5.0",
        "mocha": "^2.4.5",
        "sinon": "^2.1.0",
        "sinon-chai": "^2.9.0",
        "cross-env": "^3.2.4",
      }
    })
  })

  it("should add test and watch command", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      scripts: {
        test: "cross-env NODE_ENV=testing mocha",
        "watch-test": "npm test -- --watch"
      }
    })
  })

  describe("with babel enabled", function () {
    before(runGenerator({}, [], {mocha: true, babel: true}))

    it("should create mocha.opts", function () {
      assert.fileContent(
        path.join(this.dir, "test", "mocha.opts"),
        /--compilers js:babel-register/
      )
    })

    it("should create a test suite", function () {
      assert.file(path.join(this.dir, "test", `test-${this.name}.js`))
    })

    it("should import the module under the right name", function () {
      assert.fileContent(
        path.join(this.dir, "test", `test-${this.name}.js`),
        new RegExp('import ' + camelName + ' from "\\.\\./src/' + this.name + '"')
      )
    })

    it("should add install rewiring doodads", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        devDependencies: {
          "babel-plugin-rewire": "^1.0.0",
        }
      })
    })
  })
})
