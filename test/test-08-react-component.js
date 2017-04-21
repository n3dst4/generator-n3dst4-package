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
        "enzyme": "^2.8.2",
        "react": "^15.5.3",
        "react-dom": "^15.5.3",
        "react-test-renderer": "^15.5.4",
      },
      "peerDependencies": {
        "react": ">=15.5.0",
        "react-dom": ">=15.5.0",
      }
    })
    assert.noJsonFileContent(path.join(this.dir, "package.json"), {
      devDependencies: {
        "react-addons-test-utils": "^15.5.1",
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
