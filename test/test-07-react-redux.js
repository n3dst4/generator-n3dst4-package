/*eslint-env node, mocha */
var path = require("path")
var assert = require('yeoman-assert')
var runGenerator = require("./run-generator")

describe("react-redux generator", function () {
  before(runGenerator({}, [], { spa: true, reactRedux: true }))

  it("should add dependencies to package.json", function () {
    assert.jsonFileContent(path.join(this.dir, "package.json"), {
      "dependencies": {
        "immutable": "^3.8.1",
        "radium": "^0.17.1",
        "react": "^15.1.0",
        "react-addons-pure-render-mixin": "^15.1.0",
        "react-dom": "^15.1.0",
        "react-immutable-proptypes": "^1.7.1",
        "react-redux": "^4.4.5",
        "react-router": "^2.4.1",
        "redux": "^3.5.2",
        "redux-logger": "^2.6.1",
        "redux-storage": "^4.0.1",
        "redux-storage-decorator-debounce": "^1.0.1",
        "redux-storage-engine-localstorage": "^1.1.1",
        "redux-thunk": "^2.1.0",

      }
    })
  })

  it ("should create a structure of files for a redux app", function () {
    assert.file(path.join(this.dir, "src", "action-types.js"))
    assert.file(path.join(this.dir, "src", "actions.js"))
    assert.file(path.join(this.dir, "src", "history.js"))
    assert.file(path.join(this.dir, "src", "immutable-storage-decorator.js"))
    assert.file(path.join(this.dir, "src", "reducer.js"))
    assert.file(path.join(this.dir, "src", "components", "app.js"))
    assert.file(path.join(this.dir, "src", "containers", "app-container.js"))
  })

  it("should add an app div to the index.html", function () {
    assert.fileContent(path.join(this.dir, "pages", "index.html"), /<div id=\"app\"/)
  })

  it("should try to fake the NODE_PATH in the gulpfile", function () {
    assert.fileContent(
      path.join(this.dir, "gulpfile.babel.js"),
      /process\.env.NODE_PATH\s=\s['"].\/node_modules/
    )
  })

})
