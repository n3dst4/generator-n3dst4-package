/*eslint-env node, mocha */
var path = require("path")
var assert = require('yeoman-assert')
var runGenerator = require("./run-generator")

describe.only("react-redux generator", function () {
  before(runGenerator({}, [], { reactRedux: true }))

  it("should add dependencies to package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "devDependencies": {
      },
      "dependencies": {
        "react": "^15.1.0",
      }
    })
  })
})
