/*eslint-env node, mocha */
var assert = require('yeoman-assert')
var path = require("path")
var runGenerator = require("./run-generator")

describe("react component prompt", function () {
  before(runGenerator({}, [], {reactComponent: true}))

  it("should create karma conf", function () {
    assert.file(path.join(this.dir, "karma.conf.js"))
  })

  it("should add various devDependencies", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      dependencies: {
        "prop-types": "^15.5.6",
      },
      devDependencies: {
        "chai-enzyme": "^0.6.1",
        "enzyme": "^2.8.0",
        "react": "^15.5.3",
        "react-addons-test-utils": "^15.5.1",
        "react-dom": "^15.5.3",
      }
    })
  })

  it("should import React into the main src file", function () {
    const filePath = path.join(this.dir, "src", `${this.name}.js`)
    assert.fileContent(filePath, "React")
  })

  it("should import enzyme into the test suite", function () {
    const filePath = path.join(this.dir, "test", `test-${this.name}.js`)
    assert.fileContent(filePath, "enzyme")
  })

})
