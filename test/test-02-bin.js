/*eslint-env node, mocha */
var assert = require('yeoman-assert')
var path = require("path")
var runGenerator = require("./run-generator")

describe("bin prompt", function () {
  describe("with default name", function () {
    before(runGenerator({}, [], { bin: true }))
    it("should create a bin entry in package.json", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        bin: { [this.name]: `src/bin/${this.name}.js`},
        preferGlobal: true
      })
    })
    it("should create the bin file as es5", function () {
      assert.noFileContent(
        path.join(this.dir, "src", "bin", `${this.name}.js`),
        /import/
      )
    })
  })

  describe("with manually entered bin name", function (){
    before(runGenerator({}, [], { bin: true, binName: "spedoinkle" }))
    it("should use the name you give it", function () {
      assert.file(
        path.join(this.dir, "src", "bin", "spedoinkle.js")
      )
    })
    it("should create a bin entry in package.json", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        bin: { spedoinkle: `src/bin/spedoinkle.js`},
        preferGlobal: true
      })
    })

  })

  describe("with babel enabled", function () {
    before(runGenerator({}, [], {babel: true, bin: true}))

    it("should create the bin file as es6", function () {
      assert.fileContent(
        path.join(this.dir, "src", "bin", `${this.name}.js`),
        /import/
      )
    })

    it("should point bin into __build", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        bin: { [this.name]: `__build/bin/${this.name}.js`},
      })
    })
  })

})
