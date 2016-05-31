/*eslint-env node, mocha */
var assert = require('yeoman-assert')
var path = require("path")
var runGenerator = require("./run-generator")

describe("bin prompt", function () {
  before(runGenerator({}, [], { bin: true }))
  it("should create a bin entry in package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      bin: { [this.name]: `src/bin/${this.name}.js`},
      preferGlobal: true
    })
  })
  it("should create the bin file", function () {
    assert.file(path.join(this.dir, "src", "bin", `${this.name}.js`))
  })

  describe("with babel enabled", function () {
    before(runGenerator({}, [], {babel: true, bin: true}))

    it("should point bin into __build", function () {
      assert.jsonFileContent(path.join(this.dir, "package.json"), {
        bin: { [this.name]: `__build/bin/${this.name}.js`},
      })
    })
  })

})
